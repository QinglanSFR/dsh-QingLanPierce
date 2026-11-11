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

# profile 定位顺序，三级：
#   ① 显式 -Profile
#   ② 安装时写下的 install-profile.json
#   ③ desktop / web / default 里第一个可用的
# 只有 ② 能保证「装哪个卸哪个」。纯靠 ③ 的话，插件装进 web、机器上又有 desktop 时，
# 会清掉 desktop 的配置、删掉插件目录，而 web 里的依赖留下来悬空。
$profileDir = $null
$profileSource = ""

if ($Profile) {
  $candidate = Join-Path $profilesRoot $Profile
  if (Test-Path (Join-Path $candidate 'package.json')) { $profileDir = $candidate; $profileSource = "-Profile 参数" }
  else { Warn "指定的 profile「$Profile」不存在或缺少 package.json" }
}

if (-not $profileDir) {
  $recordPath = Join-Path (Join-Path $dshRoot $PluginId) 'install-profile.json'
  if (Test-Path $recordPath) {
    try {
      $recorded = [string]((Get-Content $recordPath -Raw | ConvertFrom-Json).profile)
      if ($recorded) {
        $candidate = Join-Path $profilesRoot $recorded
        if (Test-Path (Join-Path $candidate 'package.json')) {
          $profileDir = $candidate
          $profileSource = "install-profile.json"
        } else {
          Warn "安装记录里是 profile「$recorded」，但它已不存在；请用 -Profile 明确指定"
        }
      }
    } catch {
      Warn "install-profile.json 解析失败，退回自动选择"
    }
  }
}

if (-not $profileDir) {
  foreach ($name in @('desktop', 'web', 'default')) {
    $candidate = Join-Path $profilesRoot $name
    if (Test-Path (Join-Path $candidate 'package.json')) { $profileDir = Join-Path $candidate; $profileSource = "自动选择"; break }
  }
}

$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

if ($profileDir) {
  Ok "目标 profile：$profileDir（来源：$profileSource）"
  $pkgPath = Join-Path $profileDir 'package.json'
  if (Test-Path $pkgPath) {
    Copy-Item $pkgPath "$pkgPath.bak-uninstall-$stamp" -Force
    $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
    if ($pkg.dependencies) { $pkg.dependencies.PSObject.Properties.Remove($PluginId) | Out-Null }
    $bundles = @($pkg.dsh.profile.bundles) | Where-Object { $_ -ne $PluginId }
    $pkg.dsh.profile.bundles = $bundles
    # 同 install.ps1：UTF8 不带 BOM，否则宿主 JSON.parse 会失败
    [System.IO.File]::WriteAllText($pkgPath, (($pkg | ConvertTo-Json -Depth 12) + "`n"), (New-Object System.Text.UTF8Encoding($false)))
    Ok "已从 $profileDir 移除依赖与 bundle 项（备份：package.json.bak-uninstall-$stamp）"
  }
} else {
  Warn "无法定位 profile：本次不清理任何 profile 配置。"
  Warn "请用 -Profile <名称> 明确指定；若你装的是非 desktop 的 profile，插件目录删除后依赖项仍会留在那里。"
}

$destDir = Join-Path $dshRoot "plugins\$PluginId"
if (Test-Path $destDir) {
  Remove-Item -LiteralPath $destDir -Recurse -Force
  Ok "已删除插件目录：$destDir"
}

# 安装记录随插件一起清掉，否则下次装到别的 profile 时会读到过期记录
$recordPath = Join-Path (Join-Path $dshRoot $PluginId) 'install-profile.json'
if (Test-Path $recordPath) { Remove-Item -LiteralPath $recordPath -Force }

$dataDir = Join-Path $dshRoot $PluginId
if ($PurgeData -and (Test-Path $dataDir)) {
  Remove-Item -LiteralPath $dataDir -Recurse -Force
  Ok "已删除数据目录：$dataDir"
} elseif (Test-Path $dataDir) {
  Warn "用户数据保留在：$dataDir（含 config.json / audit.jsonl；要一起删加 -PurgeData）"
}

W "`n卸载完成。请完全退出并重启 DeepSeek Harness。"
