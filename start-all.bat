@echo off
start "API Server" powershell -ExecutionPolicy Bypass -File "C:\Users\geral\Desktop\ISABEL LOJA\start-api.ps1"
start "Frontend" powershell -ExecutionPolicy Bypass -File "C:\Users\geral\Desktop\ISABEL LOJA\start-frontend.ps1"
echo.
echo ============================================
echo   Frontend: http://localhost:3000
echo   API:      http://localhost:5000
echo ============================================
echo.
echo Servers started! Close this window to stop.
pause
