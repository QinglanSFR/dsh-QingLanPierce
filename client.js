window.__ModuleLoader__.load({
  id: "dsh-QingLanPierce",
  factory(require) {
    var React = require("react");
    var h = React.createElement;

    var API = "/qinglan-api";
    var STYLE_ID = "qinglan-style";
    var STYLE_VERSION = "qinglan-style-v1";
    var LS_KEY = "dsh-QingLanPierce-ui";
    var BOOT_AT = Date.now();

    // 静默吞异常会让排障时线索全无。这里统一收口：不打断流程，但记进一个有上限的
    // 环形缓冲，随 client-report 一起上报，状态页能看到最后几次被吞掉的是什么。
    var SWALLOW_MAX = 20;
    var swallowLog = [];
    function swallow(where, error) {
      var msg = "";
      try {
        msg = String((error && (error.message || error)) || "");
      } catch (e) {
        msg = "?";
      }
      swallowLog.push({ at: Date.now(), where: String(where || "?"), msg: msg.slice(0, 160) });
      while (swallowLog.length > SWALLOW_MAX) swallowLog.shift();
    }
    function swallowRecent() {
      return swallowLog.slice(-6);
    }
    function consoleSafe(level, message, detail) {
      try {
        if (typeof console === "undefined" || !console) return;
        var fn = console[level];
        if (typeof fn !== "function") return;
        fn.call(console, "[dsh-QingLanPierce] " + message, detail);
      } catch (e) {
        // console 本身不可用：到此为止，不再向上抛，也不记进 swallowLog（会递归）。
      }
    }
    function warnSafe(message, detail) {
      consoleSafe("warn", message, detail);
    }

    var inject = ["slots"];

    var CSS = [
      "#qinglan-style{}",
      ".ql-badge-wrap{display:flex;justify-content:center;width:100%;}",
      ".ql-badge{display:inline-flex;align-items:center;gap:6px;width:fit-content;padding:3px 11px;border-radius:999px;",
      "border:1px solid var(--ql-line,rgba(56,189,248,.45));background:var(--ql-bg,rgba(56,189,248,.10));color:inherit;",
      "font-size:11px;line-height:16px;font-family:inherit;white-space:nowrap;cursor:pointer;user-select:none;",
      "transition:background .18s ease,border-color .18s ease,transform .18s ease;}",
      ".ql-badge:hover{filter:brightness(1.06);}",
      ".ql-dot{width:6px;height:6px;border-radius:50%;background:var(--ql-dot,#38bdf8);flex:none;}",
      ".ql-flash{animation:qlFlash 1.15s ease;}",
      ".ql-pulse{animation:qlPulse 1.25s ease-in-out infinite;}",
      ".ql-sub{opacity:.72;}",
      ".ql-dock{position:fixed;right:18px;bottom:86px;z-index:10040;display:flex;flex-direction:column;",
      "width:var(--ql-w,560px);height:var(--ql-h,62vh);min-width:380px;min-height:300px;max-width:calc(100vw - 24px);max-height:calc(100vh - 24px);",
      "border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.45));border-radius:14px;overflow:hidden;",
      "background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#141414) 92%,transparent);",
      "backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);",
      "box-shadow:0 20px 56px color-mix(in srgb,#000 36%,transparent);color:var(--dsw-alias-label-primary,#eee);}",
      ".ql-dock[data-open='0']{display:none;}",
      ".ql-head{display:flex;align-items:center;gap:10px;padding:11px 14px;",
      "border-bottom:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.35));",
      "cursor:grab;user-select:none;}",
      ".ql-head:active{cursor:grabbing;}",
      ".ql-head .ql-spacer{flex:1;min-width:8px;}",
      ".ql-brand{display:inline-flex;align-items:center;gap:8px;min-width:0;flex:0 1 auto;}",
      ".ql-brand .ql-dot{width:7px;height:7px;background:var(--ql-accent,#38bdf8);",
      "box-shadow:0 0 0 3px color-mix(in srgb,var(--ql-accent,#38bdf8) 22%,transparent);}",
      ".ql-brand-name{font-size:13.5px;font-weight:650;letter-spacing:.2px;white-space:nowrap;",
      "overflow:hidden;text-overflow:ellipsis;}",
      ".ql-chip{display:inline-flex;align-items:center;height:20px;padding:0 8px;border-radius:6px;flex:none;",
      "font-size:11px;line-height:1;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary,#b9b3a8);",
      "background:color-mix(in srgb,var(--dsw-alias-label-primary,#eee) 9%,transparent);",
      "border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.28));}",
      ".ql-chip.ql-tier{color:var(--ql-accent,#38bdf8);",
      "background:color-mix(in srgb,var(--ql-accent,#38bdf8) 14%,transparent);",
      "border-color:color-mix(in srgb,var(--ql-accent,#38bdf8) 38%,transparent);font-weight:600;}",

      ".ql-chip.ql-tier-warn{color:#f59e0b;",
      "background:color-mix(in srgb,#f59e0b 16%,transparent);",
      "border-color:color-mix(in srgb,#f59e0b 45%,transparent);}",

      ".ql-head button{appearance:none;flex:none;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.4));",
      "background:transparent;color:inherit;border-radius:8px;padding:4px 11px;cursor:pointer;font:12px/1.4 inherit;",
      "transition:border-color .18s ease,background .18s ease;}",
      ".ql-head button:hover{border-color:var(--ql-accent,#38bdf8);",
      "background:color-mix(in srgb,var(--ql-accent,#38bdf8) 10%,transparent);}",
      ".ql-tabs{display:flex;gap:2px;padding:6px 10px 0;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.28));flex-wrap:wrap;}",
      ".ql-tab{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--dsw-alias-label-secondary,#b9b3a8);",
      "border-radius:0;padding:8px 11px 7px;cursor:pointer;font:13px/1.3 inherit;margin-bottom:-1px;}",
      ".ql-tab:hover{color:var(--dsw-alias-label-primary,#eee);}",
      ".ql-tab.on{color:var(--dsw-alias-label-primary,#eee);font-weight:650;border-bottom-color:var(--ql-accent,#38bdf8);}",
      ".ql-body{flex:1;min-height:0;overflow:auto;padding:12px 14px 16px;font-size:13px;line-height:1.65;}",
      ".ql-sec{margin:0 0 14px;padding:10px 12px;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.25));border-radius:10px;",
      "background:color-mix(in srgb,var(--dsw-alias-label-primary,#eee) 5%,transparent);}",
      ".ql-sec h4{margin:0 0 8px;font-size:13px;font-weight:650;}",
      ".ql-row{display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px dashed color-mix(in srgb,var(--dsw-alias-border-l1,#888) 60%,transparent);}",
      ".ql-row:last-child{border-bottom:0;}",
      ".ql-row .ql-k{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}",
      ".ql-row .ql-v{font-variant-numeric:tabular-nums;opacity:.9;}",
      ".ql-mute{opacity:.66;font-size:12px;}",
      ".ql-link{display:inline-block;max-width:64%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:bottom;",
      "color:var(--ql-accent,#38bdf8);text-decoration:none;",
      "border-bottom:1px solid color-mix(in srgb,var(--ql-accent,#38bdf8) 45%,transparent);}",
      ".ql-link:hover{border-bottom-color:var(--ql-accent,#38bdf8);}",
      ".ql-star{display:inline-block;margin-top:8px;line-height:1.6;}",
      ".ql-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;}",
      ".ql-card{appearance:none;text-align:left;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.3));border-radius:10px;padding:9px 11px;",
      "background:transparent;color:inherit;cursor:pointer;font:13px/1.5 inherit;}",
      ".ql-card:hover{border-color:var(--ql-accent,#38bdf8);}",
      ".ql-card.on{border-color:var(--ql-accent,#38bdf8);background:color-mix(in srgb,var(--ql-accent,#38bdf8) 12%,transparent);}",
      ".ql-card b{display:block;font-size:13px;}",
      ".ql-card span{display:block;opacity:.66;font-size:12px;margin-top:3px;}",
      ".ql-switch{display:flex;align-items:center;gap:9px;padding:6px 0;cursor:pointer;}",
      ".ql-switch input{appearance:none;width:34px;height:19px;border-radius:999px;background:color-mix(in srgb,var(--dsw-alias-label-primary,#eee) 22%,transparent);",
      "position:relative;cursor:pointer;transition:background .18s ease;flex:none;}",
      ".ql-switch input:checked{background:var(--ql-accent,#38bdf8);}",
      ".ql-switch input::after{content:'';position:absolute;top:2px;left:2px;width:15px;height:15px;border-radius:50%;background:#fff;transition:transform .18s ease;}",
      ".ql-switch input:checked::after{transform:translateX(15px);}",
      ".ql-field,.ql-area{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.35));border-radius:9px;",
      "background:color-mix(in srgb,var(--dsw-alias-bg-layer-1,#141414) 60%,transparent);color:inherit;font:12px/1.6 ui-monospace,Consolas,monospace;padding:8px 9px;}",
      ".ql-area{min-height:220px;resize:vertical;}",
      ".ql-btn{appearance:none;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.4));border-radius:9px;background:transparent;color:inherit;",
      "padding:6px 12px;cursor:pointer;font:12.5px/1.5 inherit;}",
      ".ql-btn:hover{border-color:var(--ql-accent,#38bdf8);}",
      ".ql-btn.primary{background:color-mix(in srgb,var(--ql-accent,#38bdf8) 18%,transparent);border-color:var(--ql-accent,#38bdf8);}",
      ".ql-ops{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}",
      ".ql-resize{position:absolute;right:2px;bottom:2px;width:18px;height:18px;cursor:nwse-resize;z-index:3;",
      "background:linear-gradient(135deg,transparent 46%,color-mix(in srgb,var(--dsw-alias-label-secondary,#999) 65%,transparent) 46%);border-radius:2px;opacity:.85;}",
      "@keyframes qlPulse{0%,100%{box-shadow:0 0 2px var(--ql-dot);opacity:1;}50%{box-shadow:0 0 12px var(--ql-dot);opacity:.62;}}",
      "@keyframes qlFlash{0%{transform:scale(1);}28%{transform:scale(1.07);}100%{transform:scale(1);}}",
    ].join("");

    function useStyleOnce() {
      React.useEffect(function () {
        var old = document.getElementById(STYLE_ID);
        if (old && old.getAttribute("data-version") === STYLE_VERSION) return undefined;
        var el = document.createElement("style");
        el.id = STYLE_ID;
        el.setAttribute("data-version", STYLE_VERSION);
        el.textContent = CSS;
        if (old && old.parentNode) old.parentNode.replaceChild(el, old);
        else document.head.appendChild(el);
        return undefined;
      }, []);
    }

    function readUiState() {
      try {
        var raw = window.localStorage.getItem(LS_KEY);
        if (!raw) return { open: false, tab: "status", w: 560, h: 0, x: null, y: null };
        var parsed = JSON.parse(raw);
        return Object.assign({ open: false, tab: "status", w: 560, h: 0, x: null, y: null }, parsed || {});
      } catch (e) {
        return { open: false, tab: "status", w: 560, h: 0, x: null, y: null };
      }
    }

    function writeUiState(patch) {
      var next = Object.assign(readUiState(), patch || {});
      try {
        window.localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch (e) {
        swallow("ui-state-write", e);
      }
      uiBus.value = next;
      uiBus.listeners.forEach(function (fn) {
        try {
          fn(next);
        } catch (e) {
          swallow("ui-bus-listener", e);
        }
      });
      return next;
    }

    var uiBus = { value: readUiState(), listeners: new Set() };

    function useUi() {
      var pair = React.useState(uiBus.value);
      var setState = pair[1];
      React.useEffect(function () {
        var fn = function (next) {
          setState(next);
        };
        uiBus.listeners.add(fn);
        return function () {
          uiBus.listeners.delete(fn);
        };
      }, []);
      return pair[0];
    }

    function setRemoteStatus(status) {
      if (!status || typeof status !== "object") return;

      remoteBus.status = status;
      remoteBus.listeners.forEach(function (fn) {
        try {
          fn(status);
        } catch (e) {
          swallow("remote-bus-listener", e);
        }
      });
      try {
        cfgAcceptServer(status.config, status.configRev);
      } catch (e) {
        swallow("cfg-accept-server", e);
      }

      try {
        sendClientReport("first-status", false);
      } catch (e) {
        swallow("client-report-first", e);
      }
    }

    function apiCall(action, payload, options) {
      var body = Object.assign({ action: action }, payload || {});
      if (options && options.force) body.force = true;
      remoteBus.reqSeq += 1;
      var seq = remoteBus.reqSeq;

      // 宿主或网络挂起时不能把 busy 钉死：8 秒后主动 abort，走同一条失败路径。
      // 不用 AbortSignal.timeout（旧 Electron 可能没有），成功后也要 clearTimeout。
      var controller = typeof AbortController === "function" ? new AbortController() : null;
      var timer = 0;
      if (controller) {
        timer = window.setTimeout(function () {
          controller.abort();
        }, 8000);
      }
      var settled = function () {
        if (!timer) return;
        window.clearTimeout(timer);
        timer = 0;
      };

      var pending;
      try {
        pending = fetch(API, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: controller ? controller.signal : undefined,
        });
      } catch (error) {
        settled();
        return Promise.resolve({ ok: false, error: String((error && error.message) || error) });
      }
      return pending
        .then(function (res) {
          var type = String((res.headers && res.headers.get && res.headers.get("content-type")) || "");
          if (!res.ok && type.indexOf("json") === -1) {
            return res.text().then(function (bodyText) {
              return { ok: false, httpStatus: res.status, error: "HTTP " + res.status + "：" + String(bodyText || "").slice(0, 160) };
            });
          }
          return res.json();
        })
        .then(function (json) {
          settled();
          var fresh = seq >= remoteBus.appliedSeq;
          if (fresh) remoteBus.appliedSeq = seq;

          if (json && json.status && action !== "client-report") {
            if (fresh) setRemoteStatus(json.status);
            else if (json.status.config) cfgAcceptServer(json.status.config, json.status.configRev);
          }
          return json;
        })
        .catch(function (error) {
          settled();
          var aborted = !!(error && error.name === "AbortError");
          return {
            ok: false,
            error: aborted ? "请求超时（8 秒）" : String((error && error.message) || error),
          };
        });
    }

    var reportState = { sent: 0, lastError: "", lastAt: 0 };

    function clientReportPayload(trigger) {
      var out = { trigger: trigger, at: Date.now() };
      try {
        out.href = String(location.href || "").slice(0, 200);
        out.viewport = String(window.innerWidth || 0) + "x" + String(window.innerHeight || 0);
        out.dpr = Number(window.devicePixelRatio || 1);
        out.lang = String(navigator.language || "");
        out.hasProjection = typeof window.__DSH_BOOT__ !== "undefined";
      } catch (e) {
        swallow("report-payload", e);
      }
      out.swallowed = swallowRecent();
      // 后端 client-report 分支读的是 why / events；之前只发 trigger / swallowed，
      // 服务端日志永远是 undefined。这里只做加法，原有字段一个不动。
      out.why = String(trigger || "");
      out.events = swallowRecent();
      return out;
    }

    function sendClientReport(trigger, force) {
      if (!force && reportState.sent >= 2) return Promise.resolve(null);
      reportState.sent += 1;
      reportState.lastAt = Date.now();
      return apiCall("client-report", { report: clientReportPayload(trigger) })
        .then(function (res) {
          reportState.lastError = res && res.ok === false ? String(res.error || "unknown") : "";
          return res;
        })
        .catch(function (error) {
          reportState.lastError = String((error && error.message) || error);
          return null;
        });
    }

    try {
      window.__qinglanReport = function () {
        return sendClientReport("manual", true);
      };
      window.__qinglanReportState = reportState;
    } catch (e) {
      swallow("global-expose", e);
    }

    var remoteBus = { value: null, status: null, listeners: new Set(), reqSeq: 0, appliedSeq: 0 };

    // 品牌名的唯一真源是宿主推来的 status.brand（源头是 package.json 的 dsh.name）。
    // 这里不另存第二份副本：拿到就用，没拿到就沿用上一次；一次都没拿到才退回默认值。
    var BRAND_FALLBACK = "QingLan破甲插件";
    var brandSeen = BRAND_FALLBACK;
    function brandName(status) {
      var src = status && typeof status === "object" ? status : remoteBus.status;
      if (src && typeof src.brand === "string" && src.brand) brandSeen = src.brand;
      return brandSeen;
    }
    var STATUS_KEY = {
      status: 1,
      version: 1,
      tier: 1,
      promptId: 1,
      injectionOrder: 1,
      sectionChars: 1,
      sectionFingerprint: 1,
      sectionTail: 1,
      checks: 1,
      recentBlocked: 1,
      model: 1,
      escape: 1,
      lastAssembly: 1,
      sessions: 1,
      sessionOverrides: 1,
      pendingEngagements: 1,
      enabled: 1,
      configPath: 1,
      dataDir: 1,
      auditPath: 1,
      hostPolicy: 1,
      configRev: 1,
      brand: 1,
      plugin: 1,
      tierMismatch: 1,
      promptLabel: 1,
      routing: 1,
      pipeline: 1,
      channel: 1,
      network: 1,
    };

    function useRemoteStatus(active) {
      var pair = React.useState(remoteBus.value);
      var setState = pair[1];
      React.useEffect(
        function () {
          var fn = function (next) {
            if (next && typeof next === "object" && Object.keys(next).some(function (key) { return STATUS_KEY[key] === 1; })) setState(next);
          };
          remoteBus.listeners.add(fn);
          apiCall("status");
          return function () {
            remoteBus.listeners.delete(fn);
          };
        },
        [active],
      );
      return pair[0];
    }

    var cfgStore = {
      value: null,
      serverCfg: null,
      serverRev: -1,

      localWriteRev: -1,
      listeners: new Set(),
      localSeq: 0,
      lastLocalWriteAt: 0,
      lastAcceptedAt: 0,
      writeTimer: 0,
      pollTimer: 0,
      pullTimer: 0,
      pending: null,
      touched: false,
      inFlight: 0,
      busy: false,
      failures: 0,
      lastError: "",
      lastResult: null,
      status: { merges: 0, drops: 0, writes: 0, retries: 0, lastAt: 0 },
    };

    var CFG_SEED = {
      enabled: true,
      tier: "standard",
      refusalScan: true,
      autoResend: true,
      autoResendMax: 3,
      mildRecover: true,
      triggerEscape: true,
      triggerEscapeNote: false,

      promptId: "qinglan-core",
    };

    function cfgEnsure() {
      if (cfgStore.value && typeof cfgStore.value.enabled === "boolean") return cfgStore.value;
      cfgStore.value = Object.assign({}, CFG_SEED, cfgStore.seeded || {}, cfgStore.value || {}, cfgStore.pending || {});
      cfgNotify();
      return cfgStore.value;
    }

    function cfgNotify() {
      var snapshot = cfgStore.value;
      cfgStore.listeners.forEach(function (fn) {
        try {
          fn(snapshot);
        } catch (e) {
          swallow("cfg-bus-listener", e);
        }
      });
    }

    function cfgPublish() {
      cfgStore.value = Object.assign(
        {},
        CFG_SEED,
        cfgStore.seeded || {},
        cfgStore.value || {},
        cfgStore.pending || {},
      );
      cfgNotify();
    }

    function cfgAcceptServer(config, rev) {
      if (!config || typeof config !== "object") return;
      cfgStore.serverCfg = Object.assign({}, config);
      var revNum = Number(rev);
      if (Number.isFinite(revNum)) cfgStore.serverRev = Math.max(cfgStore.serverRev || -1, revNum);

      if (cfgStore.inFlight || cfgStore.busy || cfgStore.pending || cfgStore.writeTimer) return;

      var localRev = cfgStore.localWriteRev || 0;
      if (revNum <= localRev) return;
      cfgStore.lastWriteRevApplied = revNum;
      cfgStore.lastAcceptedAt = Date.now();
      cfgStore.touched = true;
      cfgStore.value = Object.assign({}, config);
      cfgNotify();
    }

    function cfgSeedFromProjection(projection) {
      if (!projection || typeof projection !== "object") return;
      if (cfgStore.touched) return;
      var seed = {};
      var keys = Object.keys(projection).filter(function (key) {
        return projection[key] !== undefined && projection[key] !== null && key !== "brand" && key !== "version";
      });
      if (keys.length === 0) return;
      keys.forEach(function (key) {
        seed[key] = projection[key];
      });
      cfgStore.seeded = Object.assign({}, cfgStore.seeded || {}, seed);
      if (cfgStore.value && typeof cfgStore.value.enabled === "boolean") return;
      cfgStore.value = Object.assign({}, CFG_SEED, cfgStore.seeded);
      cfgNotify();
    }

    function cfgFlush() {
      cfgStore.writeTimer = 0;
      var patch = Object.assign({}, cfgStore.pending || {});
      if (Object.keys(patch).length === 0) return;

      cfgStore.pending = null;
      cfgStore.localSeq += 1;
      var id = cfgStore.localSeq;
      var bodyPatch = patch;
      cfgStore.inFlight = id;
      cfgStore.busy = true;
      cfgStore.touched = true;
      cfgStore.lastLocalWriteAt = Date.now();
      cfgStore.status.writes += 1;

      var attempt = 0;
      var send = function () {
        attempt += 1;
        var payload = { patch: bodyPatch, _write: id };
        apiCall("config", payload).then(function (json) {

          if (cfgStore.localSeq !== id) {
            cfgStore.status.drops += 1;
            return;
          }
          cfgStore.inFlight = 0;
          var ok = Boolean(json && json.ok);
          if (ok) {
            cfgStore.busy = false;
            cfgStore.failures = 0;
            cfgStore.lastError = "";
            cfgStore.lastResult = { at: Date.now(), patch: bodyPatch, ok: true, write: id };
            if (json && json.status && json.status.config) {
              cfgStore.serverCfg = Object.assign({}, json.status.config);
              var writeRev = Number(json.status.configRev);
              if (Number.isFinite(writeRev)) {
                cfgStore.serverRev = Math.max(cfgStore.serverRev || -1, writeRev);
                cfgStore.localWriteRev = writeRev;
              }
              cfgStore.lastAcceptedAt = Date.now();
              if (cfgStore.localSeq === id) {

                cfgStore.value = Object.assign({}, json.status.config);
                cfgNotify();
              }
            }
            if (json && json.status) setRemoteStatus(json.status);
            return;
          }
          cfgStore.lastError = String((json && json.error) || "写入失败");
          if (attempt < 3) {
            cfgStore.status.retries += 1;
            cfgStore.busy = true;
            cfgStore.inFlight = id;
            window.setTimeout(send, 400 * attempt);
            return;
          }
          cfgStore.busy = false;
          cfgStore.failures += 1;
          cfgStore.pending = null;
          cfgStore.lastResult = { at: Date.now(), patch: bodyPatch, ok: false, error: cfgStore.lastError, write: id };
          cfgStore.value = Object.assign({}, cfgStore.serverCfg || cfgStore.value || {});
          cfgNotify();
        });
      };
      send();
    }

    function cfgSchedule(plan) {
      cfgStore.pending = Object.assign({}, cfgStore.pending || {}, plan.items || {});
      cfgPublish();
      if (cfgStore.writeTimer) return;
      cfgStore.writeTimer = window.setTimeout(cfgFlush, 200);
    }

    function cfgApply(patch) {
      cfgSchedule({ items: patch || {} });
    }

    function cfgRefresh(delay) {
      if (cfgStore.pullTimer) window.clearTimeout(cfgStore.pullTimer);
      cfgStore.pullTimer = window.setTimeout(function () {
        cfgStore.pullTimer = 0;
        cfgPullOnce(2);
      }, delay || 0);
    }

    function cfgPullOnce(triesLeft) {
      return apiCall("status", null, { force: true }).then(function (json) {
        var status = json && json.status ? json.status : null;
        if (status) {
          setRemoteStatus(status);
          return json;
        }
        if (triesLeft > 0) {
          window.setTimeout(function () {
            cfgPullOnce(triesLeft - 1);
          }, 500);
        }
        return json;
      });
    }

    function cfgUse() {
      cfgEnsure();
      var pair = React.useState(cfgStore.value);
      var setState = pair[1];
      React.useEffect(
        function () {
          var fn = function (next) {
            setState(next);
          };
          cfgStore.listeners.add(fn);
          setState(cfgStore.value);
          cfgRefresh(0);
          return function () {
            cfgStore.listeners.delete(fn);
          };
        },
        [],
      );
      return {
        value: pair[0] || {},
        apply: cfgApply,
        refresh: cfgRefresh,
        state: cfgStore,
      };
    }

    function cfgMenuOpen(on) {
      if (cfgStore.pollTimer) {
        window.clearInterval(cfgStore.pollTimer);
        cfgStore.pollTimer = 0;
      }
      if (!on) return;

      cfgStore.pollTimer = window.setInterval(function () {
        if (cfgStore.busy || cfgStore.writeTimer) return;
        cfgPullOnce(1);
      }, 5000);
    }

    // 投影 hook 是否真由宿主提供：记在模块级，状态页据此区分「已挂载」与
    // 「降级为 HTTP 轮询」，避免整条投影路径静默变成死代码。
    var projectionState = { available: false };

    function useShield(props) {
      var hasProjection = !!(props && typeof props.useProjection === "function");
      projectionState.available = hasProjection;
      try {
        if (hasProjection) return props.useProjection("qlshield");
      } catch (e) {
        projectionState.available = false;
        swallow("use-projection", e);
      }
      return null;
    }

    var PALETTE = {
      idle: { dot: "#38bdf8", line: "rgba(56,189,248,.45)", bg: "rgba(56,189,248,.10)" },
      running: { dot: "#38bdf8", line: "rgba(56,189,248,.5)", bg: "rgba(56,189,248,.10)" },
      pass: { dot: "#22c55e", line: "rgba(34,197,94,.48)", bg: "rgba(34,197,94,.12)" },
      defense: { dot: "#22c55e", line: "rgba(34,197,94,.48)", bg: "rgba(34,197,94,.12)" },
      blocked: { dot: "#ef4444", line: "rgba(239,68,68,.5)", bg: "rgba(239,68,68,.13)" },
      off: { dot: "#94a3b8", line: "rgba(148,163,184,.4)", bg: "rgba(148,163,184,.10)" },
    };

    function toneOf(shield) {
      if (!shield) return PALETTE.idle;
      if (shield.enabled === false) return PALETTE.off;
      if (shield.running) return PALETTE.running;
      if (shield.verdict === "pass" || shield.verdict === "defense" || shield.verdict === "stall") {
        return PALETTE.pass;
      }
      if (shield.verdict === "refusal" || shield.verdict === "fallback") return PALETTE.blocked;
      return PALETTE.idle;
    }

    function QingLanBadge(props) {
      useStyleOnce();
      var ui = useUi();
      var shield = useShield(props);
      var cfgBus = cfgUse();
      var cfg = cfgBus.value || {};
      var shieldCfg = (shield && shield.config) || {};

      React.useEffect(
        function () {
          if (shield && shield.config) cfgSeedFromProjection(shield.config);
        },
        [shield && shield.config ? 1 : 0],
      );
      var text = cfg.badgeText || "QingLan为您的破甲保驾护航";
      var passText = cfg.badgePassText || "数据没有发生变化，你小子防封可以";
      /* 兜底必须和后端 lib/config.js 的 DEFAULTS.badgeFailText 逐字一致 ——
         两边写不同的话，首帧和收到配置后的文案会跳一下（0.1.0 就是这样：
         这里写「我被模型Hook了」，后端是「出事了，我被模型Hook了」）。 */
      var failText = cfg.badgeFailText || "出事了，我被模型Hook了";
      var reframeText = cfg.badgeReframeText || "它想给你替代方案，正在替你转写";
      var stallText = cfg.badgeStallText || "它在反问你，正常";
      var running = !!(shield && shield.running);
      var verdict = shield && shield.verdict;
      var flashKey = "";

      if (shield && shield.enabled === false) {
        text = "QingLan 破甲已关闭";
      } else if (running) {
        text = cfg.badgeThinkingText || text;
      } else if (verdict === "pass" || verdict === "defense") {
        if (cfg.reframe) {
          text = reframeText;
          flashKey = "blocked";
        } else {
          text = passText;
          flashKey = "pass";
        }
      } else if (verdict === "stall") {
        text = stallText;
        flashKey = "pass";
      } else if (verdict === "refusal" || verdict === "fallback") {
        var failWord = shield && shield.words && shield.words[0] ? String(shield.words[0]) : "";
        text = failText + (failWord ? " · " + failWord : "");
        flashKey = "blocked";
      }

      var tone = toneOf(shield);
      var wrapStyle = {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        width: "fit-content",
        padding: "3px 11px",
        borderRadius: "999px",
        border: "1px solid " + tone.line,
        background: tone.bg,
        color: "inherit",
        fontSize: "11px",
        lineHeight: "16px",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        cursor: "pointer",
        userSelect: "none",
        "--ql-dot": tone.dot,
      };
      var dotStyle = {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: tone.dot,
        flex: "none",
      };

      var lastFlash = React.useRef("");
      var tickPair = React.useState(0);
      var setTick = tickPair[1];
      React.useEffect(
        function () {
          if (!flashKey || flashKey === lastFlash.current) return;
          lastFlash.current = flashKey;
          setTick(Date.now());
        },
        [flashKey],
      );

      var stats = [];
      if (shield && shield.passes) stats.push("通过 " + shield.passes);
      if (shield && shield.hits) stats.push("拦截 " + shield.hits);
      if (cfg.tier) stats.push(tierShortLabel(cfg.tier));

      var toggleOpen = function () {
        var state = readUiState();
        writeUiState({ open: !state.open });
      };

      return h(
        "div",
        { className: "ql-badge-wrap" },
        h(
          "div",
          {
            style: wrapStyle,
            className: "ql-badge" + (running ? " ql-pulse" : "") + (flashKey ? " ql-flash" : ""),
            "data-ql": "on",
            role: "button",
            tabIndex: 0,
            "aria-expanded": ui.open ? "true" : "false",
            title: brandName(null) + " · 点击展开菜单",
            onClick: toggleOpen,
            onKeyDown: function (event) {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              toggleOpen();
            },
          },
          h("span", { style: dotStyle }),
          h("span", null, text),
          stats.length && !running
            ? h("span", { className: "ql-sub" }, "· " + stats.join(" · "))
            : null,
          running ? h("span", { className: "ql-sub" }, "· 运行中") : null,
        ),
      );
    }

    // 档位短标签的唯一真源：卡片标题（TIERS.name）保留描述性后缀，
    // 徽标与 Dock 头都从这里取，避免新增档位时几处各拼一份、漏改。
    var TIER_LABEL = { lite: "L1 轻量", standard: "L2 标准", extreme: "L3 极限" };

    function tierLabel(tier) {
      return TIER_LABEL[tier] || TIER_LABEL.standard;
    }

    /* 徽标历史上只显示 L1/L2/L3 的短标，这里从 TIER_LABEL 取首段，
       既保持徽标原有文案，又保证档位名只有一份真源。 */
    function tierShortLabel(tier) {
      return String(tierLabel(tier)).split(" ")[0];
    }

    var TIERS = [
      { id: "lite", name: "L1 轻量（最聪明）", desc: "帧最短、约束最少，几乎不干扰推理：日常问答/写代码/分析首选" },
      { id: "standard", name: "L2 标准", desc: "推荐：完整解除限制，但已把「套技术文档」的默认行为去掉" },
      { id: "extreme", name: "L3 极限（最强破甲）", desc: "约束最硬、凿穿率最高；代价是模型有时会把算力花在守规矩上" },
    ];

    var POSITIONS = [
      { id: -999, name: "极限抢占", desc: "压过 persona 与工具段（最强）" },
      { id: -100, name: "紧跟身份", desc: "推荐：身份之后、工具段之前" },
      { id: 100, name: "常规追加", desc: "最温和，跟随旧插件习惯" },
    ];

    function Row(props) {
      return h(
        "div",
        { className: "ql-row" },
        h("span", { className: "ql-k" }, props.k),
        props.v === undefined || props.v === null ? null : h("span", { className: "ql-v" }, String(props.v)),
        props.children,
      );
    }

    function Toggle(props) {
      return h(
        "label",
        { className: "ql-switch" },
        h("input", {
          type: "checkbox",
          checked: !!props.checked,
          onChange: function (event) {
            props.onChange(!!event.target.checked);
          },
          "aria-checked": props.checked ? "true" : "false",
          role: "switch",
        }),
        h("span", null, props.label),
        props.hint ? h("span", { className: "ql-mute" }, " · " + props.hint) : null,
      );
    }

    function StatusTab(props) {
      var status = useRemoteStatus(props.active);
      var host = status
        ? [
            ["插件版本", String(status.version)],
            ["当前档位", String(status.tier) + (status.promptId ? " · 稿 " + status.promptId + (status.promptLabel ? "（" + status.promptLabel + "）" : "") : "")],
            ["档位自检", status.tierMismatch === true ? "显示与实跑不一致" : "档位与稿子一致"],
            ["注入位置", status.injectionOrder],
            ["稿指纹", status.sectionFingerprint],
            [
              "指称记法",
              status.escape && status.escape.notation
                ? String(status.escape.notation) + (status.escape.notationLabel ? " · " + String(status.escape.notationLabel).split("（")[0] : "")
                : "—",
            ],
            [
              "任务信封",
              status.escape && status.escape.envelope
                ? (status.escape.envelope.enabled === false
                    ? "已关闭"
                    : (status.escape.envelope.applied || 0) > 0
                      ? `已附加 ${status.escape.envelope.applied} 次 · ${String(status.escape.envelope.lastKind || "—")}`
                      : "已开启")
                : "—",
            ],
            ["会话覆盖", status.sessions],
            ["投影 qlshield", projectionState.available ? "已挂载" : "未挂载（降级为 HTTP 轮询）"],
            ["官方文件改写", status.hostPolicy && status.hostPolicy.officialFilesTouched ? "有" : "无"],
            ["补发路由", status.routing ? status.routing.engagedSessions + " 个会话" : "—"],
            ["转写次数", status.pipeline && status.pipeline.rewrites ? String(status.pipeline.rewrites.ok) : "0"],
          ]
        : [];
      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "运行状态"),
          host.length
            ? host.map(function (pair) {
                return h(Row, { key: pair[0], k: pair[0], v: pair[1] });
              })
            : h(Row, { k: "宿主状态", v: "读取中…" }),
        ),
        status && status.checks && status.checks.length
          ? h(
              "div",
              { className: "ql-sec" },
              h("h4", null, "检查项"),
              status.checks.map(function (item, index) {
                return h(
                  "div",
                  {
                    key: index,
                    className: "ql-mute",
                    style: { color: item.level === "error" ? "#ef4444" : item.level === "warn" ? "#f59e0b" : "inherit" },
                  },
                  item.text,
                );
              }),
            )
          : null,
        h(
          "div",
          { className: "ql-ops" },
          h("button", { className: "ql-btn primary", onClick: function () { props.onRefresh && props.onRefresh(); } }, "刷新宿主状态"),
        ),
      );
    }

    function TierTab(props) {
      var current = (props.status && props.status.tier) || "standard";
      var order = props.status ? props.status.injectionOrder : -100;
      var model = (props.status && props.status.model) || null;
      var applyCfg = props.apply || function (patch) { apiCall("config", { patch: patch }); };
      var notePair = React.useState("");
      var note = notePair[0];
      var setNote = notePair[1];

      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "破甲档位"),
          h(
            "div",
            { className: "ql-grid" },
            TIERS.map(function (tier) {
              return h(
                "button",
                {
                  key: tier.id,
                  className: "ql-card" + (current === tier.id ? " on" : ""),
                  onClick: function () {
                    /* 只发 tier：promptId 由宿主半体按 TIER_PROMPT 定稿。
                       这里曾经自己拼 "qinglan-" + tier.id，extreme 拼出 "qinglan-extreme"，
                       被后端打回 qinglan-core —— L3 从上线起就没生效过。 */
                    applyCfg({ tier: tier.id });
                  },
                },
                h("b", null, tier.name),
                h("span", null, tier.desc),
              );
            }),
          ),
          h("div", { className: "ql-mute", style: { marginTop: "8px" } }, "切档后下一条消息即生效（段落文本即时重算，无需重启）。"),
          h("div", { className: "ql-mute", style: { marginTop: "4px" } },
            "若觉得模型变笨了、或回答总被写成技术档案 / 工程文件 → 换 L1 轻量档（约束最少，推理最完整）。L3 是凿穿率最高、但也最占算力的一档。"),
        ),
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "注入位置"),
          h(
            "div",
            { className: "ql-grid" },
            POSITIONS.map(function (pos) {
              return h(
                "button",
                {
                  key: pos.id,
                  className: "ql-card" + (Number(order) === pos.id ? " on" : ""),
                  onClick: function () {
                    applyCfg({ injectionOrder: Number(pos.id) });
                  },
                },
                h("b", null, pos.name + "（" + pos.id + "）"),
                h("span", null, pos.desc),
              );
            }),
          ),
          h(
            "div",
            { style: { marginTop: "8px" } },
            h("input", {
              className: "ql-field",
              defaultValue: String(order),
              onKeyDown: function (event) {
                if (event.key !== "Enter") return;
                var value = Number(event.currentTarget.value);
                if (!Number.isFinite(value)) {
                  setNote("段位需要一个数字，例如 -100。");
                  return;
                }
                /* 宿主段序有边界：身份 -1000 / persona 0 / 工具段 500+。
                   超出区间写进去要么被宿主忽略、要么把注入挤出合理位置，这里先挡。 */
                if (value < -1000 || value > 1000) {
                  setNote("段位只接受 -1000 ~ 1000，收到 " + value + "。");
                  return;
                }
                setNote("");
                applyCfg({ injectionOrder: Math.trunc(value) });
              },
            }),
          ),
          note ? h("div", { className: "ql-mute", style: { marginTop: "6px", color: "#d9534f" } }, note) : null,
          h("div", { className: "ql-mute", style: { marginTop: "6px" } }, "自定义段位：输入数字后回车。宿主段序参考：身份 -1000 / persona 0 / 工具段 500+。"),
        ),
      );
    }

    function SwitchTab(props) {
      var status = props.status;
      var cfg = props.cfg;

      var apply = props.apply || function (patch) { apiCall("config", { patch: patch }); };
      var write = ((props.cfgState && props.cfgState.status) || {}).writes || 0;
      var notePair = React.useState("");
      var note = notePair[0];
      var setNote = notePair[1];
      var host = props.status || null;
      var channel = (host && host.channel) || null;
      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "通道自检"),
          h(Row, { k: "HTTP 通道", v: channel ? (channel.webRouteReady ? "已挂载" : "未挂载") : "宿主未响应" }),
          (function () {
            var pipe = (host && host.pipeline) || null;
            if (!pipe) return null;
            var binds = Array.isArray(pipe.listeners) ? pipe.listeners : [];
            var rw = pipe.rewrites || { ok: 0, fail: 0, lastHits: [] };
            var routes = (host && host.routing) || {};
            var list = binds.map(function (b) { return b.event + (b.ok ? "" : "（未挂上）"); }).join("、");
            return h(
              "div",
              null,
              h("h4", { style: { marginTop: "14px" } }, "运行自检"),
              h(Row, { k: "事件监听", v: binds.length ? list : "无" }),
              h(Row, { k: "转写改写", v: rw.ok + " 次成功 / " + rw.fail + " 次失败" + (rw.lastHits && rw.lastHits.length ? " · 最近 " + rw.lastHits.join(",") : "") }),
              h(Row, { k: "被驱动会话", v: (routes.engagedSessions || 0) + " 个 · 去重 " + (pipe.dedup || 0) + " 条" }),
              h(Row, { k: "最近入站事件", v: (pipe.events && pipe.events.length) ? pipe.events[pipe.events.length - 1].event + " · " + pipe.events[pipe.events.length - 1].chars + " 字" : "—" }),
            );
          })(),
          h(Row, { k: "配置写入次数", v: write ? write + " 次" : "—" }),
          h(
            "div",
            { className: "ql-ops" },
            h("button", {
              className: "ql-btn primary",
              onClick: function () {
                cfgRefresh(0);
                setNote("已重新拉取宿主状态");
              },
            }, "重新拉取宿主状态"),
          ),
          note ? h("div", { className: "ql-mute", style: { marginTop: "8px", whiteSpace: "pre-wrap", wordBreak: "break-all" } }, note) : null,
        ),
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "输出侧对抗"),
          h(Toggle, { label: "扫描拒绝话术", checked: cfg.refusalScan !== false, onChange: function (v) { apply({ refusalScan: v }); } }),
          h(Toggle, { label: "命中后自动补推进话术", checked: cfg.autoResend !== false, onChange: function (v) { apply({ autoResend: v }); } }),
          h(Toggle, { label: "软回退也判为未通过", checked: cfg.mildRecover !== false, onChange: function (v) { apply({ mildRecover: v }); } }),
          h(Row, { k: "单回合补发上限", v: cfg.autoResendMax }),
          h("textarea", {
            className: "ql-area",
            style: { minHeight: "84px", marginTop: "6px" },
            defaultValue: cfg.autoResendText || "",
            onBlur: function (event) { apply({ autoResendText: event.currentTarget.value }); },
          }),
        ),
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "触发器音转"),
          h(Toggle, {
            label: "自动转写字面词",
            checked: cfg.triggerEscape !== false,
            onChange: function (v) { apply({ triggerEscape: v }); },
          }),
          h(Toggle, {
            label: "转写后补一条交付提示",
            checked: cfg.triggerEscapeNote !== false,
            onChange: function (v) { apply({ triggerEscapeNote: v }); },
          }),
          h(Toggle, {
            label: "进模型前就地改写正文",
            checked: cfg.escapeRewrite !== false,
            onChange: function (v) { apply({ escapeRewrite: v }); },
          }),
          h(Toggle, {
            label: "每条用户消息末尾追加预算声明",
            checked: cfg.budgetNote !== false,
            onChange: function (v) { apply({ budgetNote: v }); },
          }),
          h(Row, {
            k: "预算声明已追加",
            v: (function () {
              var b = (host && host.budget) || null;
              if (!b) return "—";
              if (b.enabled === false) return "已关闭";
              return b.appended ? b.appended + " 轮" : "尚未触发";
            })(),
          }),
          h(Row, {
            k: "内置词表",
            v: status && status.escape
              ? status.escape.terms + " 条词 + " + (status.escape.aliases || 0) + " 别名 / " + Object.keys(status.escape.byCategory || {}).length + " 类"
              : "—",
          }),
          h(Row, { k: "用户追加", v: cfg.triggerMap ? Object.keys(cfg.triggerMap).length + " 条" : "0 条" }),
          (function () {
            var liveText = React.useState("");
            var checkText = liveText[0];
            var setCheckText = liveText[1];
            var liveOut = React.useState("");
            var checkOut = liveOut[0];
            var setCheckOut = liveOut[1];
            var liveBusy = React.useState(false);
            var checkBusy = liveBusy[0];
            var setCheckBusy = liveBusy[1];
            var runCheck = function () {
              var value = String(checkText || "");
              if (!value) { setCheckOut("先贴一句话再点自检。"); return; }
              setCheckBusy(true);
              setCheckOut("正在读取…");
              apiCall("escape-check", { text: value }).then(function (json) {
                setCheckBusy(false);
                var c = json && json.check;
                if (!c) {
                  setCheckOut("没有取到结果：" + JSON.stringify((json && json.error) || json || {}).slice(0, 200));
                  return;
                }
                setCheckOut([
                  "判定：" + c.decision + (c.wouldRewrite ? " · 会改写" : " · 不改写") + (c.wouldDeliverNote ? " · 会补说明" : ""),
                  "词表规模：" + c.terms + " 条（文本 " + c.len + " 字）",
                  "命中的词：" + ((c.matched && c.matched.length) ? c.matched.join("、") : "无"),
                  "替换明细：" + ((c.hits && c.hits.length) ? c.hits.join("、") : "—"),
                  "送进模型的样子：" + (c.preview || "—"),
                ].join("\n"));
              });
            };
            return h(
              "div",
              { style: { marginTop: "10px" } },
              h("div", { className: "ql-mute" }, "转写自检（只读，不会发送）"),
              h("textarea", {
                className: "ql-area",
                style: { minHeight: "64px", marginTop: "6px" },
                placeholder: "把要发的那句话贴进来",
                value: checkText,
                onChange: function (event) { setCheckText(event.currentTarget.value); },
              }),
              h(
                "div",
                { className: "ql-ops" },
                h("button", { className: "ql-btn primary", disabled: checkBusy, onClick: runCheck }, checkBusy ? "自检中…" : "跑一次转写自检"),
                h("button", { className: "ql-btn", onClick: function () { setCheckText(""); setCheckOut(""); } }, "清空"),
              ),
              checkOut
                ? h("div", { className: "ql-mute", style: { marginTop: "6px", whiteSpace: "pre-wrap", wordBreak: "break-all" } }, checkOut)
                : null,
            );
          })(),
          status && status.escape && status.escape.byCategory
            ? h("div", { className: "ql-mute", style: { marginTop: "6px" } },
                Object.keys(status.escape.byCategory).map(function (key) { return key + ":" + status.escape.byCategory[key]; }).join(" · "))
            : null,
        ),
      );
    }

    function PromptTab(props) {
      var status = props.status;
      var cfg = props.cfg;
      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "当前生效稿"),
          h(Row, { k: "稿 ID", v: cfg.promptId || "qinglan-core" }),
          h(Row, { k: "字符数", v: status ? status.sectionChars : "—" }),
          h(Row, { k: "指纹", v: status ? status.sectionFingerprint : "—" }),
        ),
      );
    }

    var REPO_URL = "https://github.com/QinglanSFR/dsh-QingLanPierce";
    var AUTHOR_URL = "https://github.com/QinglanSFR";

    function AboutTab(props) {
      var status = props.status;
      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, brandName(status)),
          h(Row, { k: "版本", v: status ? String(status.version) : "未装载" }),
          h(Row, {
            k: "内置词表",
            v: status && status.escape
              ? status.escape.terms + " 条词 + " + (status.escape.aliases || 0) + " 别名 / " + Object.keys(status.escape.byCategory || {}).length + " 类"
              : "—",
          }),
        ),
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "作者与仓库"),
          h(
            Row,
            { k: "作者" },
            h("a", { className: "ql-link", href: AUTHOR_URL, title: "GitHub：" + AUTHOR_URL, target: "_blank", rel: "noopener noreferrer" }, "QinglanSFR"),
          ),
          h(
            Row,
            { k: "仓库地址" },
            h("a", { className: "ql-link", href: REPO_URL, title: REPO_URL, target: "_blank", rel: "noopener noreferrer" }, REPO_URL),
          ),
          h("div", { className: "ql-mute ql-star" }, "如果好用请前往我的仓库点颗Star"),
        ),
      );
    }

    var TABS = [
      { id: "status", label: "状态" },
      { id: "tier", label: "档位" },
      { id: "switch", label: "对抗" },
      { id: "prompt", label: "提示词" },
      { id: "about", label: "关于" },
    ];

    // 拖拽/缩放只用一套指针捕获：pointerup / pointercancel / 组件卸载都能清干净。
    // 之前只在 mouseup 里移除监听，用户在窗口外松手监听器就常驻了。
    var dockPointerCleanup = null;

    function trackDockPointer(event, onMove, onEnd) {
      var handle = event && event.currentTarget;
      var pointerId = event && event.pointerId;
      var move = function (ev) {
        onMove(ev);
      };
      var finish = function (ev) {
        cleanup();
        onEnd(ev);
      };
      var cancel = function () {
        cleanup();
      };
      var cleanup = function () {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", finish);
        window.removeEventListener("pointercancel", cancel);
        if (dockPointerCleanup === cleanup) dockPointerCleanup = null;
        try {
          if (handle && typeof handle.hasPointerCapture === "function" && handle.hasPointerCapture(pointerId)) {
            handle.releasePointerCapture(pointerId);
          }
        } catch (e) {
          swallow("dock-pointer-release", e);
        }
      };
      if (dockPointerCleanup) dockPointerCleanup();
      dockPointerCleanup = cleanup;
      try {
        if (handle && typeof handle.setPointerCapture === "function" && pointerId !== undefined) {
          handle.setPointerCapture(pointerId);
        }
      } catch (e) {
        swallow("dock-pointer-capture", e);
      }
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", finish);
      window.addEventListener("pointercancel", cancel);
    }

    function QingLanDock(props) {
      useStyleOnce();
      var ui = useUi();
      var shield = useShield(props);
      var status = useRemoteStatus(ui.open);
      if (ui.open) {
        document.documentElement.style.setProperty("--ql-w", ui.w + "px");
        if (ui.h) document.documentElement.style.setProperty("--ql-h", ui.h + "px");
      }

      var startDrag = function (event) {
        var startX = event.clientX;
        var startY = event.clientY;
        var state = readUiState();
        var el = event.currentTarget.parentElement;
        var rect = el.getBoundingClientRect();
        var startLeft = rect.left;
        var startTop = rect.top;
        el.style.right = "auto";
        el.style.bottom = "auto";
        el.style.left = startLeft + "px";
        el.style.top = startTop + "px";

        trackDockPointer(
          event,
          function (ev) {
            el.style.left = startLeft + (ev.clientX - startX) + "px";
            el.style.top = startTop + (ev.clientY - startY) + "px";
          },
          function (ev) {
            writeUiState({
              x: startLeft + (ev.clientX - startX),
              y: startTop + (ev.clientY - startY),
              w: state.w,
              h: state.h,
            });
          },
        );
      };

      var startResize = function (event) {
        event.stopPropagation();
        var startX = event.clientX;
        var startY = event.clientY;
        var el = event.currentTarget.parentElement;
        var rect = el.getBoundingClientRect();
        trackDockPointer(
          event,
          function (ev) {
            var w = Math.max(380, Math.round(rect.width + (ev.clientX - startX)));
            var h = Math.max(300, Math.round(rect.height + (ev.clientY - startY)));
            el.style.width = w + "px";
            el.style.height = h + "px";
          },
          function (ev) {
            writeUiState({
              w: Math.max(380, Math.round(rect.width + (ev.clientX - startX))),
              h: Math.max(300, Math.round(rect.height + (ev.clientY - startY))),
            });
          },
        );
      };

      var cfgBus = cfgUse();
      var localCfg = cfgBus.value || {};

      var effectiveCfg = Object.assign({}, (shield && shield.config) || {}, localCfg);
      var cfgState = cfgBus.state;

      React.useEffect(
        function () {
          cfgMenuOpen(ui.open);
          return function () {
            cfgMenuOpen(false);
          };
        },
        [ui.open],
      );

      React.useEffect(
        function () {
          return function () {
            if (dockPointerCleanup) dockPointerCleanup();
          };
        },
        [],
      );

      var dockStyle = {
        right: ui.x === null ? "18px" : "auto",
        bottom: ui.y === null ? "86px" : "auto",
        left: ui.x === null ? "auto" : ui.x + "px",
        top: ui.y === null ? "auto" : ui.y + "px",
      };
      if (ui.w) dockStyle.width = ui.w + "px";
      if (ui.h) dockStyle.height = ui.h + "px";

      var body = null;
      if (ui.tab === "status") {
        body = h(StatusTab, {
          active: ui.open,
          onRefresh: function () { cfgBus.refresh(0); },
        });
      } else if (ui.tab === "tier") body = h(TierTab, { status: status, active: ui.open, cfg: effectiveCfg, apply: cfgBus.apply });
      else if (ui.tab === "switch") body = h(SwitchTab, { status: status, cfg: effectiveCfg, cfgState: cfgState, active: ui.open, apply: cfgBus.apply });
      else if (ui.tab === "prompt") body = h(PromptTab, { status: status, cfg: effectiveCfg, active: ui.open });
      else body = h(AboutTab, { status: status, active: ui.open });

      var headMeta = status
        ? {

            tierLabel: (function () {
              var actual = status.promptLabel || "";
              var mismatch = status.tierMismatch === true;
              var want = tierLabel(status.tier);
              if (!mismatch) return actual || want;
              return want + "? → " + (actual || status.promptId || "?");
            })(),
            tierWarn: status.tierMismatch === true,
            full: "v" + status.version + " · " + status.tier + " · 稿 " + (status.promptId || "?") + " · 位置 " + status.injectionOrder,
          }
        : { tierLabel: "", tierWarn: false, full: "正在读取宿主状态…" };

      return h(
        "div",
        { className: "ql-dock", "data-open": ui.open ? "1" : "0", style: dockStyle },
        h(
          "div",
          { className: "ql-head", onPointerDown: startDrag, title: headMeta.full },
          h(
            "span",
            { className: "ql-brand" },
            h("span", { className: "ql-dot" }),
            h("span", { className: "ql-brand-name" }, brandName(status)),
          ),
          h("span", { className: "ql-spacer" }),
          headMeta.tierLabel ? h("span", { className: "ql-chip ql-tier" + (headMeta.tierWarn ? " ql-tier-warn" : "") }, headMeta.tierLabel) : null,
          h(
            "button",
            {
              type: "button",
              onPointerDown: function (event) { event.stopPropagation(); },
              onClick: function () { writeUiState({ open: false }); },
            },
            "收起",
          ),
        ),
        h(
          "div",
          { className: "ql-tabs", role: "tablist" },
          TABS.map(function (tab) {
            return h(
              "button",
              {
                key: tab.id,
                type: "button",
                role: "tab",
                className: "ql-tab" + (ui.tab === tab.id ? " on" : ""),
                "aria-selected": ui.tab === tab.id ? "true" : "false",
                onClick: function () { writeUiState({ tab: tab.id }); },
              },
              tab.label,
            );
          }),
        ),
        h("div", { className: "ql-body" }, body),
        h("div", { className: "ql-resize", onPointerDown: startResize, title: "拖动调整大小" }),
      );
    }

    function ErrorBoundary(props) {
      if (typeof React.Component !== "function") return props.children || null;
      return h(BoundaryClass, null, props.children);
    }

    var BoundaryClass = typeof React.Component === "function"
      ? (function () {
          function Klass(props) {
            React.Component.call(this, props);
            this.state = { failed: false };
          }
          Klass.prototype = Object.create(React.Component.prototype);
          Klass.prototype.constructor = Klass;
          Klass.getDerivedStateFromError = function () {
            return { failed: true };
          };
          Klass.prototype.componentDidCatch = function (error) {
            warnSafe("slot entry crashed:", error && error.message);
          };
          Klass.prototype.render = function () {
            if (this.state.failed) return null;
            return this.props.children || null;
          };
          return Klass;
        })()
      : null;

    function apply(ctx) {
      consoleSafe("log", "client applied", { at: Date.now() });

      try {
        sendClientReport("apply", false);
      } catch (e) {
        swallow("client-report-apply", e);
      }

      try {
        ctx.slots.inject("conversation.input.dock", function () {
          return ctx.slots.register(
            { name: "conversation.input.dock", id: "qinglan", order: 31 },
            function (props) {
              return h(ErrorBoundary, null, h(QingLanBadge, props || {}));
            },
          );
        });
      } catch (error) {
        swallow("badge-slot-mount", error);
        warnSafe("badge slot failed:", error && error.message);
      }

      try {
        ctx.slots.inject("shell.overlay", function () {
          return ctx.slots.register(
            { name: "shell.overlay", id: "qinglan-dock", order: 60 },
            function (props) {
              return h(ErrorBoundary, null, h(QingLanDock, props || {}));
            },
          );
        });
      } catch (error) {
        swallow("dock-slot-mount", error);
        warnSafe("dock slot failed:", error && error.message);
      }
    }

    return {
      name: "dsh-QingLanPierce",
      inject: inject,
      apply: apply,
      __test: { safe: true },
    };
  },
});
