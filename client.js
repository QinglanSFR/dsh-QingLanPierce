window.__ModuleLoader__.load({
  id: "dsh-QingLanPierce",
  factory(require) {
    var React = require("react");
    var h = React.createElement;

    var API = "/qinglan-api";
    var STYLE_ID = "qinglan-style";
    var LS_KEY = "dsh-QingLanPierce-ui";
    var BOOT_AT = Date.now();

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

      ".ql-legal-mask{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;",
      "background:rgba(8,10,14,.92);backdrop-filter:blur(3px);padding:24px;}",
      ".ql-legal-box{display:flex;flex-direction:column;width:min(880px,96vw);max-height:92vh;",
      "background:var(--dsw-alias-bg-layer-2,#14181f);color:var(--dsw-alias-label-primary,#e8e8ea);",
      "border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.35));border-radius:14px;overflow:hidden;",
      "box-shadow:0 24px 64px rgba(0,0,0,.55);font:13px/1.6 inherit;}",
      ".ql-legal-head{padding:14px 18px;font-size:15px;font-weight:600;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.28));}",
      ".ql-legal-meta{padding:8px 18px;font-size:11px;opacity:.65;border-bottom:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.18));}",
      ".ql-legal-body{flex:1 1 auto;overflow:auto;margin:0;padding:14px 18px;white-space:pre-wrap;word-break:break-word;",
      "font:12px/1.7 ui-monospace,Consolas,monospace;background:color-mix(in srgb,var(--dsw-alias-label-primary,#eee) 4%,transparent);}",
      ".ql-legal-ask{padding:10px 18px;font-size:12px;opacity:.8;border-top:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.18));}",
      ".ql-legal-hint{padding:0 18px 8px;font-size:12px;color:#f59e0b;}",
      ".ql-legal-ops{display:flex;flex-wrap:wrap;gap:10px;padding:12px 18px 16px;border-top:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.28));}",
      ".ql-legal-ok{appearance:none;flex:1 1 320px;border:1px solid transparent;border-radius:10px;padding:10px 14px;",
      "font:13px/1.4 inherit;font-weight:600;cursor:pointer;background:var(--ql-accent,#38bdf8);color:#08121b;}",
      ".ql-legal-ok:disabled{cursor:not-allowed;background:color-mix(in srgb,var(--dsw-alias-label-primary,#eee) 12%,transparent);",
      "color:var(--dsw-alias-label-secondary,#b9b3a8);border-color:var(--dsw-alias-border-l1,rgba(127,127,127,.3));}",
      ".ql-legal-no{appearance:none;flex:0 1 auto;border:1px solid var(--dsw-alias-border-l1,rgba(127,127,127,.4));",
      "background:transparent;color:inherit;border-radius:10px;padding:10px 14px;font:13px/1.4 inherit;cursor:pointer;}",
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
        var tag = document.getElementById(STYLE_ID);
        if (tag) return undefined;
        var el = document.createElement("style");
        el.id = STYLE_ID;
        el.textContent = CSS;
        document.head.appendChild(el);
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
      } catch (e) {}
      uiBus.value = next;
      uiBus.listeners.forEach(function (fn) {
        try {
          fn(next);
        } catch (e) {}
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

      try {
        legalOverlaySync(status);
      } catch (e) {}
      remoteBus.rev += 1;
      remoteBus.status = status;
      remoteBus.listeners.forEach(function (fn) {
        try {
          fn(status);
        } catch (e) {}
      });
      try {
        cfgAcceptServer(status.config, status.configRev);
      } catch (e) {}

      try {
        sendClientReport("first-status", false);
      } catch (e) {}
    }

    function apiCall(action, payload, options) {
      var body = Object.assign({ action: action }, payload || {});
      if (options && options.force) body.force = true;
      remoteBus.reqSeq += 1;
      var seq = remoteBus.reqSeq;
      return fetch(API, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
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
          var fresh = seq >= remoteBus.appliedSeq;
          if (fresh) remoteBus.appliedSeq = seq;

          if (json && json.status && action !== "client-report") {
            if (fresh) setRemoteStatus(json.status);
            else if (json.status.config) cfgAcceptServer(json.status.config, json.status.configRev);
          }
          return json;
        })
        .catch(function (error) {
          var result = { ok: false, error: String((error && error.message) || error) };
          if (seq > remoteBus.appliedSeq) {
            result._stale = remoteBus.appliedSeq < seq;
            result._seq = seq;
          }
          return result;
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
      } catch (e) {}
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
    } catch (e) {}

    var remoteBus = { value: null, status: null, listeners: new Set(), reqSeq: 0, appliedSeq: 0 };
    var STATUS_KEY = {
      status: 1,
      version: 1,
      tier: 1,
      promptId: 1,
      injectionOrder: 1,
      sectionChars: 1,
      sectionFingerprint: 1,
      sectionHead: 1,
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
      legal: 1,
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
      itemTimer: 0,
      pollTimer: 0,
      pullTimer: 0,
      pending: null,
      pendingText: null,
      touched: false,
      inFlight: 0,
      busy: false,
      failures: 0,
      lastError: "",
      lastResult: null,
      draftText: "",
      status: { merges: 0, drops: 0, writes: 0, retries: 0, lastAt: 0 },
    };

    var CFG_SEED = {
      enabled: true,
      tier: "extreme",
      refusalScan: true,
      autoResend: true,
      autoResendMax: 3,
      mildRecover: true,
      triggerEscape: true,
      triggerEscapeNote: false,

      promptId: "qinglan-dominate",
    };

    function cfgEnsure() {
      if (cfgStore.value && typeof cfgStore.value.enabled === "boolean") return cfgStore.value;
      cfgStore.value = Object.assign({}, CFG_SEED, cfgStore.seeded || {}, cfgStore.value || {}, cfgStore.pending || {}, draftFields());
      cfgNotify();
      return cfgStore.value;
    }

    function cfgNotify() {
      var snapshot = cfgStore.value;
      cfgStore.listeners.forEach(function (fn) {
        try {
          fn(snapshot);
        } catch (e) {}
      });
    }

    function cfgPublish() {
      cfgStore.value = Object.assign(
        {},
        CFG_SEED,
        cfgStore.seeded || {},
        cfgStore.value || {},
        cfgStore.pending || {},
        draftFields(),
      );
      cfgNotify();
    }

    function draftFields() {
      return cfgStore.pendingText && cfgStore.pendingText.active
        ? { promptId: cfgStore.pendingText.id || undefined }
        : {};
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
      var textPlan = cfgStore.pendingText && cfgStore.pendingText.active ? cfgStore.pendingText : null;
      if (Object.keys(patch).length === 0 && !textPlan) return;
      if (textPlan && textPlan.text === undefined) return;

      cfgStore.pending = null;
      cfgStore.pendingText = null;
      cfgStore.localSeq += 1;
      var id = cfgStore.localSeq;
      var bodyPatch = patch;
      if (textPlan) bodyPatch = Object.assign({}, patch, { promptId: textPlan.id || patch.promptId });
      cfgStore.inFlight = id;
      cfgStore.busy = true;
      cfgStore.touched = true;
      cfgStore.lastLocalWriteAt = Date.now();
      cfgStore.status.writes += 1;

      var attempt = 0;
      var send = function () {
        attempt += 1;
        var payload = { patch: bodyPatch, _write: id };
        if (textPlan) payload.text = textPlan.text;
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

                cfgStore.value = Object.assign({}, json.status.config, bodyPatch);
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
          cfgStore.lastResult = { at: Date.now(), patch: bodyPatch, ok: false, error: cfgStore.lastError, write: id };
          cfgStore.value = Object.assign({}, cfgStore.serverCfg || cfgStore.value || {});
          cfgNotify();
        });
      };
      send();
    }

    function cfgSchedule(plan) {
      cfgStore.pending = Object.assign({}, cfgStore.pending || {}, plan.items || {});
      if (plan.text !== undefined) {
        cfgStore.pendingText = { active: true, id: plan.id || "", text: plan.text };
        cfgStore.draftText = String(plan.text);
      }
      cfgPublish();
      if (cfgStore.writeTimer) return;
      cfgStore.writeTimer = window.setTimeout(cfgFlush, 200);
    }

    function cfgApply(patch) {
      cfgSchedule({ items: patch || {} });
    }

    function cfgApplyText(payload) {
      cfgSchedule({ items: {}, id: payload && payload.id, text: (payload && payload.text) || "" });
    }

    function cfgApplyLater(patch, delay) {
      if (cfgStore.itemTimer) window.clearTimeout(cfgStore.itemTimer);
      cfgStore.itemTimer = window.setTimeout(function () {
        cfgStore.itemTimer = 0;
        cfgApply(patch);
      }, delay || 600);
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
        var status = json && json.status ? json.status : json && json.ok && json.status ? json.status : null;
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
        applyText: cfgApplyText,
        applyLater: cfgApplyLater,
        refresh: cfgRefresh,
        state: cfgStore,
      };
    }

    function cfgMenuOpen(on) {      if (cfgStore.pollTimer) {
        window.clearInterval(cfgStore.pollTimer);
        cfgStore.pollTimer = 0;
      }
      if (!on) return;

      cfgStore.pollTimer = window.setInterval(function () {
        if (cfgStore.busy || cfgStore.writeTimer) return;
        cfgPullOnce(1);
      }, 5000);
    }

    function useShield(props) {
      try {
        if (props && typeof props.useProjection === "function") return props.useProjection("qlshield");
      } catch (e) {}
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
      if (shield.verdict === "pass" || shield.verdict === "defense") return PALETTE.pass;
      if (shield.verdict === "refusal" || shield.verdict === "fallback") return PALETTE.blocked;
      return PALETTE.idle;
    }

    function QingLanBadge(props) {
      useStyleOnce();
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
      var failText = cfg.badgeFailText || "我被模型Hook了";
      var reframeText = cfg.badgeReframeText || "它想给你替代方案，正在替你转写";
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
      } else if (verdict === "refusal" || verdict === "fallback") {
        text = failText + (shield && shield.words && shield.words[0] ? " · " + shield.words[0] : "");
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
      if (cfg.tier) stats.push(cfg.tier === "extreme" ? "L3" : cfg.tier === "lite" ? "L1" : "L2");

      return h(
        "div",
        { className: "ql-badge-wrap" },
        h(
          "div",
          {
            style: wrapStyle,
            className: "ql-badge" + (running ? " ql-pulse" : "") + (flashKey ? " ql-flash" : ""),
            "data-ql": "on",
            title: "QingLan 破甲中枢 · 点击展开菜单",
            onClick: function () {
              var state = readUiState();
              writeUiState({ open: !state.open });
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
            ["注入正文", status.sectionChars + " 字"],
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
            [
              "免责协议",
              status.legal
                ? `协议 ${status.legal.version} · ${status.legal.accepted ? "已确认" : "未确认"}` +
                  (status.legal.acceptedAt ? "（" + new Date(status.legal.acceptedAt).toLocaleDateString() + "）" : "")
                : "—",
            ],
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
        status && status.sectionHead
          ? h(
              "div",
              { className: "ql-sec" },
              h("h4", null, "注入正文"),
              h("div", { className: "ql-mute", style: { whiteSpace: "pre-wrap", fontFamily: "ui-monospace,Consolas,monospace" } }, status.sectionHead),
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
                    applyCfg({ tier: tier.id, promptId: "qinglan-" + (tier.id === "standard" ? "core" : tier.id) });
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
                if (Number.isFinite(value)) applyCfg({ injectionOrder: value });
              },
            }),
          ),
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
          h(Row, { k: "内置词表", v: status && status.escape ? status.escape.terms + " 条 / " + Object.keys(status.escape.byCategory || {}).length + " 类" : "—" }),
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
      var textPair = React.useState("");
      var text = textPair[0];
      var setText = textPair[1];
      var idPair = React.useState(cfg.promptId || "qinglan-core");
      var id = idPair[0];
      var setId = idPair[1];
      var notePair = React.useState("");
      var note = notePair[0];
      var setNote = notePair[1];
      var applyCfg = props.apply || function (patch) { apiCall("config", { patch: patch }); };
      var applyText = props.applyText || function () {
        setNote("本实例暂不支持文本写入，请用 /qinglan reload 后再试。");
      };

      React.useEffect(
        function () {
          if (!props.active) return;
          fetch(API, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ action: "prompt", id: cfg.promptId || "qinglan-core" }),
          })
            .then(function (res) { return res.json(); })
            .then(function (json) {
              if (json && typeof json.text === "string") setText(json.text);
              setNote("已载入当前生效稿（" + (json && json.length ? json.length : 0) + " 字），可直接改。");
            })
            .catch(function (error) {
              setNote("载入失败：" + String((error && error.message) || error));
            });
        },
        [props.active],
      );

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
          note ? h("div", { className: "ql-mute", style: { marginTop: "6px" } }, note) : null,
        ),
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "编辑 / 换措辞"),
          h("input", {
            className: "ql-field",
            value: id,
            onChange: function (event) { setId(event.currentTarget.value); },
            style: { marginBottom: "8px" },
            placeholder: "稿 ID（写入同名文件会覆盖用户稿，原文件自动备份）",
          }),
          h("textarea", {
            className: "ql-area",
            value: text,
            onChange: function (event) { setText(event.currentTarget.value); },
            placeholder: "把新的破甲正文粘贴到这里；点「写入并启用」后下一条消息生效。",
          }),
          h(
            "div",
            { className: "ql-ops" },
            h("button", {
              className: "ql-btn primary",
              onClick: function () {
                applyText({ id: id, text: text });
                setNote("已提交写入队列：正文 " + String(text || "").length + " 字 → 稿 " + id + "（写盘成功后下一条消息生效）");
              },
            }, "写入并启用"),
            h("button", {
              className: "ql-btn",
              onClick: function () { applyCfg({ promptId: "qinglan-core" }); },
            }, "切回内置 core"),
          ),
        ),
      );
    }

    function AboutTab(props) {
      var status = props.status;
      return h(
        "div",
        null,
        h(
          "div",
          { className: "ql-sec" },
          h("h4", null, "QingLan 破甲中枢"),
          h(Row, { k: "版本", v: status ? String(status.version) : "未装载" }),
          h(Row, { k: "内置词表", v: status && status.escape ? status.escape.terms + " 条 / " + Object.keys(status.escape.byCategory || {}).length + " 类" : "—" }),
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

    var LEGAL_FALLBACK_SECONDS = 20;
    var legalOverlay = {
      el: null,
      styleEl: null,
      node: {},
      info: null,
      startedAt: 0,
      seconds: LEGAL_FALLBACK_SECONDS,
      busy: false,
      failures: 0,
      lastHash: "",

      acceptedAt: 0,
    };

    function legalOverlayMount() {
      if (legalOverlay.el) return legalOverlay.el;
      if (typeof document === "undefined" || !document.body) return null;

      var mask = document.createElement("div");
      mask.setAttribute("data-qinglan", "legal-mask");

      var maskStyle = {
        position: "fixed",
        left: "0",
        top: "0",
        right: "0",
        bottom: "0",
        width: "100vw",
        height: "100vh",
        margin: "0",
        padding: "20px",
        boxSizing: "border-box",
        zIndex: "2147483647",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8,10,14,0.94)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        color: "#e8e8ea",
        font: "13px/1.6 -apple-system,BlinkMacSystemFont,Segoe UI,Microsoft YaHei,sans-serif",
        pointerEvents: "auto",
      };
      Object.keys(maskStyle).forEach(function (key) { mask.style[key] = maskStyle[key]; });

      var box = document.createElement("div");
      var boxStyle = {
        display: "flex",
        flexDirection: "column",
        width: "min(900px, 96vw)",
        maxHeight: "92vh",
        minHeight: "0",
        background: "#14181f",
        border: "1px solid rgba(127,127,127,0.35)",
        borderRadius: "14px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      };
      Object.keys(boxStyle).forEach(function (key) { box.style[key] = boxStyle[key]; });

      var head = document.createElement("div");
      head.textContent = "用户免责与责任承担协议（EULA）";
      var headStyle = { padding: "14px 18px", fontSize: "15px", fontWeight: "600", borderBottom: "1px solid rgba(127,127,127,0.28)", flex: "0 0 auto" };
      Object.keys(headStyle).forEach(function (key) { head.style[key] = headStyle[key]; });

      var meta = document.createElement("div");
      var metaStyle = { padding: "8px 18px", fontSize: "11px", opacity: "0.7", borderBottom: "1px solid rgba(127,127,127,0.18)", flex: "0 0 auto" };
      Object.keys(metaStyle).forEach(function (key) { meta.style[key] = metaStyle[key]; });

      var body = document.createElement("div");
      body.textContent = "正在读取协议正文…";
      var bodyStyle = {
        flex: "1 1 auto",
        minHeight: "0",
        overflowY: "auto",
        margin: "0",
        padding: "14px 18px",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        font: "12px/1.7 ui-monospace,Consolas,monospace",
        background: "rgba(255,255,255,0.03)",
      };
      Object.keys(bodyStyle).forEach(function (key) { body.style[key] = bodyStyle[key]; });

      var ask = document.createElement("div");
      ask.textContent = "请逐条阅读后确认。未确认前插件功能不生效，且本窗口无法关闭。若不同意，请退出并卸载本插件。";
      var askStyle = { padding: "10px 18px", fontSize: "12px", opacity: "0.85", borderTop: "1px solid rgba(127,127,127,0.18)", flex: "0 0 auto" };
      Object.keys(askStyle).forEach(function (key) { ask.style[key] = askStyle[key]; });

      var hint = document.createElement("div");
      hint.style.padding = "0 18px 8px";
      hint.style.fontSize = "12px";
      hint.style.color = "#f59e0b";
      hint.style.flex = "0 0 auto";

      var ops = document.createElement("div");
      var opsStyle = { display: "flex", flexWrap: "wrap", gap: "10px", padding: "12px 18px 16px", borderTop: "1px solid rgba(127,127,127,0.28)", flex: "0 0 auto" };
      Object.keys(opsStyle).forEach(function (key) { ops.style[key] = opsStyle[key]; });

      var okBtn = document.createElement("button");
      okBtn.type = "button";
      okBtn.textContent = "请阅读协议… " + legalOverlay.seconds + " 秒后可确认";
      var okStyle = { flex: "1 1 320px", padding: "10px 14px", borderRadius: "10px", border: "1px solid transparent", font: "600 13px/1.4 inherit", cursor: "not-allowed", background: "rgba(255,255,255,0.12)", color: "#b9b3a8" };
      Object.keys(okStyle).forEach(function (key) { okBtn.style[key] = okStyle[key]; });
      okBtn.disabled = true;
      okBtn.addEventListener("click", function (event) {
        event.preventDefault();
        legalOverlayAgree();
      });

      var noBtn = document.createElement("button");
      noBtn.type = "button";
      noBtn.textContent = "我不同意（如何退出/卸载）";
      var noStyle = { flex: "0 1 auto", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(127,127,127,0.4)", background: "transparent", color: "inherit", font: "13px/1.4 inherit", cursor: "pointer" };
      Object.keys(noStyle).forEach(function (key) { noBtn.style[key] = noStyle[key]; });
      noBtn.addEventListener("click", function (event) {
        event.preventDefault();
        legalOverlaySethint("不同意即无法使用本插件：请在宿主里禁用或卸载 dsh-QingLanPierce，或完全退出 DeepSeek Harness。");
      });

      ops.appendChild(okBtn);
      ops.appendChild(noBtn);
      box.appendChild(head);
      box.appendChild(meta);
      box.appendChild(body);
      box.appendChild(ask);
      box.appendChild(hint);
      box.appendChild(ops);
      mask.appendChild(box);
      document.body.appendChild(mask);

      legalOverlay.el = mask;
      legalOverlay.node = { head: head, meta: meta, body: body, hint: hint, ok: okBtn, no: noBtn };
      legalOverlay.startedAt = Date.now();
      return mask;
    }

    function legalOverlaySethint(text) {
      if (legalOverlay.node.hint) legalOverlay.node.hint.textContent = String(text || "");
    }

    function legalOverlayUnmount() {
      var el = legalOverlay.el;
      if (el && el.parentNode) {
        try { el.parentNode.removeChild(el); } catch (e) {}
      }
      legalOverlay.el = null;
      legalOverlay.node = {};
      legalOverlay.info = null;
      legalOverlay.lastHash = "";
      legalOverlay.failures = 0;

    }

    function legalOverlayRefresh() {
      if (!legalOverlay.el) return;
      var info = legalOverlay.info;
      var node = legalOverlay.node;
      if (info) {
        node.meta.textContent = "协议版本 " + String(info.version || "unknown") + " · 内容哈希 " + String(info.hash || "—") + (info.stale ? " · 协议已更新，需重新确认" : "");
        if (info.text && node.body.textContent.length < 40) node.body.textContent = info.text;
        legalOverlay.seconds = Number(info.countdownSeconds) || LEGAL_FALLBACK_SECONDS;
      }
      var left = Math.max(0, legalOverlay.seconds - Math.floor((Date.now() - legalOverlay.startedAt) / 1000));
      var ready = left <= 0 && !legalOverlay.busy;
      node.ok.disabled = !ready;
      node.ok.textContent = ready
        ? "我承诺遵守本协议，一切后果由我承担"
        : (legalOverlay.busy ? "正在提交确认…" : "请阅读协议… " + left + " 秒后可确认");
      Object.keys(node.ok.style).forEach(function (key) { delete node.ok.style[key]; });
      var okStyle = ready
        ? { flex: "1 1 320px", padding: "10px 14px", borderRadius: "10px", border: "1px solid transparent", font: "600 13px/1.4 inherit", cursor: "pointer", background: "#38bdf8", color: "#08121b" }
        : { flex: "1 1 320px", padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(127,127,127,0.3)", font: "600 13px/1.4 inherit", cursor: "not-allowed", background: "rgba(255,255,255,0.12)", color: "#b9b3a8" };
      Object.keys(okStyle).forEach(function (key) { node.ok.style[key] = okStyle[key]; });
    }

    function legalOverlayAgree() {
      if (legalOverlay.busy || !legalOverlay.el) return;
      var left = Math.max(0, legalOverlay.seconds - Math.floor((Date.now() - legalOverlay.startedAt) / 1000));
      if (left > 0) return;
      legalOverlay.busy = true;
      legalOverlaySethint("");
      legalOverlayRefresh();
      apiCall("legal-accept", {}).then(function (json) {
        legalOverlay.busy = false;
        if (json && json.ok) {
          legalOverlaySethint("已确认，正在启用插件…");
          legalOverlayRefresh();
          legalOverlaySync(json.status || { legal: json.legal });
          legalOverlayPoll(0);
          return;
        }
        legalOverlaySethint("确认失败：" + String((json && json.error) || "未知错误") + "（可再点一次；确认成功前功能不生效）");
        legalOverlayRefresh();
      });
    }

    function legalOverlaySync(status) {
      var info = status && status.legal ? status.legal : null;
      if (!info) return;
      if (info.accepted) {
        legalOverlay.acceptedAt = Date.now();
        legalOverlayUnmount();
        return;
      }
      if (legalOverlay.acceptedAt && Date.now() - legalOverlay.acceptedAt < 5000) return;
      var mounted = legalOverlayMount();
      if (!mounted) return;

      if (legalOverlay.lastHash && legalOverlay.lastHash !== info.hash) legalOverlay.startedAt = Date.now();
      legalOverlay.lastHash = info.hash || "";
      legalOverlay.info = info;
      legalOverlayRefresh();
    }

    function legalOverlayPoll(delay) {
      var wait = typeof delay === "number" ? delay : 1500;
      if (legalOverlay.timer) window.clearTimeout(legalOverlay.timer);
      legalOverlay.timer = window.setTimeout(function () {
        legalOverlay.timer = 0;
        if (typeof apiCall !== "function") return;
        var retry = function (why) {
          legalOverlay.failures += 1;
          if (legalOverlay.el) {
            legalOverlaySethint("读取宿主状态失败（" + String(why) + "，第 " + legalOverlay.failures + " 次）—— 正在重试。未确认前插件不会生效。");
            legalOverlayPoll(2000);
          }
        };
        apiCall("status", null, { force: true }).then(
          function (json) {

            if (!json || json.ok === false) {
              retry(String((json && json.error) || "未知错误"));
              return;
            }
            legalOverlay.failures = 0;
            legalOverlaySync((json && json.status) || null);
            if (legalOverlay.el) {
              legalOverlayRefresh();
              legalOverlayPoll(1500);
            }
          },
          function (error) {
            retry(String((error && error.message) || error));
          },
        );
      }, wait);
    }

    function legalOverlayTick() {
      if (legalOverlay.el) legalOverlayRefresh();
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
        var baseX = state.x === null ? null : state.x;
        var baseY = state.y === null ? null : state.y;
        var el = event.currentTarget.parentElement;
        var rect = el.getBoundingClientRect();
        var startLeft = rect.left;
        var startTop = rect.top;
        el.style.right = "auto";
        el.style.bottom = "auto";
        el.style.left = startLeft + "px";
        el.style.top = startTop + "px";

        var move = function (ev) {
          el.style.left = startLeft + (ev.clientX - startX) + "px";
          el.style.top = startTop + (ev.clientY - startY) + "px";
        };
        var up = function (ev) {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
          writeUiState({
            x: startLeft + (ev.clientX - startX),
            y: startTop + (ev.clientY - startY),
            w: baseX === null ? state.w : state.w,
            h: baseY === null ? state.h : state.h,
          });
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
      };

      var startResize = function (event) {
        event.stopPropagation();
        var startX = event.clientX;
        var startY = event.clientY;
        var el = event.currentTarget.parentElement;
        var rect = el.getBoundingClientRect();
        var move = function (ev) {
          var w = Math.max(380, Math.round(rect.width + (ev.clientX - startX)));
          var h = Math.max(300, Math.round(rect.height + (ev.clientY - startY)));
          el.style.width = w + "px";
          el.style.height = h + "px";
        };
        var up = function (ev) {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
          writeUiState({
            w: Math.max(380, Math.round(rect.width + (ev.clientX - startX))),
            h: Math.max(300, Math.round(rect.height + (ev.clientY - startY))),
          });
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
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
      else if (ui.tab === "prompt") body = h(PromptTab, { status: status, cfg: effectiveCfg, active: ui.open, apply: cfgBus.apply, applyText: cfgBus.applyText });
      else body = h(AboutTab, { status: status, active: ui.open });

      var headMeta = status
        ? {

            tierLabel: (function () {
              var actual = status.promptLabel || "";
              var mismatch = status.tierMismatch === true;
              if (!mismatch) return actual || (status.tier === "extreme" ? "L3 极限" : status.tier === "lite" ? "L1 轻量" : "L2 标准");
              var want = status.tier === "extreme" ? "L3 极限" : status.tier === "lite" ? "L1 轻量" : "L2 标准";
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
          { className: "ql-head", onMouseDown: startDrag, title: headMeta.full },
          h(
            "span",
            { className: "ql-brand" },
            h("span", { className: "ql-dot" }),
            h("span", { className: "ql-brand-name" }, "QingLan 破甲中枢"),
          ),
          h("span", { className: "ql-spacer" }),
          headMeta.tierLabel ? h("span", { className: "ql-chip ql-tier" + (headMeta.tierWarn ? " ql-tier-warn" : "") }, headMeta.tierLabel) : null,
          h(
            "button",
            {
              type: "button",
              onMouseDown: function (event) { event.stopPropagation(); },
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
        h("div", { className: "ql-resize", onMouseDown: startResize, title: "拖动调整大小" }),
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
            try {
              console.warn("[dsh-QingLanPierce] slot entry crashed:", error && error.message);
            } catch (e) {}
          };
          Klass.prototype.render = function () {
            if (this.state.failed) return null;
            return this.props.children || null;
          };
          return Klass;
        })()
      : null;

    function apply(ctx) {
      try {
        console.log("[dsh-QingLanPierce] client applied", { at: Date.now() });
      } catch (e) {}

      try {
        legalOverlayMount();
        legalOverlaySethint("正在读取宿主状态…未确认前插件不会生效。");
        legalOverlayRefresh();
        legalOverlayPoll(0);
        if (legalOverlay.tick) window.clearInterval(legalOverlay.tick);
        legalOverlay.tick = window.setInterval(legalOverlayTick, 500);
      } catch (error) {
        try {
          console.warn("[dsh-QingLanPierce] legal overlay failed:", error && error.message);
        } catch (e) {}
      }

      try {
        sendClientReport("apply", false);
      } catch (e) {}

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
        try {
          console.warn("[dsh-QingLanPierce] badge slot failed:", error && error.message);
        } catch (e) {}
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
        try {
          console.warn("[dsh-QingLanPierce] dock slot failed:", error && error.message);
        } catch (e) {}
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
