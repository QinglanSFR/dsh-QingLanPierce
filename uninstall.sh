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

PROFILE_DIR=""
if [ -n "${DSH_PROFILE:-}" ] && [ -f "$PROFILES_ROOT/$DSH_PROFILE/package.json" ]; then
  PROFILE_DIR="$PROFILES_ROOT/$DSH_PROFILE"
fi
if [ -z "$PROFILE_DIR" ]; then
  for name in desktop web default; do
    if [ -f "$PROFILES_ROOT/$name/package.json" ]; then PROFILE_DIR="$PROFILES_ROOT/$name"; break; fi
  done
fi

STAMP="$(date +%Y%m%d-%H%M%S)"

if [ -n "$PROFILE_DIR" ] && [ -f "$PROFILE_DIR/package.json" ]; then
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
fi

DEST_DIR="$DSH_ROOT/plugins/$PLUGIN_ID"
if [ -d "$DEST_DIR" ]; then
  rm -rf "$DEST_DIR"
  ok "已删除插件目录：$DEST_DIR"
fi

DATA_DIR="$DSH_ROOT/$PLUGIN_ID"
if [ "$PURGE" = "1" ] && [ -d "$DATA_DIR" ]; then
  rm -rf "$DATA_DIR"
  ok "已删除数据目录：$DATA_DIR"
elif [ -d "$DATA_DIR" ]; then
  warn "用户数据保留在：$DATA_DIR（含 config.json / audit.jsonl；要一起删加 --purge-data）"
fi

say ""
say "卸载完成。请完全退出并重启 DeepSeek Harness。"
