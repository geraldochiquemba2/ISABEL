# start-frontend.ps1 - Inicia o frontend local (lê segredos do .env NÃO versionado)
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
$env:PORT = "3000"
$env:BASE_PATH = "/"
$env:NODE_ENV = "development"
Set-Location (Join-Path $PSScriptRoot "artifacts\guia-lojas")
pnpm run dev
