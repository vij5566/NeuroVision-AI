# NeuroVision AI - PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "            Starting NeuroVision AI                " -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Backend
Write-Host "`n[1/2] Starting FastAPI Backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\backend'; .\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000"

# Start Frontend
Write-Host "[2/2] Starting React Frontend on http://localhost:5173 ..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir\frontend'; npm.cmd run dev"

Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host "  Services launched successfully!" -ForegroundColor Yellow
Write-Host "  - Frontend:         http://localhost:5173" -ForegroundColor White
Write-Host "  - Backend API:      http://localhost:8000" -ForegroundColor White
Write-Host "  - API Swagger Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
