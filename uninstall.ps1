[CmdletBinding()]
param(
  [string]$Profile = $env:DSH_PROFILE,
  [switch]$PurgeData
)

$ErrorActionPreference = 'Continue'
$PluginId = 'dsh-QingLanPierce'

function W($msg, $color = 'Cyan') { Write-Host $msg -ForegroundColor $color }
function Ok($msg) { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "    [!] $msg" -ForegroundColor Yellow }

W "`n==== QingLan 破甲中枢 卸载 ===="

$dshRoot = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $env:USERPROFILE '.dsh' }
$profilesRoot = Join-Path $dshRoot 'profiles'

$profileDir = $null
if ($Profile -and (Test-Path (Join-Path $profilesRoot "$Profile\package.json"))) { $profileDir = Join-Path $profilesRoot $Profile }
if (-not $profileDir) {
  foreach ($name in @('desktop', 'web', 'default')) {
    $candidate = Join-Path $profilesRoot $name
    if (Test-Path (Join-Path $candidate 'package.json')) { $profileDir = Join-Path $candidate; break }
  }
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

if ($profileDir) {
  $pkgPath = Join-Path $profileDir 'package.json'
  if (Test-Path $pkgPath) {
    Copy-Item $pkgPath "$pkgPath.bak-uninstall-$stamp" -Force
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
    if ($pkg.dependencies) { $pkg.dependencies.PSObject.Properties.Remove($PluginId) | Out-Null }
    $bundles = @($pkg.dsh.profile.bundles) | Where-Object { $_ -ne $PluginId }
    $pkg.dsh.profile.bundles = $bundles
    $pkg | ConvertTo-Json -Depth 12 | Set-Content -Path $pkgPath -Encoding UTF8
    Ok "已从 $profileDir 移除依赖与 bundle 项（备份：package.json.bak-uninstall-$stamp）"
  }
}

$destDir = Join-Path $dshRoot "plugins\$PluginId"
if (Test-Path $destDir) {
  Remove-Item -LiteralPath $destDir -Recurse -Force
  Ok "已删除插件目录：$destDir"
}

$dataDir = Join-Path $dshRoot $PluginId
if ($PurgeData -and (Test-Path $dataDir)) {
  Remove-Item -LiteralPath $dataDir -Recurse -Force
  Ok "已删除数据目录：$dataDir"
} elseif (Test-Path $dataDir) {
  Warn "用户数据保留在：$dataDir（含 config.json / audit.jsonl；要一起删加 -PurgeData）"
}

W "`n卸载完成。请完全退出并重启 DeepSeek Harness。"
