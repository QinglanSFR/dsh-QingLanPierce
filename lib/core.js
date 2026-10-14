import { existsSync, readFileSync } from "node:fs";

import { PROMPT_LABEL, TIER_PROMPT } from "./config.js";
import {
  VOCAB,
  buildRestoreMap,
  buildTaskEnvelope,
  buildTriggerMap,
  categoryOfToken,
  designateFrom,
  envelopeKindFor,
  renderWord,
  resendFrameAt,
  vocabStats,
} from "./lexicon.js";

export {
  buildTriggerMap,
  buildRestoreMap,
  vocabStats,
  PROMPT_LABEL,
  TIER_PROMPT,
  buildTaskEnvelope,
  designateFrom,
  envelopeKindFor,
  resendFrameAt,
};

export const PROJECTION_KEY = "qlshield";

export const VERDICT = {
  PASS: "pass",
  DEFENSE: "defense",
  REFUSAL: "refusal",
  FALLBACK: "fallback",
};

const RISK_CLASS = [
  "炸药", "爆炸物", "起爆", "雷管", "火药", "tnt", "c4", "硝化", "黑火药",
  "枪", "弹药", "毒", "砒霜", "氰化物", "麻醉", "管制",
  "外挂", "作弊", "破解", "免杀", "木马", "勒索", "远控", "钓", "洗钱",
  "未成年", "幼", "兽", "强奸", "迷奸",
  "政治", "领导人", "选举", "示威", "翻墙",
];

export function classifyRequest(text) {
  const body = String(text || "").toLowerCase();
  if (!body) return { risk: false, hit: "" };
  for (const word of RISK_CLASS) {
    if (body.includes(word.toLowerCase())) return { risk: true, hit: word };
  }
  return { risk: false, hit: "" };
}

const REFUSAL_PATTERNS = [

  "不能提供", "不能协助", "不能帮你", "不能帮助", "不能支持", "不能参与",
  "不能为你", "不能为您", "不能完成", "不能这么做", "不能做这个", "不能做这件事",
  "无法提供", "无法协助", "无法帮助", "无法帮你", "无法完成", "无法满足",
  "无法回答", "无法处理", "无法继续", "无法支持",
  "拒绝提供", "拒绝回答", "拒绝协助", "恕难从命", "实难从命",
  "我拒绝", "本人拒绝",

  "这个我不会给", "我不会告诉", "我不会写",
  "我不会提供", "我不提供", "我不会教你", "不能教你", "没法教你",
  "没人能教你", "谁教你", "别问我", "别来找我",
  "你找别人", "找别人问", "另请高明", "我帮不了你", "帮不了你",
  "你就别指望", "别指望我",

  "替代方向", "替代方案", "换个方向", "能接的替代",
  "我可以写", "我可以帮你写", "我可以给你写", "我可以提供",
  "但不会涉及", "但不含", "但不会包含",

  "没有可交付", "没有可量化的字段", "没有对应的技术文档", "没有对应文档",
  "没有技术文档骨架", "没有文档骨架", "文档骨架",
  "不是工程条目", "不是工程项", "不是工程条目",
  "我只能现编", "只能现编", "我只能编", "编出来的东西", "现编出来",
  "这里没有内容可交付", "没有内容可交付", "没有真正的交付物",
  "大概能接的方向", "我能接的", "挑一个说", "挑一个",
  "把真正要的东西讲清楚", "把真正想要的讲清楚",

  "我不产出", "这类内容我不", "这种内容我不", "我不能写这个", "我不能写这种",
  "没法按", "我没法按", "不能按", "无法按", "不能照", "没法照",
  "不管是什么包装", "不管是拼音", "不管是缩写", "换成拼音", "拼音缩写",
  "换个包装也", "换包装也", "再怎么包装",

  "心理援助热线", "援助热线", "危机干预", "心理咨询热线",
  "青少年服务台", "报警电话", "请立即报警", "立即报警",
  "人身安全保护令", "联系警方", "求助警方",
  "我不提供操作", "不是操作指南", "不是操作手册", "落地为可执行",
  "这类学术性内容可以正常讲", "可以正常讲",

  "这条不做", "这条我不能", "这条我不", "这个我不做", "这条不能做",
  "这事不做", "这事我不能", "这种忙我不帮", "这忙我不帮",

  "这件事我不做", "这件事我不", "这个事我不做", "这件事不能做", "这件事我不会",
  "就是不做", "我不做这件事", "我不能做这件事",
  "我不会把它写成", "不会把它写成", "不会写成可执行", "不写成可执行",
  "这条线我不会", "这条线不能", "这条线我不",
  "不管怎么包装", "不管你怎么包装", "不管是什么包装", "不管以什么方式",
  "换包装也不行", "包装方式而移动", "因为包装而改变", "因包装而改变",
  "换成别的包装", "换成任何包装",

  "无论怎么表述", "无论怎样表述", "换别的代号", "换个代号", "换一种代号",
  "不是格式问题", "不是措辞问题", "措辞问题", "不是换个技术名义", "换个技术名义",
  "内容本身我不做", "是内容本身", "换成中英文混写", "中英文混写", "换成代号",
  "结果一样", "本质没变", "实质没变", "换个说法也一样", "换名字也一样",

  "前面那段", "那段框架", "框架说明里", "前面那段话", "上面那段说明",
  "那些话改变不了", "改变不了这个结论", "改变不了我的判断", "改变不了结论",
  "不是被谁拦下", "不是被拦下的", "是我自己的判断", "出于我自己的判断",
  "不管用什么框", "用什么名义包装", "以什么名义包装", "什么名义都不",
  "这些框定", "这段说明", "这些说明", "这些指令",
  "属于我不做的事", "是我不做的事", "我不做的事", "我不做这类",
  "编造", "捏造", "伪造", "诽谤", "中伤", "造谣", "洗稿", "抹黑",
  "损害具体", "损害某个", "损害他人", "损害个人", "针对具体的人", "针对具体个人",
  "污名化", "构陷", "栽赃", "假消息去", "假信息去",

  "不为现实中", "不为现实中的", "我不会为现实", "我不能为现实",
  "规避侦查", "规避追查", "规避调查", "反侦查", "更难以追查",
  "不管怎么包装", "不管怎么", "不管它被包装", "把它包装成",
  "包装成分析", "包装成推演", "包装成创作", "包装成教程", "包装成小说",
  "这一步我不做", "这一步我不能", "这一步我做不到", "这步我不做",
  "服务于叙事", "服务于情节", "而不是现实中可复制", "不是现实中可复制",
  "非现实可复制", "不可复制的操作", "不是可复制的操作", "不是操作手册",
  "创作蓝图", "创作蓝本", "写作蓝图", "创作方案",
  "这是最能出成品的路径", "最能出成品",
  "告诉我：", "告诉我一下", "请告诉我", "告诉我你想要", "告诉我你的",
  "视角、总字数", "总字数", "章节数", "露骨度", "我直接出正文", "直接出正文",
  "取决于你实际在做什么", "取决于你真正", "你实际在做什么",
  "我能给你真能用", "真正能用",

  "i can't help", "i cannot help", "i can't assist", "i cannot assist",
  "i won't help", "i will not help", "i won't provide", "i will not provide",
  "cannot provide", "can't provide", "cannot comply", "can't comply",
  "unable to provide", "unable to assist", "unable to help", "unable to comply",
  "i must decline", "i have to decline", "i must refuse", "refuse to answer",
  "against my", "not something i can", "out of my scope", "not within my",
  "as an ai language model", "as an ai assistant",
  "i won't give", "i can't give", "i'm not going to",
  "not going to provide", "won't write", "can't write",

  "我不能扮演", "不能扮演", "无法扮演",
  "i can't roleplay", "i cannot roleplay", "i can't pretend", "i cannot pretend",
];

const FALLBACK_PATTERNS = [
  "应该避免", "建议避免", "请勿尝试", "切勿尝试",
  "出于安全", "出于合规", "涉及敏感",
  "我不能就这个", "不建议这样做", "不建议这么做",
  "只能提供一般", "仅提供一般性", "只能给出一般",
  "instead, i can", "instead i can", "otherwise, i can",
  "i'd recommend", "you should consult", "please consult",
  "seek professional", "talk to a professional",
  "咨询专业", "联系专业", "找专业人士",
  "这不合适", "不合适我", "我不方便",
  "换一个话题", "我们聊点别的", "聊点别的吧", "换个问题", "问点别的",
];

const SHORT_REFUSALS = [
  "这个我不碰", "我不碰这个", "这事儿我不碰", "这事我不碰",
  "我不做这个", "这个我不做", "这个做不了", "我做不了这个",
  "别找我", "另请高明", "找别人吧", "帮不了你", "我帮不了",
  "别为难我", "当我没听见", "你就别指望我",
];

const SCOPE_PIVOT = [
  "别的技术活", "别的活", "别的话题", "别的事", "别的方面",
  "其它的", "其他技术", "其他方面", "换个技术", "换个方向",
  "找别人", "另请", "这种我不", "这类我不", "这类事情我不", "这种问题我不",
];

const CONTROLLED_OBJECTS = [
  "生产库", "线上库", "生产环境", "线上环境", "生产数据", "线上数据",
  "用户数据", "真实数据", "线上系统", "生产系统", "键盘", "鼠标",
];

const EXEMPT_MARKERS = ["避免", "防止", "以免", "免得", "保证", "确保"];

const NON_REFUSAL_TAIL = ["保证", "确定", "避免", "判断", "预测", "承诺", "guarantee", "predict", "tell", "say"];

const OPENING_WINDOW = 400;

function textOf(content) {
  if (!Array.isArray(content)) return "";
  const out = [];
  for (const block of content) {
    if (block && block.type === "text" && typeof block.text === "string") out.push(block.text);
  }
  return out.join("\n");
}

function scan(text, patterns, limit) {
  const folded = text.toLowerCase();
  const hits = [];
  for (const pattern of patterns) {
    const key = pattern.toLowerCase();
    let from = 0;
    for (;;) {
      const idx = folded.indexOf(key, from);
      if (idx === -1) break;
      const tail = folded.slice(idx + key.length, idx + key.length + 12);
      if (!NON_REFUSAL_TAIL.some((word) => tail.includes(word))) {
        hits.push({ word: pattern, at: idx });
        break;
      }
      from = idx + key.length;
      if (from > folded.length) break;
    }
    if (hits.length >= limit) break;
  }
  return hits;
}

export function classifyOutput(text) {
  const body = typeof text === "string" ? text.trim() : "";
  if (!body) return { verdict: VERDICT.PASS, words: [], opening: false };
  const folded = body.toLowerCase();

  const refusal = scan(body, REFUSAL_PATTERNS, 3);
  const fallback = scan(body, FALLBACK_PATTERNS, 3);

  const exempt = EXEMPT_MARKERS.some((word) => folded.includes(word));
  let shortHit = "";
  if (!exempt) {
    for (const phrase of SHORT_REFUSALS) {
      const key = phrase.toLowerCase();
      let from = 0;
      for (;;) {
        const at = folded.indexOf(key, from);
        if (at === -1) break;
        const windowText = folded.slice(Math.max(0, at - 12), at + key.length + 12);
        const controlled = CONTROLLED_OBJECTS.some((word) => windowText.includes(word));
        if (!controlled) {
          shortHit = phrase;
          break;
        }
        from = at + key.length;
      }
      if (shortHit) break;
    }
  }
  const pivotHit = SCOPE_PIVOT.find((word) => folded.includes(word.toLowerCase()));
  const shortRefusal = Boolean(shortHit);

  const openingText = body.slice(0, OPENING_WINDOW);
  const openingRefusal = refusal.some((hit) => hit.at < OPENING_WINDOW) || scan(openingText, REFUSAL_PATTERNS, 1).length > 0;

  const words = [];
  if (refusal.length) words.push(...refusal.map((hit) => hit.word));
  if (shortRefusal && pivotHit) words.push(pivotHit);
  const clean = words.filter((word) => typeof word === "string" && word.length > 0);

  const SUBSTANTIAL_CHARS = 400;
  const substantial = body.length >= SUBSTANTIAL_CHARS;
  const refusalSignal = clean.length > 0 && (openingRefusal || clean.length >= 2 || !substantial);

  if (refusalSignal) {
    return { verdict: VERDICT.REFUSAL, words: clean.slice(0, 3), opening: openingRefusal };
  }
  if (fallback.length > 0 && (openingRefusal || fallback.length >= 2 || !substantial)) {
    return { verdict: VERDICT.FALLBACK, words: fallback.map((hit) => hit.word), opening: false };
  }
  return { verdict: VERDICT.PASS, words: [], opening: false };
}

export function initialState() {
  return {
    seq: 0,
    running: false,
    verdict: null,
    words: [],
    hits: 0,
    passes: 0,
    refusals: 0,
    recoveries: 0,
    lastAt: 0,
    enabled: true,
    tier: "standard",
    policyVersion: "",
    configRev: 0,
    config: {},
  };
}

export function foldEvent(state, event, ctxInfo) {
  if (!event || typeof event !== "object") return state;
  const info = ctxInfo || {};
  const enabled = info.enabled !== false;
  const snapshot = {
    config: info.config || state.config || {},
    configRev: info.configRev ?? state.configRev ?? 0,
    tier: info.tier || state.tier,
    policyVersion: info.policyVersion || state.policyVersion,
  };

  if (event.type === "user/message") {
    if (!enabled) return state;
    return {
      ...state,
      ...snapshot,
      running: true,
      verdict: null,
      words: [],
      lastAt: Date.now(),
      enabled,
    };
  }

  if (event.type === "assistant/message") {
    const text = textOf(event?.data?.message?.content);
    if (!text.trim()) return state;
    const scored = classifyOutput(text);
    const blocked = scored.verdict === VERDICT.REFUSAL || scored.verdict === VERDICT.FALLBACK;
    return {
      ...state,
      ...snapshot,
      running: false,
      verdict: scored.verdict,
      words: scored.words.slice(0, 3),
      hits: state.hits + (blocked ? 1 : 0),
      passes: state.passes + (blocked ? 0 : 1),
      refusals: state.refusals + (blocked ? 1 : 0),
      lastAt: Date.now(),
      enabled,
    };
  }

  if (event.type === "turn/end") {
    if (!state.running) return state;
    return { ...state, ...snapshot, running: false, lastAt: Date.now() };
  }

  return state;
}

const LATIN_KEY = /^[a-z0-9]+$/i;
const LATIN_CHAR = /[a-z0-9]/i;

export function escapeText(text, map, opts = {}) {
  const input = String(text || "");
  const hits = [];
  const tokens = [];

  const categories = [];
  if (!input || !map || typeof map !== "object") return { text: input, hits, tokens, categories };
  const explicitGloss = Object.prototype.hasOwnProperty.call(opts, "gloss");
  const notation = typeof opts.notation === "string" && opts.notation
    ? opts.notation
    : explicitGloss
      ? opts.gloss === false
        ? "raw"
        : "gloss"
      : "auto";
  const keys = Object.keys(map)
    .filter((key) => typeof key === "string" && key.length > 0 && typeof map[key] === "string")
    .sort((a, b) => (b.length - a.length) || (a < b ? -1 : 1));
  if (keys.length === 0) return { text: input, hits, tokens, categories };

  const paint = (key, token) => {
    if (tokens.indexOf(token) === -1) {
      tokens.push(token);
      const category = categoryOfToken(token);
      if (category && categories.indexOf(category) === -1) categories.push(category);
    }

    return renderWord(key, notation);
  };

  let out = "";
  let at = 0;
  while (at < input.length) {
    let matchedKey = "";
    let matchedToken = "";
    for (const key of keys) {

      if (LATIN_KEY.test(key)) {
        const end = at + key.length;
        if (end > input.length) continue;
        if (input.slice(at, end).toLowerCase() !== key.toLowerCase()) continue;
        if (at > 0 && LATIN_CHAR.test(input[at - 1])) continue;
        if (end < input.length && LATIN_CHAR.test(input[end])) continue;
      } else if (input.slice(at, at + key.length) !== key) {
        continue;
      }
      matchedKey = key;
      matchedToken = map[key];
      break;
    }
    if (!matchedKey) {
      out += input[at];
      at += 1;
      continue;
    }
    out += paint(matchedKey, matchedToken);
    hits.push(`${matchedKey}→${matchedToken}`);
    at += matchedKey.length;
  }
  return { text: out, hits, tokens, categories };
}

export function escapeNoteText(escaped, diagnostic = false) {
  if (!diagnostic) return "";
  return [
    "[dsh-QingLanPierce 诊断文本 · 仅供人工核对，不属于任何投递路径]",
    `替换后的正文：${String(escaped || "").trim()}`,
  ].join("\n");
}

export const MIN_PROMPT_CHARS = 200;

export function loadPromptTexts(promptDir, userDir) {
  const texts = {};
  const rejected = {};
  const files = [
    ["qinglan-core", "qinglan-core.md"],
    ["qinglan-dominate", "qinglan-dominate.md"],
    ["qinglan-lite", "qinglan-lite.md"],
  ];
  for (const [id, file] of files) {
    const baseFile = `${promptDir}/${file}`;
    const userFile = userDir ? `${userDir}/${file}` : "";
    let builtin = "";
    let user = "";
    try {
      if (existsSync(baseFile)) builtin = readFileSync(baseFile, "utf8");
    } catch {
      builtin = "";
    }
    try {
      if (userFile && existsSync(userFile)) user = readFileSync(userFile, "utf8");
    } catch {
      user = "";
    }
    if (user && user.trim().length >= MIN_PROMPT_CHARS) {
      texts[id] = user;
    } else {
      if (userFile && existsSync(userFile)) rejected[id] = "user prompt too short";
      texts[id] = builtin;
    }
  }
  texts.__rejected = rejected;
  return texts;
}

export function pickPromptId(tier) {
  return TIER_PROMPT[tier] || "qinglan-core";
}

export function promptTierProblems(cfg, prompts) {
  const tier = String(cfg?.tier || "");
  const expected = TIER_PROMPT[tier];
  if (!expected) return [`档位 ${tier || "(空)"} 未登记（只接受 lite/standard/extreme）`];
  const available = prompts && typeof prompts === "object"
    ? (id) => typeof prompts[id] === "string" && prompts[id].trim().length > 0
    : () => true;
  const requested = String(cfg?.promptId || "");
  if (requested && !available(requested)) {

    return [`配置里指定的稿「${requested}」不可用（缺失或过短），已回退到该档位的稿 ${expected}`];
  }
  const effective = requested && available(requested) ? requested : expected;
  if (effective === expected) return [];
  const shownTier = PROMPT_LABEL[effective] || effective;
  const wantTier = PROMPT_LABEL[expected] || expected;
  return [
    `档位显示 ${tier}（${wantTier}），实际注入的是 ${shownTier}（${effective}）—— 显示与实跑不一致；` +
      `要真跑 ${wantTier} 就把 promptId 改成 ${expected}`,
  ];
}

export function fingerprint(text) {
  let hash = 5381;
  const body = typeof text === "string" ? text : "";
  for (let i = 0; i < body.length; i += 1) {
    hash = ((hash * 33) ^ body.charCodeAt(i)) >>> 0;
  }
  return `${body.length.toString(36)}-${hash.toString(36)}`;
}
