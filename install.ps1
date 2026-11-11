[CmdletBinding()]
param(
  [string]$Profile = $env:DSH_PROFILE
)

$ErrorActionPreference = 'Stop'
$PluginId = 'dsh-QingLanPierce'
$Source = $PSScriptRoot

function W($msg, $color = 'Cyan') { Write-Host $msg -ForegroundColor $color }
function Ok($msg) { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    [!] $msg" -ForegroundColor Yellow }
function Err($msg) { Write-Host "    [X] $msg" -ForegroundColor Red }

W "`n==== QingLan 破甲中枢 安装 ===="

$dshRoot = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
$profilesRoot = Join-Path $dshRoot 'profiles'

if (-not (Test-Path $profilesRoot)) { Err "找不到 $profilesRoot，请先安装并至少启动过一次 DeepSeek Harness"; exit 1 }

$profileDir = $null
if ($Profile) {
  $candidate = Join-Path $profilesRoot $Profile
  if (Test-Path (Join-Path $candidate 'package.json')) { $profileDir = $candidate }
}
if (-not $profileDir) {
  foreach ($name in @('desktop', 'web', 'default')) {
    $candidate = Join-Path $profilesRoot $name
    if (Test-Path (Join-Path $candidate 'package.json')) { $profileDir = $candidate; break }
  }
}
if (-not $profileDir) { Err "未找到可用 profile（$profilesRoot 下没有含 package.json 的目录）"; exit 1 }
$profileName = Split-Path $profileDir -Leaf
Ok "profile：$profileDir"

$pluginsDir = Join-Path $dshRoot 'plugins'
$destDir = Join-Path $pluginsDir $PluginId
New-Item -ItemType Directory -Force -Path $pluginsDir | Out-Null

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

if (Test-Path $destDir) {
  $backup = "$destDir.bak-$stamp"
  Warn "已存在旧版，备份到 $backup"
  Move-Item -LiteralPath $destDir -Destination $backup -Force
}
robocopy $Source $destDir /MIR /XD .git dist /XF *.bak-* /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { Err "复制失败（robocopy 退出码 $LASTEXITCODE）"; exit 1 }
Ok "插件已就位：$destDir"

# 记录本次安装用的 profile。卸载脚本靠它定位目标 —— 只按目录名猜会出事：
# 插件装进 web、机器上又有 desktop 时，猜出来的 desktop 会被清，真正的 web
# 依赖悬空，而插件目录照样被删，两边都不干净。
$dataDir = Join-Path $dshRoot $PluginId
New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
$installRecord = [pscustomobject]@{
  profile    = $profileName
  profileDir = $profileDir
  script     = 'install.ps1'
  at         = (Get-Date).ToUniversalTime().ToString('o')
}
[System.IO.File]::WriteAllText(
  (Join-Path $dataDir 'install-profile.json'),
  (($installRecord | ConvertTo-Json -Depth 4) + "`n"),
  (New-Object System.Text.UTF8Encoding($false))
)
Ok "已记录安装 profile：$profileName（卸载时自动读取，无需再传 -Profile）"

$pkgPath = Join-Path $profileDir 'package.json'
$patchPath = Join-Path $profileDir 'cordis.patch.yml'
Copy-Item $pkgPath "$pkgPath.bak-$stamp" -Force
if (Test-Path $patchPath) { Copy-Item $patchPath "$patchPath.bak-$stamp" -Force }
Ok "profile 配置已备份（时间戳 $stamp）"

$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
if (-not $pkg.dependencies) { $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) }
$hasDep = $false
foreach ($p in $pkg.dependencies.PSObject.Properties) { if ($p.Name -eq $PluginId) { $hasDep = $true } }
if (-not $hasDep) {
  $pkg.dependencies | Add-Member -NotePropertyName $PluginId -NotePropertyValue ('file:../../plugins/' + $PluginId) -Force
  Ok "已写入依赖 $PluginId -> file:../../plugins/$PluginId"
} else { Warn "依赖已存在，跳过" }

if ($profileName -eq 'desktop') {
  Warn "desktop profile 的 bundles 由桌面版应用自己管理，脚本不写入（写进去也会被应用覆盖）"
} else {
  $bundles = @($pkg.dsh.profile.bundles)
  if ($bundles -notcontains $PluginId) {
    $bundles += $PluginId
    $pkg.dsh.profile.bundles = $bundles
    Ok "已追加 bundle：$PluginId"
  } else { Warn "bundle 已存在，跳过" }
}

# Set-Content -Encoding UTF8 在 Windows PowerShell 5.1 会写出 BOM，而宿主的 profile
# 解析是裸 JSON.parse（不剥 BOM），带 BOM 会让 DSH 下次启动直接报 manifest 解析失败。
# 用 .NET 的 UTF8Encoding($false) 明确写无 BOM。
[System.IO.File]::WriteAllText($pkgPath, (($pkg | ConvertTo-Json -Depth 12) + "`n"), (New-Object System.Text.UTF8Encoding($false)))

W "`n文件已就位。接下来【二选一】完成装载（本脚本不调用 pnpm，避免转发器递归）："
W "  A. 打开 DeepSeek Harness → 插件管理器 → 安装/启用 $PluginId（桌面版推荐）"
W "  B. 命令行完成依赖安装："
W "       dsh plugin --profile $profileName install"
W ""
W "完成后完全退出并重启 DeepSeek Harness。"
W "卸载：$PSScriptRoot\uninstall.ps1"
