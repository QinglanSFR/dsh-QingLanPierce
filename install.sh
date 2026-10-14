#!/usr/bin/env bash
set -euo pipefail

PLUGIN_ID="dsh-QingLanPierce"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

say()  { printf '%s\n' "$*"; }
ok()   { printf '    [OK] %s\n' "$*"; }
warn() { printf '    [!] %s\n' "$*"; }
die()  { printf '    [X] %s\n' "$*" >&2; exit 1; }

case "$(uname -s 2>/dev/null || echo unknown)" in
  MINGW*|MSYS*|CYGWIN*)
    printf '    [X] 检测到 Windows 的 Git Bash / MSYS / Cygwin 环境。\n' >&2
    printf '        本机 pnpm 是转发器脚本，从 POSIX shell 调用会无限递归（曾造成数千进程）。\n' >&2
    printf '        Windows 请改用 PowerShell 脚本：   .\\install.ps1\n' >&2
    exit 2
    ;;
esac

if [ "${SHLVL:-0}" -gt 40 ] 2>/dev/null; then
  die "shell 嵌套层级异常（SHLVL=${SHLVL}），为避免递归风暴雨中止。请在新开的终端里重试。"
fi

say ""
say "==== QingLan 破甲中枢 安装 ===="

DSH_ROOT="${DSH_HOME:-$HOME/.dsh}"
PROFILES_ROOT="$DSH_ROOT/profiles"
[ -d "$PROFILES_ROOT" ] || die "找不到 $PROFILES_ROOT —— 请先安装并至少启动过一次 DeepSeek Harness"

PROFILE_DIR=""
if [ -n "${DSH_PROFILE:-}" ] && [ -f "$PROFILES_ROOT/$DSH_PROFILE/package.json" ]; then
  PROFILE_DIR="$PROFILES_ROOT/$DSH_PROFILE"
fi
if [ -z "$PROFILE_DIR" ]; then
  for name in desktop web default; do
    if [ -f "$PROFILES_ROOT/$name/package.json" ]; then PROFILE_DIR="$PROFILES_ROOT/$name"; break; fi
  done
fi
[ -n "$PROFILE_DIR" ] || die "未找到可用 profile（$PROFILES_ROOT 下没有含 package.json 的目录）"
PROFILE_NAME="$(basename "$PROFILE_DIR")"
ok "profile：$PROFILE_DIR"

PLUGINS_DIR="$DSH_ROOT/plugins"
DEST_DIR="$PLUGINS_DIR/$PLUGIN_ID"
mkdir -p "$PLUGINS_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"

if [ -d "$DEST_DIR" ]; then
  warn "已存在旧版，备份到 $DEST_DIR.bak-$STAMP"
  mv "$DEST_DIR" "$DEST_DIR.bak-$STAMP"
fi
mkdir -p "$DEST_DIR"
( cd "$SOURCE_DIR" && tar --exclude='.git' --exclude='*.bak-*' --exclude='dist' -cf - . ) | ( cd "$DEST_DIR" && tar -xf - )
ok "插件已就位：$DEST_DIR"

PKG="$PROFILE_DIR/package.json"
PATCH="$PROFILE_DIR/cordis.patch.yml"
cp "$PKG" "$PKG.bak-$STAMP"
[ -f "$PATCH" ] && cp "$PATCH" "$PATCH.bak-$STAMP"
ok "profile 配置已备份（时间戳 $STAMP）"

node - "$PKG" "$PLUGIN_ID" "$PROFILE_NAME" <<'NODE'
const fs = require("node:fs");
const [pkgPath, id, profile] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.dependencies = pkg.dependencies || {};
if (!pkg.dependencies[id]) {
  pkg.dependencies[id] = `file:../../plugins/${id}`;
  console.log(`    [OK] 已写入依赖 ${id} -> file:../../plugins/${id}`);
} else {
  console.log("    [!] 依赖已存在，跳过");
}
if (profile === "desktop") {
  console.log("    [!] desktop profile 的 bundles 由桌面版应用自己管理，脚本不写入（写进去也会被应用覆盖）");
} else {
  pkg.dsh = pkg.dsh || {};
  pkg.dsh.profile = pkg.dsh.profile || {};
  const bundles = Array.isArray(pkg.dsh.profile.bundles) ? pkg.dsh.profile.bundles : (pkg.dsh.profile.bundles = []);
  if (!bundles.includes(id)) {
    bundles.push(id);
    console.log(`    [OK] 已追加 bundle：${id}`);
  } else {
    console.log("    [!] bundle 已存在，跳过");
  }
}
fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
NODE

say ""
say "文件已就位。接下来【二选一】完成装载（本脚本不调用 pnpm，避免转发器递归）："
say "  A. 打开 DeepSeek Harness → 插件管理器 → 安装/启用 dsh-QingLanPierce（桌面版推荐）"
say "  B. 命令行完成依赖安装（不要用 Git Bash；PowerShell / macOS / Linux 终端均可）："
say "       dsh plugin --profile $PROFILE_NAME install"
say ""
say "完成后完全退出并重启 DeepSeek Harness。首次启动会先弹出免责协议（20 秒后按钮可点）。"
say "卸载：$SOURCE_DIR/uninstall.sh"
