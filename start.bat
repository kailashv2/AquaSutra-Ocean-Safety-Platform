@echo off
echo.
echo ========================================
echo   AquaSutra Ocean Safety Platform
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting AquaSutra server...
echo.
echo Server will be available at:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
node server.js
pause
