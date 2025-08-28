@echo off
echo Starting TikTok Slideshow Generator...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this script (servers will continue running)
pause
