# ============================================================
# start-local.ps1 - Inicia o servidor API e o frontend Vite
# ============================================================

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$apiDir = Join-Path $root "artifacts\api-server"
$frontendDir = Join-Path $root "artifacts\guia-lojas"
$envFile = Join-Path $frontendDir ".env"

# Lê o .env do frontend e carrega as variáveis
Write-Host "A carregar variaveis de ambiente de $envFile..." -ForegroundColor Cyan
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, "Process")
        Write-Host "  $name carregado" -ForegroundColor DarkGray
    }
}

# ---- Inicia API Server (porta 5000) -------------------------
Write-Host "`nA iniciar API Server na porta 5000..." -ForegroundColor Green
$apiJob = Start-Job -ScriptBlock {
    param($dir, $dbUrl, $telegramToken, $telegramChatId)
    $env:SERVER_PORT = "5000"
    $env:DATABASE_URL = $dbUrl
    $env:TELEGRAM_BOT_TOKEN = $telegramToken
    $env:TELEGRAM_CHAT_ID = $telegramChatId
    Set-Location $dir
    pnpm exec tsx server/index.ts
} -ArgumentList $frontendDir, $env:DATABASE_URL, $env:TELEGRAM_BOT_TOKEN, $env:TELEGRAM_CHAT_ID

Write-Host "API Server job iniciado (ID: $($apiJob.Id))" -ForegroundColor Green

# Aguarda 4 segundos para o servidor API iniciar
Write-Host "A aguardar que o servidor API arranque..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

# ---- Inicia Frontend Vite (porta 3000) ----------------------
Write-Host "`nA iniciar Frontend Vite na porta 3000..." -ForegroundColor Green
$frontendJob = Start-Job -ScriptBlock {
    param($dir, $dbUrl, $telegramToken, $telegramChatId)
    $env:PORT = "3000"
    $env:BASE_PATH = "/"
    $env:NODE_ENV = "development"
    $env:DATABASE_URL = $dbUrl
    $env:TELEGRAM_BOT_TOKEN = $telegramToken
    $env:TELEGRAM_CHAT_ID = $telegramChatId
    Set-Location $dir
    pnpm run dev
} -ArgumentList $frontendDir, $env:DATABASE_URL, $env:TELEGRAM_BOT_TOKEN, $env:TELEGRAM_CHAT_ID

Write-Host "Frontend job iniciado (ID: $($frontendJob.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  API:      http://localhost:5000" -ForegroundColor White
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "A mostrar logs (Ctrl+C para parar)..." -ForegroundColor Yellow
Write-Host ""

# Stream logs de ambos os jobs
try {
    while ($true) {
        $apiOutput = Receive-Job -Job $apiJob
        if ($apiOutput) {
            $apiOutput | ForEach-Object { Write-Host "[API] $_" -ForegroundColor DarkCyan }
        }

        $frontendOutput = Receive-Job -Job $frontendJob
        if ($frontendOutput) {
            $frontendOutput | ForEach-Object { Write-Host "[VITE] $_" -ForegroundColor DarkGreen }
        }

        # Verifica se algum job falhou
        if ($apiJob.State -eq "Failed") {
            Write-Host "[API] Job falhou!" -ForegroundColor Red
            Receive-Job -Job $apiJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[API ERROR] $_" -ForegroundColor Red }
        }
        if ($frontendJob.State -eq "Failed") {
            Write-Host "[VITE] Job falhou!" -ForegroundColor Red
            Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue | ForEach-Object { Write-Host "[VITE ERROR] $_" -ForegroundColor Red }
        }

        Start-Sleep -Milliseconds 500
    }
} finally {
    Write-Host "`nA parar servidores..." -ForegroundColor Yellow
    Stop-Job -Job $apiJob, $frontendJob
    Remove-Job -Job $apiJob, $frontendJob
    Write-Host "Servidores parados." -ForegroundColor Green
}
