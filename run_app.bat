@echo off
title NeuroVision AI Launcher
echo ===================================================
echo             Starting NeuroVision AI
echo ===================================================
echo.

:: Start FastAPI Backend in a separate window
echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "NeuroVision AI Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Start React Frontend in a separate window
echo [2/2] Starting React Frontend on http://localhost:5173 ...
start "NeuroVision AI Frontend" cmd /k "cd /d %~dp0frontend && npm.cmd run dev"

echo.
echo ===================================================
echo  Services launched!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:8000
echo  - API Swagger Docs: http://localhost:8000/docs
echo ===================================================
echo.
pause
