#!/usr/bin/env bash

set -euo pipefail

PLUGIN_ID="dsh-QingLanPierce"
PURGE=0
for arg in "$@"; do
  case "$arg" in
    --purge-data) PURGE=1 ;;
    *) printf '未知参数：%s\n' "$arg" >&2; exit 2 ;;
  esac
done

say()  { printf '%s\n' "$*"; }
ok()   { printf '    [OK] %s\n' "$*"; }
warn() { printf '    [!] %s\n' "$*"; }

say ""
say "==== QingLan 破甲中枢 卸载 ===="

DSH_ROOT="${DSH_HOME:-$HOME/.dsh}"
PROFILES_ROOT="$DSH_ROOT/profiles"

# profile 定位顺序，三级：
#   ① DSH_PROFILE 环境变量
#   ② 安装时写下的 install-profile.json
#   ③ desktop / web / default 里第一个可用的
# 只有 ② 能保证「装哪个卸哪个」。纯靠 ③ 的话，插件装进 web、机器上又有 desktop 时，
# 会清掉 desktop 的配置、删掉插件目录，而 web 里的依赖留下来悬空。
PROFILE_DIR=""
PROFILE_SOURCE=""

if [ -n "${DSH_PROFILE:-}" ] && [ -f "$PROFILES_ROOT/$DSH_PROFILE/package.json" ]; then
  PROFILE_DIR="$PROFILES_ROOT/$DSH_PROFILE"
  PROFILE_SOURCE="DSH_PROFILE 环境变量"
fi

RECORD="$DSH_ROOT/$PLUGIN_ID/install-profile.json"
if [ -z "$PROFILE_DIR" ] && [ -f "$RECORD" ]; then
  RECORDED="$(node -e 'try{process.stdout.write(String(require(process.argv[1]).profile||""))}catch(e){}' "$RECORD" 2>/dev/null || true)"
  if [ -n "$RECORDED" ]; then
    if [ -f "$PROFILES_ROOT/$RECORDED/package.json" ]; then
      PROFILE_DIR="$PROFILES_ROOT/$RECORDED"
      PROFILE_SOURCE="install-profile.json"
    else
      warn "安装记录里是 profile「$RECORDED」，但它已不存在；请用 DSH_PROFILE 明确指定"
    fi
  fi
fi

if [ -z "$PROFILE_DIR" ]; then
  for name in desktop web default; do
    if [ -f "$PROFILES_ROOT/$name/package.json" ]; then
      PROFILE_DIR="$PROFILES_ROOT/$name"
      PROFILE_SOURCE="自动选择"
      break
    fi
  done
fi

STAMP="$(date +%Y%m%d-%H%M%S)"

if [ -n "$PROFILE_DIR" ] && [ -f "$PROFILE_DIR/package.json" ]; then
  say "    目标 profile：$PROFILE_DIR（来源：$PROFILE_SOURCE）"
  cp "$PROFILE_DIR/package.json" "$PROFILE_DIR/package.json.bak-uninstall-$STAMP"
  node - "$PROFILE_DIR/package.json" "$PLUGIN_ID" <<'NODE'
const fs = require("node:fs");
const [pkgPath, id] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
if (pkg.dependencies && pkg.dependencies[id]) {
  delete pkg.dependencies[id];
  console.log(`    [OK] 已移除依赖 ${id}`);
}
const bundles = pkg.dsh?.profile?.bundles;
if (Array.isArray(bundles) && bundles.includes(id)) {
  pkg.dsh.profile.bundles = bundles.filter((name) => name !== id);
  console.log(`    [OK] 已移除 bundle 项`);
}
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
NODE
  ok "profile 已清理（备份：package.json.bak-uninstall-$STAMP）"
else
  warn "无法定位 profile：本次不清理任何 profile 配置。"
  warn "请设 DSH_PROFILE=<名称> 后重跑；若你装的是非 desktop 的 profile，插件目录删除后依赖项仍会留在那里。"
fi

DEST_DIR="$DSH_ROOT/plugins/$PLUGIN_ID"
if [ -d "$DEST_DIR" ]; then
  rm -rf "$DEST_DIR"
  ok "已删除插件目录：$DEST_DIR"
fi

# 安装记录随插件一起清掉，否则下次装到别的 profile 时会读到过期记录
[ -f "$RECORD" ] && rm -f "$RECORD"

DATA_DIR="$DSH_ROOT/$PLUGIN_ID"
if [ "$PURGE" = "1" ] && [ -d "$DATA_DIR" ]; then
  rm -rf "$DATA_DIR"
  ok "已删除数据目录：$DATA_DIR"
elif [ -d "$DATA_DIR" ]; then
  warn "用户数据保留在：$DATA_DIR（含 config.json / audit.jsonl；要一起删加 --purge-data）"
fi

say ""
say "卸载完成。请完全退出并重启 DeepSeek Harness。"
