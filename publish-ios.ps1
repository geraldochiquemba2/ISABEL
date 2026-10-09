# YESOLA - Publicar iOS via Codemagic sem sair do PowerShell
# Uso: .\publish-ios.ps1 [-Workflow yesola-ios] [-Branch main]
param(
  [string]$Workflow = "yesola-ios",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$AppDir = Join-Path $ProjectRoot "artifacts\guia-lojas"

# 1. Token Codemagic: https://codemagic.io > User settings > Integrations > Codemagic API > Show token
$Token = $env:CM_API_TOKEN
if (-not $Token) {
  $sec = Read-Host "Cole seu Codemagic API Token (x-auth-token)" -AsSecureString
  $Token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
}
if (-not $Token) { throw "Sem token, abortando." }
$Headers = @{ "Content-Type" = "application/json"; "x-auth-token" = $Token }

# 2. Build web (vite direto, evita bug pnpm 11 + workspace)
Write-Host "== Build web ==" -ForegroundColor Cyan
Set-Location $AppDir
$env:PORT="3000"; $env:BASE_PATH="/"; $env:NODE_ENV="production"
./node_modules/.bin/vite build --config vite.config.ts
if ($LASTEXITCODE -ne 0) { throw "vite build falhou" }

# 3. Sync Capacitor
Write-Host "== cap sync ios ==" -ForegroundColor Cyan
./node_modules/.bin/cap sync ios

# 4. Commit + push (dispara Codemagic pelo push também)
Write-Host "== git push ==" -ForegroundColor Cyan
Set-Location $ProjectRoot
git add ExportOptions.plist artifacts/guia-lojas/capacitor.config.ts artifacts/guia-lojas/ios/App/Podfile
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  git commit -m "YESOLA iOS publish $((Get-Date).ToString('yyyy-MM-dd HH:mm'))"
}
git pull --rebase origin $Branch
git push origin $Branch

# 5. Descobrir AppId Codemagic
Write-Host "== apps Codemagic ==" -ForegroundColor Cyan
$apps = Invoke-RestMethod -Method Get -Uri "https://api.codemagic.io/apps" -Headers $Headers
$apps.applications | ForEach-Object { Write-Host ("- {0} | {1} | {2}" -f $_.appId, $_.appName, $_.repository.url) }
$AppId = $env:CM_APP_ID
if (-not $AppId) {
  # tenta adivinhar pelo repo ISABEL
  $match = $apps.applications | Where-Object { $_.repository.url -like "*ISABEL*" } | Select-Object -First 1
  if ($match) { $AppId = $match.appId; Write-Host "Usando AppId: $AppId ($($match.appName))" -ForegroundColor Green }
  else { $AppId = Read-Host "Cole o appId (coluna 1 acima)" }
}

# 6. Disparar build
Write-Host "== iniciar build $Workflow / $Branch ==" -ForegroundColor Cyan
$body = @{ appId = $AppId; workflowId = $Workflow; branch = $Branch } | ConvertTo-Json
$build = Invoke-RestMethod -Method Post -Uri "https://api.codemagic.io/builds" -Headers $Headers -Body $body
$buildId = $build.buildId
Write-Host "Build: $buildId" -ForegroundColor Green

# 7. Acompanhar status
while ($true) {
  Start-Sleep -Seconds 20
  $st = Invoke-RestMethod -Method Get -Uri "https://api.codemagic.io/builds/$buildId" -Headers $Headers
  Write-Host ("{0} - {1}" -f (Get-Date -Format HH:mm:ss), $st.status)
  if ($st.status -in @("finished","failed","cancelled","timeout")) {
    if ($st.status -ne "finished") { throw "Build terminou com: $($st.status)" }
    break
  }
}

# 8. Listar artefatos (.ipa)
Write-Host "== artefatos ==" -ForegroundColor Cyan
$arts = Invoke-RestMethod -Method Get -Uri "https://api.codemagic.io/builds/$buildId/artifacts" -Headers $Headers
$arts.artifacts | ForEach-Object { Write-Host ("- {0} ({1} bytes)" -f $_.name, $_.size) }
$ipa = $arts.artifacts | Where-Object { $_.name -like "*.ipa" } | Select-Object -First 1
if ($ipa) {
  $out = Join-Path $ProjectRoot ($ipa.name | Split-Path -Leaf)
  Write-Host "Baixando IPA para $out" -ForegroundColor Cyan
  Invoke-WebRequest -Uri $ipa.url -OutFile $out -Headers $Headers
  Write-Host "Pronto: $out" -ForegroundColor Green
  Write-Host "Suba em App Store Connect > Yesola > 1.0 > Compilacao via Transporter ou ative submit_to_app_store no codemagic.yaml"
} else {
  Write-Host "Nenhum .ipa nos artefatos, veja no dashboard Codemagic." -ForegroundColor Yellow
}
