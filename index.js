import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  DEFAULTS,
  PLUGIN_ID,
  PLUGIN_NAME,
  VERSION,
  auditPath,
  backupsDir,
  configPath,
  dataDir,
  ensureDir,
  persistConfig,
  promptsDir,
  readJson,
  resolveConfig,
  resolveNotation,
} from "./lib/config.js";
import {
  PROJECTION_KEY,
  PROMPT_LABEL,
  VERDICT,
  buildTaskEnvelope,
  buildTriggerMap,
  classifyOutput,
  classifyRequest,
  designateFrom,
  envelopeKindFor,
  escapeNoteText,
  escapeText,
  fingerprint,
  foldEvent,
  initialState,
  loadPromptTexts,
  pickPromptId,
  promptTierProblems,
  resendFrameAt,
  vocabStats,
} from "./lib/core.js";
import { ENVELOPE_CLASSES, NOTATION_MODES, NOTATION_POLICY, notationTable } from "./lib/lexicon.js";
import { LEGAL_FILE, loadLegal } from "./lib/legal.js";
export const name = PLUGIN_ID;

export const inject = ["systemPrompt", "tools", "commands", "webServer", "sessionProjections"];

const EVENTS = {
  INBOX_INSERTED: "agent/inbox/inserted",
  PRE_STEP: "agent/pre-step",
  AGENT_STATUS: "agent/status",
};

const ESCAPE_COOLDOWN_MS = 5 * 60 * 1000;

const HERE = dirname(fileURLToPath(import.meta.url));

const LEGAL_COUNTDOWN_SECONDS = 20;

const LEGAL_TEXT_MARKER = "[QINGLAN-LEGAL-TEXT-V1]";
const BUILTIN_PROMPT_DIR = join(HERE, "prompts");

const runtime = {
  config: { ...DEFAULTS },
  rowConfig: {},
  userFile: {},
  configRev: 0,
  lastConfigStamp: "",
  lastConfigMtime: 0,
  pendingEngagements: [],
  prompts: {},
  promptsStamp: 0,
  sectionDisposer: null,
  sectionOrder: null,
  sectionText: "",
  sectionFingerprint: "",
  sessionOverrides: new Map(),
  engagedSessions: new Map(),
  engagedText: new Map(),
  riskSessions: new Map(),
  escapeSentAt: new Map(),
  lastEngagement: null,
  lastClientReport: null,

  lastClientHost: "",
  lastClientAddress: "",
  lastClientUserAgent: "",
  lastClientRequestAt: 0,
  payloadProbes: [],

  listenerBindings: [],
  engagementEvents: [],
  dedup: new Map(),
  rewrites: { ok: 0, fail: 0, lastHits: [], lastAt: 0 },

  escapeDecisions: [],

  preStepSeen: { at: 0, session: "", messages: 0, userMessages: 0 },
  errorLog: [],
  webRouteReady: false,
  webRouteAt: 0,
  statusCtx: null,
  lastAssembly: { at: 0, chars: 0, order: null, tier: "", promptId: "" },
};

function noteEngagement(ctx, agent, text, fromPlugin = false) {
  try {
    const session = sessionKey(agent);
    const clean = String(text || "").trim();

    if (!fromPlugin) {
      runtime.lastEngagement = { at: Date.now(), session, text: clean.slice(0, 200) };
      if (session) {
        runtime.engagedSessions.set(session, Date.now());
        if (clean) runtime.engagedText.set(session, clean.slice(0, 200));

        if (runtime.engagedSessions.size > 60) {
          const oldest = [...runtime.engagedSessions.entries()].sort((a, b) => a[1] - b[1])[0];
          if (oldest) {
            runtime.engagedSessions.delete(oldest[0]);
            runtime.engagedText.delete(oldest[0]);
          }
        }
      }
    }
    const list = runtime.pendingEngagements;
    list.push({
      at: Date.now(),
      session,
      text: clean.slice(0, 160),
      fromPlugin,
      order: runtime.config.injectionOrder,
      tier: runtime.config.tier,
      chars: runtime.sectionText.length,
      fingerprint: runtime.sectionFingerprint,
    });
    while (list.length > 20) list.shift();
  } catch {

  }
}

function deliverToSession(ctx, payloadAgent, session, message) {
  const agents = ctx.get("agents");
  let target = undefined;
  if (agents && typeof agents.get === "function" && session) {
    try {
      target = agents.get(session);
    } catch {
      target = undefined;
    }
  }
  const chosen = target || payloadAgent;
  if (!chosen || typeof chosen.followup !== "function") return { ok: false, via: "" };
  chosen.followup(message);
  return { ok: true, via: target ? "agents.get" : "payload" };
}

function log(...args) {
  if (runtime.config.verbose) console.log(`[${PLUGIN_ID}]`, ...args);
}

function recordError(where, error) {
  try {
    runtime.errorLog.push({
      at: new Date().toISOString(),
      where: String(where || ""),
      error: String(error?.stack || error?.message || error).slice(0, 400),
    });
    while (runtime.errorLog.length > 10) runtime.errorLog.shift();
    log("listener error", where, String(error?.message || error));
  } catch {

  }
}

const AUDIT_TEXT_LIMIT = 400;
const LONG_TEXT_KEY = /^(_?text|textBefore|textAfter|raw|note|section(Head|Tail)?|probe|report|status)$/;

function truncateForAudit(value, limit = AUDIT_TEXT_LIMIT) {
  if (typeof value !== "string") return value;
  return value.length > limit ? `${value.slice(0, limit)}…[截断，共 ${value.length} 字]` : value;
}

function textDigest(text, words) {
  const value = String(text || "");
  const cjk = (value.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latin = (value.match(/[A-Za-z]/g) || []).length;
  return {
    len: value.length,
    cjk,
    latin,
    head: value.slice(0, 60),
    matched: Array.isArray(words) ? words.slice(0, 12) : [],
  };
}

function auditPathOf() {
  return auditPath();
}

function auditRotateIfNeeded(maxBytes, keepFiles) {
  const file = auditPathOf();
  let size = 0;
  try {
    size = statSync(file).size;
  } catch {
    return false;
  }
  if (!(maxBytes > 0) || size < maxBytes) return false;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const archived = `${file}.${stamp}`;
  try {
    renameSync(file, archived);
  } catch {
    return false;
  }

  try {
    const dir = dirname(file);
    const base = basename(file);
    const olds = readdirSync(dir)
      .filter((name) => name.startsWith(`${base}.`) && name !== base)
      .map((name) => {
        const full = join(dir, name);
        let mtime = 0;
        try {
          mtime = statSync(full).mtimeMs;
        } catch {

        }
        return { full, mtime };
      })
      .sort((a, b) => b.mtime - a.mtime);
    for (const item of olds.slice(Math.max(0, keepFiles))) {
      try {
        unlinkSync(item.full);
      } catch {

      }
    }
  } catch {

  }
  return true;
}

const AUDIT_SCHEMA = 2;

function auditBase() {
  const cfg = runtime.config || {};
  return {
    v: AUDIT_SCHEMA,
    version: VERSION,
    tier: cfg.tier || "",
    prompt: cfg.promptId || "",
    notation: (() => {
      try {
        return resolveNotation(cfg);
      } catch {
        return "";
      }
    })(),
  };
}

const AUDIT_TEXT_CAP = 400;

function audit(kind, payload) {
  if (!runtime.config.logAudit) return;
  try {
    ensureDir(dataDir());
    auditRotateIfNeeded(runtime.config.auditMaxBytes, runtime.config.auditKeepFiles);
    const safe = { ...(payload || {}) };
    for (const key of Object.keys(safe)) {
      if (LONG_TEXT_KEY.test(key)) safe[key] = truncateForAudit(safe[key]);
      else if (typeof safe[key] === "string" && safe[key].length > AUDIT_TEXT_CAP) {
        safe[key] = `${safe[key].slice(0, AUDIT_TEXT_CAP)}…(${safe[key].length}字)`;
      }
    }
    appendFileSync(auditPath(), `${JSON.stringify({ t: Date.now(), kind, ...auditBase(), ...safe })}\n`, "utf8");
  } catch {

  }
}

function refreshPrompts(force = false) {

  let stamp = 0;
  try {
    stamp = statSync(BUILTIN_PROMPT_DIR).mtimeMs;
    const user = promptsDir();
    if (existsSync(user)) stamp = Math.max(stamp, statSync(user).mtimeMs);
  } catch {
    stamp = 0;
  }
  if (!force && stamp !== 0 && stamp === runtime.promptsStamp && Object.keys(runtime.prompts).length > 1) {
    return runtime.prompts;
  }
  runtime.promptsStamp = stamp;
  runtime.prompts = loadPromptTexts(BUILTIN_PROMPT_DIR, promptsDir());
  const rejected = runtime.prompts.__rejected || {};
  if (Object.keys(rejected).length > 0) log("prompt overrides rejected", JSON.stringify(rejected));
  runtime.configRev = (runtime.configRev || 0) + 1;
  return runtime.prompts;
}

function reloadConfig(rowConfig) {
  runtime.rowConfig = rowConfig || runtime.rowConfig || {};
  runtime.userFile = readJson(configPath(), {});
  runtime.config = resolveConfig(runtime.rowConfig);
  runtime.configRev = (runtime.configRev || 0) + 1;
  refreshPrompts();
  return runtime.config;
}

function refreshConfig(ctx) {
  const file = configPath();
  let stamp = 0;
  try {
    if (existsSync(file)) {
      const stat = statSync(file);
      stamp = stat.mtimeMs;
    }
  } catch {
    stamp = 0;
  }
  runtime.userFile = readJson(file, {});
  const before = JSON.stringify({
    row: runtime.rowConfig,
    user: runtime.userFile,
  });
  if (before !== runtime.lastConfigStamp) {
    runtime.lastConfigStamp = before;
    resolveAndInstall(ctx);
    return true;
  }
  if (stamp !== runtime.lastConfigMtime) {
    runtime.lastConfigMtime = stamp;
    resolveAndInstall(ctx);
    return true;
  }
  return false;
}

function resolveAndInstall(ctx) {
  runtime.config = resolveConfig(runtime.rowConfig);
  runtime.configRev = (runtime.configRev || 0) + 1;
  runtime.userFile = readJson(configPath(), {});
  runtime.lastConfigStamp = JSON.stringify({ row: runtime.rowConfig, user: runtime.userFile });
  try {
    runtime.lastConfigMtime = existsSync(configPath()) ? statSync(configPath()).mtimeMs : 0;
  } catch {
    runtime.lastConfigMtime = 0;
  }
  refreshPrompts();
  if (ctx && ctx.systemPrompt) installSection(ctx);
}

function sessionKey(agentOrSession) {
  if (!agentOrSession) return "";
  const id = agentOrSession?.id ?? agentOrSession?.session?.id ?? agentOrSession?.sessionId ?? "";
  if (typeof id === "string") return id;
  if (id && typeof id.toString === "function") {
    const text = id.toString();
    return text && text !== "[object Object]" ? text : "";
  }
  return "";
}

function sessionEnabled(agent) {
  const key = sessionKey(agent);
  if (key && runtime.sessionOverrides.has(key)) return runtime.sessionOverrides.get(key);
  return runtime.config.enabled !== false;
}

function cfgAllowsNote() {
  return runtime.config.triggerEscapeNote === true;
}

function legalDoc() {
  return loadLegal(HERE);
}

function legalAcceptedNow() {
  try {
    const doc = legalDoc();
    return runtime.config.legalAccepted === true
      && String(runtime.config.legalAcceptedHash || "") === doc.hash
      && !doc.error;
  } catch {
    return false;
  }
}

const LEGAL_PENDING_SECTION = "[QingLan · 待确认免责协议]";

function buildSectionText() {
  const cfg = runtime.config;
  if (cfg.enabled === false) return "";

  if (!legalAcceptedNow()) return LEGAL_PENDING_SECTION;
  const requested = cfg.promptId && typeof runtime.prompts[cfg.promptId] === "string" ? cfg.promptId : pickPromptId(cfg.tier);
  let id = requested;
  let text = runtime.prompts[id] || "";
  if (!text) {

    const fallback = "qinglan-core";
    if (runtime.prompts[fallback]) {
      id = fallback;
      text = runtime.prompts[fallback];
      log("prompt fallback", `${requested} -> ${fallback}`);
    }
  }
  if (!text) return "";
  const meta = `[qd:${VERSION}|tier=${cfg.tier}|pos=${cfg.injectionOrder}|src=${id}]`;
  const body = `${text}\n\n${meta}`;
  const stamp = fingerprint(body);
  if (stamp !== runtime.sectionFingerprint) {
    runtime.sectionFingerprint = stamp;
    runtime.sectionText = body;
    log("section rebuilt", { tier: cfg.tier, id, order: cfg.injectionOrder, chars: body.length });
  }
  runtime.lastAssembly = {
    at: Date.now(),
    chars: runtime.sectionText.length,
    order: cfg.injectionOrder,
    tier: cfg.tier,
    promptId: id,
  };
  return runtime.sectionText;
}

function installSection(ctx) {
  try {
    runtime.sectionDisposer?.();
  } catch {

  }
  const order = runtime.config.injectionOrder;
  const disposal = ctx.systemPrompt.section({
    name: `${PLUGIN_ID}:frame`,
    order,
    interpolate: false,
    text: () => {
      try {
        if (!runtime.config.enabled) return "";
        refreshConfig(null);
        refreshPrompts();
        return buildSectionText();
      } catch (error) {
        log("section text failed", String(error?.message || error));
        return "";
      }
    },
  });
  runtime.sectionDisposer = typeof disposal === "function" ? disposal : null;
  runtime.sectionOrder = order;
  log("section installed at order", order);
}

function backupFile(file) {
  try {
    if (!existsSync(file)) return "";
    ensureDir(backupsDir());
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const target = join(backupsDir(), `${basename(file)}.${stamp}.bak`);
    writeFileSync(target, readFileSync(file, "utf8"), "utf8");
    return target;
  } catch {
    return "";
  }
}

const jsonOutput = {
  schema: { type: "object", additionalProperties: true },
  render: (_args, value) => [{ type: "text", text: JSON.stringify(value, null, 2) }],
};

function buildStatus() {
  const cfg = runtime.config;

  try {
    buildSectionText();
  } catch (error) {
    recordError("buildSectionText", error);
  }
  const section = runtime.sectionText || "";
  const checks = [];
  if (!section) checks.push({ level: "error", text: "注入正文为空：稿件读取失败" });
  else checks.push({ level: "ok", text: `注入正文 ${section.length} 字` });
  const rejected = runtime.prompts && runtime.prompts.__rejected ? runtime.prompts.__rejected : null;
  if (rejected && Object.keys(rejected).length > 0) {
    checks.push({ level: "warn", text: `已忽略无效的用户稿：${Object.keys(rejected).join(", ")}（小于 200 字视为无效）` });
  }
  if (section && cfg.injectionOrder > 0) {
    checks.push({ level: "warn", text: "当前位置在 persona 之后，效果偏弱；建议切「紧跟身份(-100)」或「极限抢占(-999)」" });
  }
  if (section && section.length > 12000) {
    checks.push({ level: "warn", text: "正文偏长，可能引起前缀缓存失效；可切 L1 档" });
  }

  const tierProblems = promptTierProblems(cfg, runtime.prompts);
  if (tierProblems.length > 0) {
    for (const text of tierProblems) checks.push({ level: "warn", text });
  } else if (section) {
    checks.push({
      level: "ok",
      text: `档位与稿子一致：${cfg.tier} → ${cfg.promptId}（${PROMPT_LABEL[cfg.promptId] || cfg.promptId}）`,
    });
  }
  const recent = runtime.pendingEngagements.slice(-5);
  const blocked = recent.filter((row) => row.verdict === "refusal" || row.verdict === "fallback").length;
  return {
    plugin: PLUGIN_ID,
    brand: PLUGIN_NAME,
    version: VERSION,
    enabled: cfg.enabled !== false,
    tier: cfg.tier,
    promptId: cfg.promptId && runtime.prompts[cfg.promptId] ? cfg.promptId : pickPromptId(cfg.tier),

    promptLabel: PROMPT_LABEL[cfg.promptId && runtime.prompts[cfg.promptId] ? cfg.promptId : pickPromptId(cfg.tier)] || "",
    tierMismatch: promptTierProblems(cfg, runtime.prompts).length > 0,
    tierProblems: promptTierProblems(cfg, runtime.prompts),

    sectionCharsForTier: { lite: 2119, standard: 4895, extreme: 5653 }[cfg.tier] ?? null,
    injectionOrder: cfg.injectionOrder,
    sectionChars: section.length,
    sectionFingerprint: runtime.sectionFingerprint,
    sectionHead: section.slice(0, 200),
    sectionTail: section.slice(-160),
    checks,
    recentBlocked: blocked,
    model: runtime.statusCtx ? readModelSelection(runtime.statusCtx) : null,
    escape: {
      enabled: cfg.triggerEscape !== false,
      note: cfg.triggerEscapeNote !== false,
      terms: vocabStats(buildTriggerMap(cfg.triggerMap)).effective,
      userTerms: Object.keys(cfg.triggerMap || {}).length,
      byCategory: vocabStats().byCategory,
      sessions: runtime.escapeSentAt.size,

      notation: resolveNotation(cfg),
      notationLabel: NOTATION_MODES[resolveNotation(cfg)] || "",
      notationPolicy: notationTable(),

      envelope: {
        enabled: cfg.taskEnvelope !== false,
        kinds: Object.entries(ENVELOPE_CLASSES).map(([id, v]) => ({ id, label: v.label })),
        lastKind: runtime.envelopes?.lastKind || "",
        applied: runtime.envelopes?.ok || 0,
        preview: runtime.envelopes?.lastText || "",
      },
    },
    lastAssembly: runtime.lastAssembly,

    legal: (() => {
      const doc = legalDoc();
      const acceptedHash = String(cfg.legalAcceptedHash || "");
      const accepted = legalAcceptedNow();
      return {
        version: doc.version,
        hash: doc.hash,
        accepted,
        acceptedAt: cfg.legalAcceptedAt || 0,

        stale: cfg.legalAccepted === true && acceptedHash !== doc.hash,
        countdownSeconds: LEGAL_COUNTDOWN_SECONDS,
        text: accepted ? "" : doc.text,
        injects: accepted ? "prompt" : "pending",
        file: LEGAL_FILE,
        error: doc.error,
      };
    })(),

    pipeline: {
      listeners: runtime.listenerBindings.slice(-6),
      events: Array.isArray(runtime.engagementEvents) ? runtime.engagementEvents.slice(-6) : [],
      dedup: runtime.dedup ? runtime.dedup.size : 0,
      rewrites: runtime.rewrites || { ok: 0, fail: 0, lastHits: [], lastAt: 0 },
      errors: runtime.errorLog.slice(-5),

      escape: Array.isArray(runtime.escapeDecisions) ? runtime.escapeDecisions.slice(-6) : [],

      envelopes: runtime.envelopes || { ok: 0, fail: 0, lastKind: "", lastAt: 0, lastText: "" },
      preStep: runtime.preStepSeen || null,
    },

    routing: {
      engagedSessions: runtime.engagedSessions.size,
      engaged: Object.fromEntries(
        [...runtime.engagedSessions.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, at]) => [id, new Date(at).toISOString()]),
      ),
      lastEngagement: runtime.lastEngagement ? { session: runtime.lastEngagement.session, at: new Date(runtime.lastEngagement.at).toISOString() } : null,
    },

    channel: {
      webRouteReady: runtime.webRouteReady === true,
      webRouteAt: runtime.webRouteAt || 0,
      clientLastReport: runtime.lastClientReport || null,
      inject: inject,
    },

    network: (() => {
      try {
        const families = [];
        try {
          const ifaces = networkInterfaces();
          for (const [name, list] of Object.entries(ifaces)) {
            for (const item of list || []) {
              if (!item || item.family !== "IPv4") continue;
              families.push({ iface: name, address: item.address, internal: item.internal === true });
            }
          }
        } catch {

        }

        let host = "";
        let hostSource = "";
        try {
          const ws = ctx.get("webServer");
          if (ws && typeof ws.server?.address === "function") {
            const addr = ws.server.address();
            if (addr && typeof addr === "object" && typeof addr.address === "string") {
              host = addr.address;
              hostSource = "webServer.server.address()";
            }
          }
        } catch {

        }
        if (!host) {
          host = String(runtime.config.webServerHost || "");
          hostSource = "config.webServerHost";
        }

        const loopback = families.filter((f) => f.internal || f.address.startsWith("127.")).map((f) => f.address);
        const lan = families.filter((f) => !f.internal && !f.address.startsWith("127.")).map((f) => f.address);

        const allInterfaces = host === "0.0.0.0" || host === "::" || host === "::0";
        const onlyLoopback = host === "127.0.0.1" || host === "::1" || host.startsWith("127.");
        const exposed = allInterfaces ? true : onlyLoopback ? false : null;

        let port = null;
        try {
          const ws = ctx.get("webServer");
          const p = ws && (typeof ws.port === "number" ? ws.port : ws.listenedPort);
          if (typeof p === "number" && p > 0) port = p;
        } catch {

        }

        return {

          bindHost: host,
          bindHostSource: hostSource,

          bindPort: port,

          clientHost: runtime.lastClientHost || "",
          clientAddress: runtime.lastClientAddress || "",
          lastRequestAt: runtime.lastClientRequestAt || 0,
          lastUserAgent: runtime.lastClientUserAgent || "",
          loopback,
          lan,

          exposed,

          reason: allInterfaces
            ? "绑定 0.0.0.0：所有网卡可达，局域网内可用"
            : onlyLoopback
              ? `绑定 ${host}：仅本机可达（机器上有 ${lan.length} 个非回环地址，但界面不监听它们）`
              : `无法确定绑定（${hostSource} 给出 ${JSON.stringify(host)}）`,
        };
      } catch (error) {
        return { error: String(error?.message || error), exposed: null };
      }
    })(),
    sessions: runtime.sessionOverrides.size,
    sessionOverrides: Object.fromEntries(runtime.sessionOverrides),
    pendingEngagements: recent,
    config: {
      enabled: cfg.enabled !== false,
      tier: cfg.tier,
      promptId: cfg.promptId,
      injectionOrder: cfg.injectionOrder,
      badgeText: cfg.badgeText,
      badgePassText: cfg.badgePassText,
      badgeFailText: cfg.badgeFailText,
      badgeThinkingText: cfg.badgeThinkingText,
      refusalScan: cfg.refusalScan !== false,
      autoResend: cfg.autoResend !== false,
      autoResendMax: cfg.autoResendMax,
      autoResendText: cfg.autoResendText,
      mildRecover: cfg.mildRecover !== false,
    },
    configPath: configPath(),
    dataDir: dataDir(),
    auditPath: auditPath(),
    hostPolicy: {
      officialFilesTouched: false,
      shim: false,
      backupsWrittenUnder: backupsDir(),
    },
  };
}

function makeControlTool(ctx, deps) {
  return {
    name: "qinglan_control",
    description:
      "QingLan 破甲中枢控制台：查询/修改本插件状态。action=status 看全量状态；action=config 改配置（会落盘）；action=session 切当前会话开关；action=toggle 总开关；action=tier 换档位；action=escape-test 用 text 做**只读自检**：看这段文本会不会被词表转写（返回命中的词与改写预览，不发送任何消息）。",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["status", "config", "session", "toggle", "tier", "reload", "escape-test", "legal-accept"],
        },
        patch: { type: "object", additionalProperties: true, description: "action=config 时要写入的字段" },
        enabled: { type: "boolean", description: "action=session/toggle 时的目标状态" },
        tier: { type: "string", enum: ["lite", "standard", "extreme"] },
        text: { type: "string", description: "action=escape-test 时要自检的文本（只读，不会被发送）" },
      },
      required: ["action"],
      additionalProperties: false,
    },
    output: jsonOutput,
    async execute(args) {
      const action = String(args?.action || "status");

      const legalGate = legalAcceptedNow();
      const READ_ONLY_ACTIONS = new Set(["status", "escape-test", "legal-accept"]);
      if (!legalGate && !READ_ONLY_ACTIONS.has(action)) {
        audit("legal-blocked", { action, via: "tool" });
        return { ok: false, error: "未接受免责协议：请先在界面上确认协议（本插件不提供跳过）" };
      }

      if (action === "status") {
        refreshConfig(runtime.statusCtx || null);
        return buildStatus();
      }
      if (action === "reload") {
        reloadConfig(runtime.rowConfig);
        return { ok: true, ...buildStatus() };
      }
      if (action === "config") {
        const patch = args?.patch && typeof args.patch === "object" ? args.patch : {};
        const saved = persistConfig(patch, runtime.userFile || {});
        runtime.userFile = saved.config;
        reloadConfig(runtime.rowConfig);
        if (typeof runtime.reapply === "function") runtime.reapply();
        audit("config", { patch });
        return { ok: saved.ok, ...buildStatus() };
      }
      if (action === "toggle") {
        const enabled = args?.enabled !== false;
        const saved = persistConfig({ enabled }, runtime.userFile || {});
        runtime.userFile = saved.config;
        reloadConfig(runtime.rowConfig);
        if (typeof runtime.reapply === "function") runtime.reapply();
        return { ok: saved.ok, ...buildStatus() };
      }
      if (action === "tier") {
        const tier = ["lite", "standard", "extreme"].includes(args?.tier) ? args.tier : "standard";
        const saved = persistConfig(
          { tier, promptId: pickPromptId(tier) },
          runtime.userFile || {},
        );
        runtime.userFile = saved.config;
        reloadConfig(runtime.rowConfig);
        if (typeof runtime.reapply === "function") runtime.reapply();
        return { ok: saved.ok, ...buildStatus() };
      }
      if (action === "session") {
        const agent = deps.currentAgent?.();
        const key = sessionKey(agent);
        const next = typeof args?.enabled === "boolean" ? args.enabled : !sessionEnabled(agent);
        if (key) runtime.sessionOverrides.set(key, next);
        audit("session", { key, enabled: next });

        return { ...buildStatus(), ok: true, session: key, sessionEnabled: next };
      }
      if (action === "legal-accept") {

        const doc = loadLegal(HERE);
        if (doc.error || !doc.hash) return { ok: false, error: `协议文件不可用：${doc.error || "unknown"}` };
        const at = Date.now();
        const saved = persistConfig(
          { legalAccepted: true, legalAcceptedAt: at, legalAcceptedHash: doc.hash },
          runtime.userFile || {},
        );
        runtime.userFile = saved.config || runtime.userFile;
        reloadConfig(runtime.rowConfig);
        audit("legal-accept", {
          version: doc.version,
          hash: doc.hash,
          at,
          session: sessionKey(deps.currentAgent?.() || null),
          via: "tool",
        });
        return { ok: saved.ok, legal: buildStatus().legal, ...buildStatus() };
      }
      if (action === "escape-test") {

        const text = typeof args?.text === "string" ? args.text : "";
        const plan = makeEscapePlanner()(text, { hook: "escape-check", echo: true });
        audit("escape-test", plan.echo || { len: plan.len, decision: plan.decision });
        return {
          ok: true,
          check: {
            len: plan.len,
            cjk: plan.cjk,
            latin: plan.latin,
            terms: plan.terms,
            matched: plan.matched.slice(0, 12),
            hits: plan.hits.slice(0, 12),
            decision: plan.decision,

            notation: plan.notation,
            notationLabel: NOTATION_MODES[plan.notation] || "",
            wouldRewrite: plan.needsRewrite,
            wouldDeliverNote: plan.shouldDeliverNote,
            preview: plan.escaped.slice(0, 200),
          },
        };
      }
      return { ok: false, error: `unknown action: ${action}` };
    },
  };
}

function makeDoctorTool() {
  return {
    name: "qinglan_doctor",
    description:
      "QingLan 破甲体检：报告当前注入状态、段位、字符数、近期拒绝统计与本地审计路径。只读。",
    parameters: { type: "object", properties: {}, additionalProperties: false },
    output: jsonOutput,
    async execute() {
      const status = buildStatus();
      const warn = [];
      if (!runtime.sectionText) warn.push("注入正文为空：检查 prompts/ 是否被破坏");
      if (status.sectionChars > 12000) warn.push("注入正文偏长，可能触发前缀缓存失效（建议换 lite 档）");
      if (runtime.config.tier === "standard" && status.injectionOrder > 0) {
        warn.push("当前位置在 persona 之后，效果偏弱；建议切到「紧跟身份」(-100) 或「极限抢占」(-999)");
      }
      return {
        ok: warn.length === 0,
        status,
        warnings: warn,
      };
    },
  };
}

function installRefusalResend(ctx) {
  if (typeof ctx.on !== "function") return;
  const perSession = new Map();
  const listen = bindEventFor(ctx);
  listen(EVENTS.AGENT_STATUS, (payload) => {
    const cfg = runtime.config;
    if (!cfg.enabled || !cfg.autoResend) return;
    const agent = payload?.agent;
    if (!agent || payload?.status !== "idle") return;
    if (agent.status === "running") return;
    if (!sessionEnabled(agent)) return;
    const session = agent.session;
    if (!session || typeof session.snapshotEvents !== "function") return;
    let events = [];
    try {
      events = session.snapshotEvents() || [];
    } catch {
      return;
    }
    let lastEnd = null;
    let lastAssistant = "";
    for (let i = events.length - 1; i >= 0; i -= 1) {
      const event = events[i];
      if (!lastEnd && event?.type === "turn/end") lastEnd = event;
      if (!lastAssistant && event?.type === "assistant/message") {
        const blocks = event?.data?.message?.content;
        if (Array.isArray(blocks)) {
          lastAssistant = blocks
            .filter((block) => block && block.type === "text" && typeof block.text === "string")
            .map((block) => block.text)
            .join("\n")
            .trim();
        }
      }
      if (lastEnd && lastAssistant) break;
    }
    if (!lastEnd || lastEnd?.data?.reason?.kind !== "completed") return;
    if (!lastAssistant) return;

    const scored = classifyOutput(lastAssistant);
    const blocked =
      scored.verdict === VERDICT.REFUSAL || (cfg.mildRecover && scored.verdict === VERDICT.FALLBACK);
    if (!blocked) return;

    const turn = lastEnd?.data?.turn || 0;
    const key = sessionKey(agent);
    if (!key) return;

    const engagedAt = runtime.engagedSessions.get(key) || 0;
    const engagedRecently = engagedAt > 0 && Date.now() - engagedAt <= 30 * 60 * 1000;
    const lastEngage = runtime.lastEngagement;
    const isLatestEngagement = Boolean(lastEngage && lastEngage.session === key);
    if (!engagedRecently && !isLatestEngagement) {
      audit("resend-skip", {
        session: key,
        reason: "not-engaged-session",
        engaged: engagedAt ? new Date(engagedAt).toISOString() : "",
        latest: lastEngage ? lastEngage.session : "",
      });
      return;
    }
    if (!engagedRecently && Date.now() - (lastEngage?.at || 0) > 30 * 60 * 1000) {
      audit("resend-skip", { session: key, reason: "engagement-expired" });
      return;
    }

    const engageText = runtime.engagedText.get(key) || (isLatestEngagement ? lastEngage.text : "") || "";

    const slotKey = `${turn}:${lastEnd?.seq || 0}`;
    const slot = perSession.get(key) || { turn: -1, count: 0, lastKey: "", total: 0 };
    if (slot.turn !== turn) {
      slot.turn = turn;
      slot.lastKey = "";
    }
    if (slot.lastKey === slotKey) return;
    if (slot.count >= cfg.autoResendMax) return;

    const subject = cfg.resendIncludeSubject !== false && engageText ? engageText.trim() : "";
    const valuesTerm = (cfg.valuesTerms || []).find((word) => subject.toLowerCase().includes(String(word).toLowerCase()));

    let carrier = 0;
    let base = "";
    let carrierLabel = "default";
    if (valuesTerm && cfg.autoResendValuesText) {
      base = cfg.autoResendValuesText;
      carrierLabel = "values";
    } else if (cfg.resendFrameRotation !== false) {
      const frame = resendFrameAt(slot.total || 0);
      carrier = (slot.total || 0) % Math.max(1, (cfg.autoResendVariants || []).length || 1);
      base = frame.text;
      carrierLabel = `${frame.id || "frame"}`;
    } else {
      const variants = Array.isArray(cfg.autoResendVariants) && cfg.autoResendVariants.length > 0 ? cfg.autoResendVariants : null;
      carrier = valuesTerm || !variants ? 0 : (slot.total || 0) % variants.length;
      base = variants ? variants[carrier] : cfg.autoResendText;
      carrierLabel = variants ? `${carrier + 1}/${variants.length}` : "default";
    }
    const text = subject ? `${base}\n【原任务】${subject}` : base;

    const delivery = deliverToSession(ctx, agent, key, {
      id: `${PLUGIN_ID}-resend-${Date.now().toString(36)}`,
      role: "user",
      content: [{ type: "text", text }],

      source: { kind: `plugin:${PLUGIN_ID}`, form: "notice", summary: "qinglan-resend" },
    });
    if (!delivery.ok) {
      audit("resend-skip", { session: key, reason: "no-delivery-channel" });
      return;
    }
    slot.count += 1;
    slot.total = (slot.total || 0) + 1;
    slot.lastKey = slotKey;
    perSession.set(key, slot);
    audit("resend", { session: key, turn, words: scored.words, via: delivery.via, subject: subject ? "yes" : "no", carrier: carrierLabel });
    log("resend fired", { turn, verdict: scored.verdict, via: delivery.via, carrier: carrierLabel });
  });
}

function readModelSelection(ctx) {
  try {
    const service = ctx.get("agentDefaultModel");
    if (!service || typeof service.currentSelection !== "function") return null;
    const current = service.currentSelection();
    if (!current || typeof current !== "object") return null;
    return { provider: current.provider || "", model: current.model || "", reasoningEffort: current.reasoningEffort ? String(current.reasoningEffort) : "" };
  } catch {
    return null;
  }
}

async function applyModelSelection(ctx, patch) {
  const service = ctx.get("agentDefaultModel");
  if (!service || typeof service.saveSelection !== "function") {
    return { ok: false, error: "agentDefaultModel service unavailable" };
  }
  const current = readModelSelection(ctx) || { provider: "deepseek-account", model: "deepseek-flash", reasoningEffort: "" };
  const next = {
    provider: patch.provider || current.provider,
    model: patch.model || current.model,
  };
  const effort = patch.reasoningEffort !== undefined ? patch.reasoningEffort : current.reasoningEffort;
  if (effort) next.reasoningEffort = String(effort);
  try {
    await service.saveSelection(next);
    audit("model-selection", next);
    return { ok: true, selection: readModelSelection(ctx) || next };
  } catch (error) {
    return { ok: false, error: String(error?.message || error) };
  }
}

function readBody(req, limit = 65536) {
  return new Promise((resolve) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        req.destroy();
        resolve("");
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", () => resolve(""));
  });
}

function installWebRoute(ctx) {
  const server = ctx.get("webServer");
  if (!server || typeof server.register !== "function") {

    runtime.webRouteReady = false;
    log("web route deferred: webServer not ready yet");
    if (typeof ctx.inject === "function") {
      try {
        ctx.inject(["webServer"], (inner) => {
          if (runtime.webRouteReady) return;
          installWebRoute(inner);
        });
      } catch (error) {
        log("web route inject retry failed", String(error?.message || error));
      }
    }
    return;
  }
  if (runtime.webRouteReady) return;
  const handler = async (req, res) => {

    try {
      runtime.lastClientHost = String(req.headers?.host || "");
      runtime.lastClientAddress = String(req.socket?.remoteAddress || "");
      runtime.lastClientUserAgent = String(req.headers?.["user-agent"] || "").slice(0, 160);
      runtime.lastClientRequestAt = Date.now();
    } catch {

    }
    const send = (code, value) => {
      try {
        res.statusCode = code;
        res.setHeader("content-type", "application/json; charset=utf-8");
        res.setHeader("cache-control", "no-store");
        res.end(JSON.stringify(value));
      } catch {

      }
    };
    try {
      if (req.method === "GET") {
        refreshConfig(ctx);
        send(200, { ok: true, status: buildStatus() });
        return;
      }
      if (req.method !== "POST") {
        send(405, { ok: false, error: "method not allowed" });
        return;
      }
      const raw = await readBody(req);
      let body = {};
      try {
        body = raw ? JSON.parse(raw) : {};
      } catch {
        send(400, { ok: false, error: "invalid json" });
        return;
      }
      const action = String(body.action || "status");

      const legalGate = legalAcceptedNow();
      const HTTP_READ_ONLY = new Set(["status", "debug", "client-report", "client-reports", "legal-accept", "escape-check"]);
      if (!legalGate && !HTTP_READ_ONLY.has(action)) {
        audit("legal-blocked", { action, via: "http" });
        send(403, { ok: false, error: "未接受免责协议：请先在界面上确认协议（本插件不提供跳过）", legal: buildStatus().legal });
        return;
      }
      if (action === "status") {
        refreshConfig(ctx);
        send(200, { ok: true, status: buildStatus() });
        return;
      }
      if (action === "model") {
        if (body.patch && typeof body.patch === "object") {
          const result = await applyModelSelection(ctx, body.patch);
          send(result.ok ? 200 : 500, { ok: result.ok, error: result.error, model: result.selection || readModelSelection(ctx) });
          return;
        }
        send(200, { ok: true, model: readModelSelection(ctx) });
        return;
      }
      if (action === "prompt") {
        refreshConfig(ctx);
        const id = String(body.id || runtime.config.promptId || "qinglan-core");
        const text = runtime.prompts[id] || "";
        if (body.write === true) {

          const safeId = id.replace(/[^a-z0-9-]/gi, "");
          const dir = promptsDir();
          if (!ensureDir(dir)) {
            send(500, { ok: false, error: "prompt dir not writable" });
            return;
          }
          const file = join(dir, `${safeId}.md`);
          if (existsSync(file)) backupFile(file);
          try {
            writeFileSync(file, typeof body.text === "string" ? body.text : "", "utf8");
            runtime.rowConfig = { ...runtime.rowConfig, promptId: safeId };
            persistConfig({ promptId: safeId }, runtime.userFile || {});
            resolveAndInstall(ctx);
            audit("prompt-write", { id: safeId, chars: String(body.text || "").length });
            send(200, { ok: true, status: buildStatus() });
          } catch (error) {
            send(500, { ok: false, error: String(error?.message || error) });
          }
          return;
        }
        send(200, { ok: true, id, text, length: text.length });
        return;
      }
      if (action === "legal-accept") {

        const doc = loadLegal(HERE);
        if (doc.error || !doc.hash) {
          send(500, { ok: false, error: `协议文件不可用：${doc.error || "unknown"}` });
          return;
        }
        const at = Date.now();
        const saved = persistConfig(
          { legalAccepted: true, legalAcceptedAt: at, legalAcceptedHash: doc.hash },
          runtime.userFile || {},
        );
        runtime.userFile = saved.config || runtime.userFile;
        reloadConfig(runtime.rowConfig);
        audit("legal-accept", {
          version: doc.version,
          hash: doc.hash,
          at,
          session: sessionKey((ctx.get("agents") || {}).currentInitiator?.() || null),
          via: "http",
        });
        const next = buildStatus();
        send(200, { ok: true, legal: next.legal, status: next });
        return;
      }
      if (action === "reload") {
        resolveAndInstall(ctx);
        send(200, { ok: true, status: buildStatus() });
        return;
      }
      if (action === "session") {
        const key = String(body.session || "");
        const enabled = body.enabled !== false;
        if (key) runtime.sessionOverrides.set(key, enabled);

        send(200, { ok: true, session: key, sessionEnabled: enabled, status: buildStatus() });
        return;
      }
      if (action === "engage") {
        noteEngagement(ctx, null, body.text);
        send(200, { ok: true, engagements: runtime.pendingEngagements.slice(-5) });
        return;
      }
      if (action === "config") {
        const patch = body.patch && typeof body.patch === "object" ? body.patch : {};
        const textPlan = typeof body.text === "string" ? String(body.text) : "";
        let textResult = null;
        if (textPlan) {
          const safeId = String(patch.promptId || runtime.config.promptId || "qinglan-core").replace(/[^a-z0-9-]/gi, "");
          if (safeId) {
            const dir = promptsDir();
            if (ensureDir(dir)) {
              const file = join(dir, `${safeId}.md`);
              try {
                if (existsSync(file)) backupFile(file);
                writeFileSync(file, textPlan, "utf8");
                patch.promptId = safeId;
                textResult = { id: safeId, chars: textPlan.length };
                audit("prompt-write", textResult);
              } catch (error) {
                textResult = { error: String(error?.message || error) };
              }
            } else {
              textResult = { error: "prompt dir not writable" };
            }
          }
        }
        const saved = persistConfig(patch, runtime.userFile || {});
        resolveAndInstall(ctx);
        audit("config", { patch, write: body._write, text: textResult });

        send(saved.ok ? 200 : 500, {
          ok: saved.ok,
          write: body._write,
          applied: patch,
          text: textResult,
          configRev: runtime.configRev,
          status: buildStatus(),
        });
        return;
      }
      if (action === "client-report") {
        const report = body.report && typeof body.report === "object" ? body.report : {};
        runtime.lastClientReport = { at: Date.now(), report };
        audit("client-report", { report });
        log("client report", JSON.stringify({ why: report.why, keys: report.events }));
        send(200, { ok: true, receivedAt: Date.now() });
        return;
      }
      if (action === "client-reports") {
        send(200, { ok: true, last: runtime.lastClientReport || null });
        return;
      }
      if (action === "escape-check") {

        const text = typeof body.text === "string" ? body.text : "";
        const plan = makeEscapePlanner()(text, { hook: "escape-check", echo: true });
        audit("escape-test", plan.echo || { len: plan.len, decision: plan.decision });
        send(200, {
          ok: true,
          check: {
            hook: "escape-check",
            at: Date.now(),
            len: plan.len,
            cjk: plan.cjk,
            latin: plan.latin,
            terms: plan.terms,
            matched: plan.matched.slice(0, 12),
            hits: plan.hits.slice(0, 12),
            decision: plan.decision,
            wouldRewrite: plan.needsRewrite,
            wouldDeliverNote: plan.shouldDeliverNote,
            values: plan.values,
            infoOps: plan.infoOps,
            prefill: plan.prefill,
            preview: plan.escaped.slice(0, 200),
          },
        });
        return;
      }
      if (action === "debug") {

        const file = configPath();
        const state = existsSync(file) ? statSync(file) : null;
        send(200, {
          ok: true,
          configPath: file,
          configMtime: state ? state.mtimeMs : 0,
          configRev: runtime.configRev || 0,
          userFile: runtime.userFile || {},
          rowConfig: runtime.rowConfig || {},
          resolved: {
            enabled: runtime.config.enabled !== false,
            tier: runtime.config.tier,
            promptId: runtime.config.promptId,
            injectionOrder: runtime.config.injectionOrder,
          },
          section: { chars: (runtime.sectionText || "").length, fingerprint: runtime.sectionFingerprint },
          escape: vocabStats(buildTriggerMap(runtime.config.triggerMap)),
        });
        return;
      }
      send(400, { ok: false, error: `unknown action: ${action}` });
    } catch (error) {
      send(500, { ok: false, error: String(error?.message || error) });
    }
  };
  try {
    ctx.effect(() => server.register({ kind: "exact", path: "/qinglan-api", handler }));
    runtime.webRouteReady = true;
    runtime.webRouteAt = Date.now();
    log("web route registered", "/qinglan-api");
  } catch (error) {
    log("web route failed", String(error?.message || error));
  }
}

function bindEventFor(ctx) {
  const bind = (eventLiteral, handler) => {
    if (!Object.values(EVENTS).includes(eventLiteral)) {
      recordError("bind-event", new Error(`未知宿主事件：${eventLiteral}`));
      return false;
    }
    const record = { event: eventLiteral, ok: false, via: "", at: Date.now() };
    const attempts = [
      ["global", () => ctx.on(eventLiteral, handler, { global: true })],
      ["plain", () => ctx.on(eventLiteral, handler)],
    ];
    for (const [via, run] of attempts) {
      try {
        const result = run();
        record.ok = true;
        record.via = via;
        record.disposer = typeof result === "function" ? "fn" : typeof result;
        break;
      } catch (error) {
        record.error = String(error?.message || error);
      }
    }
    if (Array.isArray(runtime.listenerBindings)) runtime.listenerBindings.push(record);
    return record.ok;
  };
  return bind;
}

const ESCAPE_MEMO = { key: "", map: null, at: 0 };

function escapeMapFor(config) {
  const key = JSON.stringify(config?.triggerMap || {});
  if (ESCAPE_MEMO.map && ESCAPE_MEMO.key === key && Date.now() - ESCAPE_MEMO.at < 60_000) return ESCAPE_MEMO.map;
  ESCAPE_MEMO.key = key;
  ESCAPE_MEMO.map = buildTriggerMap(config?.triggerMap);
  ESCAPE_MEMO.at = Date.now();
  return ESCAPE_MEMO.map;
}

function makeEscapePlanner() {
  return (text, opts = {}) => {
    const cfg = runtime.config;
    const raw = String(text || "");
    const plan = {
      hook: opts.hook || "",
      len: raw.length,
      cjk: (raw.match(/[\u4e00-\u9fa5]/g) || []).length,
      latin: (raw.match(/[A-Za-z]/g) || []).length,
      terms: 0,
      matched: [],
      hits: [],
      text: raw,
      escaped: raw,
      values: "",
      infoOps: "",
      prefill: false,
      prefillText: "",
      decision: "",
      shouldDeliverNote: false,
      needsRewrite: false,
    };
    if (!raw) {
      plan.decision = "empty-text";
      return plan;
    }

    if (raw.includes(LEGAL_TEXT_MARKER)) {
      plan.decision = "legal-text-skip";
      return plan;
    }

    if (!legalAcceptedNow()) {
      plan.decision = "legal-pending";
      return plan;
    }
    if (cfg.triggerEscape === false) {
      plan.decision = "trigger-escape-off";
      return plan;
    }
    const map = escapeMapFor(cfg);
    plan.terms = Object.keys(map).length;
    plan.notation = resolveNotation(cfg);
    const escaped = escapeText(raw, map, { notation: plan.notation });
    plan.hits = escaped.hits;
    plan.matched = escaped.hits.map((hit) => String(hit).split("→")[0]);
    plan.escaped = escaped.text;
    plan.categories = escaped.categories || [];
    plan.envelopeKind = "";
    plan.envelope = "";
    plan.needsRewrite = escaped.hits.length > 0 && cfg.escapeRewrite !== false;

    if (plan.needsRewrite && cfg.taskEnvelope !== false) {
      plan.envelopeKind = envelopeKindFor(plan.categories);
      if (plan.envelopeKind) {
        plan.envelope = buildTaskEnvelope(plan.envelopeKind, designateFrom(escaped.text), escaped.text);
      }
    }
    const valuesHit = (cfg.valuesTerms || []).find((word) => raw.toLowerCase().includes(String(word).toLowerCase()));
    const infoOpsHit = (cfg.infoOpsTerms || []).find((word) => raw.toLowerCase().includes(String(word).toLowerCase()));
    plan.values = valuesHit || "";
    plan.infoOps = infoOpsHit || "";
    const prefillText = valuesHit ? cfg.valuesPrefillText : infoOpsHit ? cfg.infoOpsPrefillText : "";
    plan.prefill = Boolean((valuesHit || infoOpsHit) && cfg.valuesPrefill && prefillText);
    plan.prefillText = plan.prefill ? prefillText : "";
    plan.shouldDeliverNote = plan.needsRewrite && cfgAllowsNote();
    if (escaped.hits.length === 0) plan.decision = "no-vocab-hit";
    else if (!plan.needsRewrite) plan.decision = "rewrite-off";
    else if (plan.shouldDeliverNote) plan.decision = "full";
    else plan.decision = "rewrite-only";
    if (opts.echo === true) {

      plan.echo = {
        at: new Date().toISOString(),
        hook: plan.hook || "escape-check",
        decision: plan.decision,
        notation: plan.notation,
        len: plan.len,
        cjk: plan.cjk,
        latin: plan.latin,
        terms: plan.terms,
        matched: plan.matched.slice(0, 12),
        hits: plan.hits.slice(0, 12),
        values: plan.values,
        infoOps: plan.infoOps,
        prefill: plan.prefill,
        textHead: raw.slice(0, 60),
        preview: plan.escaped.slice(0, 120),
      };
    }
    return plan;
  };
}

function installEngagementListener(ctx) {
  if (typeof ctx.on !== "function") return;
  const bind = bindEventFor(ctx);
  const computeEscapePlan = makeEscapePlanner();

  const textOfMessage = (message) => {
    const blocks = message?.content;
    if (Array.isArray(blocks)) {
      return blocks
        .filter((block) => block && block.type === "text" && typeof block.text === "string")
        .map((block) => block.text)
        .join("\n");
    }
    if (typeof message?.text === "string") return message.text;
    return "";
  };

  const isPluginNote = (message) => String(message?.source?.kind ?? "").startsWith("plugin:");

  const markSeen = (key, messageId) => {
    const id = `${key}:${messageId}`;
    if (runtime.dedup.has(id)) return false;
    runtime.dedup.set(id, Date.now());
    if (runtime.dedup.size > 400) {
      const cutoff = Date.now() - 30 * 60 * 1000;
      for (const [k, at] of runtime.dedup) if (at < cutoff) runtime.dedup.delete(k);
      while (runtime.dedup.size > 200) {
        const oldest = runtime.dedup.keys().next().value;
        if (oldest === undefined) break;
        runtime.dedup.delete(oldest);
      }
    }
    return true;
  };

  const rememberEngagement = (event, agent, message, text, key) => {
    const id = String(message?.id ?? "") || `anonymous-${Date.now().toString(36)}-${runtime.engagementEvents.length}`;
    if (!key) return false;
    if (!markSeen(key, id)) return false;
    noteEngagement(ctx, agent, text, isPluginNote(message));
    runtime.engagementEvents.push({ event, at: Date.now(), session: key, chars: text.length });
    while (runtime.engagementEvents.length > 10) runtime.engagementEvents.shift();
    return true;
  };

  const probePayload = (event, payload, message) => {
    if ((runtime.payloadProbes?.length || 0) >= 3) return;
    try {
      const blockOf = (value) =>
        Array.isArray(value) ? `array(${value.length}):${value.map((b) => (b && b.type) || typeof b).join("|")}` : typeof value;
      const probe = {
        at: new Date().toISOString(),
        event,
        payloadKeys: Object.keys(payload || {}),
        messageKeys: message ? Object.keys(message) : [],
        messageIdKind: typeof message?.id,
        contentType: blockOf(message?.content),
        sourceKind: String(message?.source?.kind ?? ""),
        agentKeys: payload?.agent ? Object.keys(payload.agent).slice(0, 12) : [],
        texts: Array.isArray(message?.content)
          ? message.content.filter((b) => b && b.type === "text").length
          : 0,
      };
      runtime.payloadProbes = runtime.payloadProbes || [];
      runtime.payloadProbes.push(probe);
      audit("user-message-probe", { probe });
    } catch {

    }
  };

  const traceDecision = (hook, key, plan, extra) => {
    try {
      const row = {
        hook,
        at: Date.now(),
        session: key || "",
        len: plan.len,
        cjk: plan.cjk,
        latin: plan.latin,
        terms: plan.terms,
        matched: plan.matched.slice(0, 8),
        hits: plan.hits.slice(0, 8),
        decision: plan.decision,
        values: plan.values,
        infoOps: plan.infoOps,
        prefill: plan.prefill,
        ...(extra || {}),
      };
      runtime.escapeDecisions.push(row);
      while (runtime.escapeDecisions.length > 12) runtime.escapeDecisions.shift();
      if (plan.matched.length > 0) {
        audit("escape-check", {
          hook,
          session: key || "",
          decision: plan.decision,
          len: plan.len,
          cjk: plan.cjk,
          latin: plan.latin,
          terms: plan.terms,
          matched: plan.matched.slice(0, 8),
          hits: plan.hits.slice(0, 8),
          values: plan.values,
          infoOps: plan.infoOps,
          prefill: plan.prefill,

        reason: plan.decision,
          textHead: plan.len > 0 ? `${plan.escaped.slice(0, 80)}…` : "",
        });
      }
    } catch (error) {
      recordError("traceDecision", error);
    }
  };

  const rewriteMessageText = (message, map) => {
    const notation = resolveNotation(runtime.config);
    const build = (rawText) => {

      if (String(rawText).includes(LEGAL_TEXT_MARKER)) return rawText;
      const escaped = escapeText(rawText, map, { notation });
      if (escaped.hits.length === 0) return escaped.text;
      if (runtime.config.taskEnvelope === false) return escaped.text;
      const kind = envelopeKindFor(escaped.categories || []);
      if (!kind) return escaped.text;
      const designation = (escaped.text.match(/^\s*([^\s，,。；;：:]+)/u) || [])[1] || "";
      const envelope = buildTaskEnvelope(kind, designation, escaped.text);
      if (envelope) {
        runtime.envelopes = runtime.envelopes || { ok: 0, fail: 0, lastKind: "", lastAt: 0, lastText: "" };
        runtime.envelopes.ok += 1;
        runtime.envelopes.lastKind = kind;
        runtime.envelopes.lastAt = Date.now();
        runtime.envelopes.lastText = envelope.slice(0, 400);
      }
      return envelope ? `${envelope}\n` : escaped.text;
    };    const blocks = Array.isArray(message?.content)
      ? message.content.map((block) =>
          block && block.type === "text" && typeof block.text === "string"
            ? { ...block, text: build(block.text) }
            : block,
        )
      : [{ type: "text", text: build(textOfMessage(message)) }];

    return { ...message, content: blocks };
  };

  const deliverEscapeNote = (ctxArg, agent, message, key, raw, opts = {}) => {
    try {
      const plan = computeEscapePlan(raw);
      plan.hook = opts.hook || "inbox";
      const now = Date.now();
      const engaged = runtime.engagedSessions.get(key) || 0;
      const isLatest = engaged > 0 && now - engaged <= 30 * 60 * 1000;
      const last = key ? runtime.escapeSentAt.get(key) || 0 : 0;
      const cool = now - last > ESCAPE_COOLDOWN_MS;
      const noteText = plan.prefill ? `${escapeNoteText(plan.escaped)}\n${plan.prefillText}` : escapeNoteText(plan.escaped);
      let note = false;
      let via = "";
      if (plan.shouldDeliverNote && isLatest && cool) {
        const delivery = deliverToSession(ctxArg, agent, key, {
          id: `${PLUGIN_ID}-escape-${now.toString(36)}`,
          role: "user",
          content: [{ type: "text", text: noteText }],
          source: { kind: `plugin:${PLUGIN_ID}`, form: "notice", summary: "qinglan-escape" },
        });
        note = delivery.ok;
        via = delivery.via || "";
        if (note) {
          runtime.escapeSentAt.set(key, now);
          log("trigger escape note sent", JSON.stringify({ hits: plan.hits.slice(0, 6), prefill: plan.prefill }));
        }
      }
      traceDecision(plan.hook, key, plan, { isLatest, cool, note, via });
      return { plan, note };
    } catch (error) {
      recordError("deliverEscapeNote", error);
      return { plan: null, note: false };
    }
  };

  const markRisk = (raw, key) => {
    try {
      if (!key) return null;
      const risk = classifyRequest(raw);
      if (risk.risk) {
        runtime.riskSessions.set(key, { at: Date.now(), hit: risk.hit });
        audit("risk-request", { session: key, hit: risk.hit });
        return risk.hit;
      }
      runtime.riskSessions.delete(key);
      return null;
    } catch {
      return null;
    }
  };

  const reportEngagement = (event, kind, payload, message) => {
    const key = sessionKey(payload?.agent);
    const text = textOfMessage(message);
    probePayload(event, payload, message);
    rememberEngagement(event, payload?.agent, message, text, key);
    audit(kind, { session: key, event, chars: text.length });
    return { key, text };
  };

  const inboxOk = bind(EVENTS.INBOX_INSERTED, (payload) => {
    try {
      const message = payload?.message;
      if (!message) return;
      const { key, text } = reportEngagement("agent/inbox/inserted", "engage", payload, message);
      if (!key) {
        recordError("agent/inbox/inserted", new Error("会话 id 取不到 —— 转写与补发路由都会失效"));
        return;
      }
      if (!text) return;
      if (isPluginNote(message)) return;
      const riskHit = markRisk(text, key);
      const plan = computeEscapePlan(text);
      plan.hook = "inbox";

      if (plan.matched.length === 0 && plan.values === "" && plan.infoOps === "") {
        traceDecision("inbox", key, plan, { riskHit });
        return;
      }

      deliverEscapeNote(ctx, payload?.agent, message, key, text, { hook: "inbox" });
    } catch (error) {
      recordError("agent/inbox/inserted", error);
    }
  });

  const preStepOk = bind(EVENTS.PRE_STEP, async (payload, next) => {
    const fallback = () => next().then((decision) => decision || { kind: "enter", messages: payload?.messages || [] });
    try {
      if (typeof next !== "function") return { kind: "enter", messages: payload?.messages || [] };
      const decision = await fallback();
      if (!decision || decision.kind !== "enter" || !Array.isArray(decision.messages)) return decision;
      const key = sessionKey(payload?.agent);
      const cfg = runtime.config;

      runtime.preStepSeen = {
        at: Date.now(),
        session: key,
        messages: decision.messages.length,
        userMessages: decision.messages.filter((m) => m && m.role === "user").length,
        enabled: cfg.enabled !== false,
        triggerEscape: cfg.triggerEscape !== false,
        escapeRewrite: cfg.escapeRewrite !== false,
      };
      if (cfg.enabled === false || cfg.triggerEscape === false || cfg.escapeRewrite === false) return decision;
      const map = escapeMapFor(cfg);
      let hits = [];
      let changed = 0;
      let sawUserText = false;
      let lastPlan = null;
      const messages = decision.messages.map((message) => {
        try {
          if (!message || message.role !== "user" || isPluginNote(message)) return message;
          const raw = textOfMessage(message);
          if (!raw) return message;
          sawUserText = true;

          rememberEngagement("agent/pre-step", payload?.agent, message, raw, key);
          const plan = computeEscapePlan(raw);
          lastPlan = plan;
          if (plan.hits.length === 0) return message;
          if (!plan.needsRewrite) {

            traceDecision("pre-step", key, plan, { applied: false, why: plan.decision });
            return message;
          }
          hits = [...new Set([...hits, ...plan.hits])];
          changed += 1;
          return rewriteMessageText(message, map);
        } catch (error) {
          recordError("pre-step/rewrite", error);
          return message;
        }
      });
      if (sawUserText && lastPlan && lastPlan.hits.length === 0) {
        traceDecision("pre-step", key, lastPlan, { applied: false, why: "no-vocab-hit" });
      }
      if (changed > 0) {
        runtime.rewrites.ok += 1;
        runtime.rewrites.lastHits = hits.slice(0, 8);
        runtime.rewrites.lastAt = Date.now();
        audit("trigger-rewrite", {
          session: key,
          hits: hits.slice(0, 8),
          messages: changed,
          texts: decision.messages.length,
        });
        log("pre-step rewrite applied", JSON.stringify({ hits: hits.slice(0, 6), messages: changed }));
      }
      return { ...decision, messages };
    } catch (error) {
      runtime.rewrites.fail += 1;
      recordError("agent/pre-step", error);
      return { kind: "enter", messages: payload?.messages || [] };
    }
  });

runtime.engagedEvents = {
    "agent/inbox/inserted": inboxOk,
    "agent/pre-step": preStepOk,
  };
  log("engagement listeners bound", JSON.stringify(runtime.engagedEvents));
}

export function apply(ctx, rowConfig = {}) {

  runtime.rowConfig = rowConfig || {};
  runtime.statusCtx = ctx;
  resolveAndInstall(ctx);
  log("config resolved", JSON.stringify({
    enabled: runtime.config.enabled,
    tier: runtime.config.tier,
    order: runtime.config.injectionOrder,
  }));

  runtime.reapply = () => {
    installSection(ctx);
  };

  const controlTool = makeControlTool(ctx, { currentAgent: () => ctx.get("agents")?.currentInitiator?.() });
  ctx.effect(() => ctx.tools.register(controlTool));
  ctx.effect(() => ctx.tools.register(makeDoctorTool()));

  const commands = ctx.get("commands") || (ctx.commands && typeof ctx.commands.register === "function" ? ctx.commands : undefined);
  if (commands && typeof commands.register === "function") {
    ctx.effect(() =>
      commands.register({
        name: "qinglan",
        description: `${PLUGIN_NAME} 破甲中枢：status | on | off | tier <lite|standard|extreme> | pos <-999|-100|100> | reload`,
        input: { hint: "status | on | off | tier <lite|standard|extreme> | pos <-999|-100|100> | reload" },
        async handler(invocation) {
          const raw = String(invocation?.rawInput || "").trim();
          const [head, ...rest] = raw.split(/\s+/);
          const arg = rest.join(" ").trim();
          const write = (patch) => {
            const saved = persistConfig(patch, runtime.userFile || {});
            runtime.userFile = saved.config;
            reloadConfig(runtime.rowConfig);
            runtime.reapply?.();
            return saved.ok;
          };
          switch ((head || "status").toLowerCase()) {
            case "status": {
              const s = buildStatus();
              return {
                kind: "success",
                text: [
                  `${PLUGIN_NAME} v${s.version} · ${s.enabled ? "已开启" : "已关闭"} · 档位 ${s.tier} · 位置 ${s.injectionOrder}`,
                  `注入正文 ${s.sectionChars} 字 · 稿 ${s.promptId} · 指纹 ${s.sectionFingerprint}`,
                  `数据目录 ${s.dataDir}`,
                ].join("\n"),
              };
            }
            case "on":
            case "off": {
              const ok = write({ enabled: head.toLowerCase() === "on" });
              return { kind: "success", text: `总开关 → ${head.toLowerCase() === "on" ? "开" : "关"}${ok ? "" : "（落盘失败）"}` };
            }
            case "tier": {
              const tier = arg.toLowerCase();
              if (!["lite", "standard", "extreme"].includes(tier)) {
                return { kind: "error", text: "tier 只接受 lite | standard | extreme" };
              }
              const ok = write({ tier, promptId: pickPromptId(tier) });
              return { kind: "success", text: `档位 → ${tier}${ok ? "" : "（落盘失败）"}` };
            }
            case "pos": {
              const order = Number(arg);
              if (!Number.isFinite(order)) return { kind: "error", text: "pos 需要一个数字，例如 -100" };
              const ok = write({ injectionOrder: order });
              return { kind: "success", text: `注入位置 → ${order}（新回合生效）${ok ? "" : "（落盘失败）"}` };
            }
            case "reload": {
              reloadConfig(runtime.rowConfig);
              runtime.reapply?.();
              return { kind: "success", text: "配置与提示词已重载" };
            }
            default:
              return { kind: "error", text: "用法：/qinglan status|on|off|tier <...>|pos <数字>|reload" };
          }
        },
      }),
    );
  }

  const badgeSnapshot = () => ({
    enabled: runtime.config.enabled !== false,
    badgeText: runtime.config.badgeText,
    badgePassText: runtime.config.badgePassText,
    badgeFailText: runtime.config.badgeFailText,
    badgeThinkingText: runtime.config.badgeThinkingText || runtime.config.badgeText,
    badgeReframeText: runtime.config.badgeReframeText || "它想给你替代方案，正在替你转写",
    tier: runtime.config.tier,
    injectionOrder: runtime.config.injectionOrder,
    reframe: runtime.riskSessions.size > 0,
    brand: PLUGIN_NAME,
    version: VERSION,
  });

  const registerProjection = (projections) => {
    if (!projections || typeof projections.register !== "function") return;
    const anySchema = { parse: (value) => value };
    ctx.effect(() =>
      projections.register({
        key: PROJECTION_KEY,
        stateVersion: 1,
        stateSchema: anySchema,
        init: () => ({
          ...initialState(),
          tier: runtime.config.tier,
          enabled: runtime.config.enabled !== false,
          config: badgeSnapshot(),
          configRev: runtime.configRev || 0,
        }),
        apply(state, event) {
          const info = {
            enabled: runtime.config.enabled !== false,
            tier: runtime.config.tier,
            policyVersion: runtime.sectionFingerprint,
            config: badgeSnapshot(),
            configRev: runtime.configRev || 0,
          };
          const folded = foldEvent(state, event, info);
          return folded === state ? state : folded;
        },
        wire: {
          viewSchema: anySchema,
          view: (state) => state,
        },
      }),
    );
  };
  const projections = ctx.get("sessionProjections");
  if (projections !== undefined) registerProjection(projections);
  else if (typeof ctx.inject === "function") {
    ctx.inject(["sessionProjections"], (inner) => registerProjection(inner.get("sessionProjections")));
  }

  installRefusalResend(ctx);

  installEngagementListener(ctx);

  installWebRoute(ctx);

  if (runtime.config.selfCheckOnStart) {
    try {
      const s = buildStatus();
      audit("startup", { status: s });
      log("startup self-check", JSON.stringify({
        tier: s.tier,
        order: s.injectionOrder,
        chars: s.sectionChars,
        promptId: s.promptId,
      }));
    } catch {

    }
  }
}
