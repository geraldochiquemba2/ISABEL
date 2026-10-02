# start-api.ps1 - Inicia a API local (lê segredos do .env NÃO versionado)
$envFile = Join-Path $PSScriptRoot "artifacts\guia-lojas\.env"
if (-not (Test-Path -LiteralPath $envFile)) {
  Write-Error "Ficheiro .env não encontrado em $envFile. Crie-o localmente com DATABASE_URL, TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID."
  exit 1
}
Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
    [System.Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
  }
}
$env:SERVER_PORT = "5000"
Set-Location (Join-Path $PSScriptRoot "artifacts\guia-lojas")
pnpm exec tsx server/index.ts
