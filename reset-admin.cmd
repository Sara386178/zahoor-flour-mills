@echo off
REM Run from repo root (e.g. C:\uni\Mill Project): fixes admin user in MongoDB.
cd /d "%~dp0backend"
if not exist "reset-admin.js" (
  echo ERROR: backend\reset-admin.js not found. Open the folder that contains the "backend" subfolder.
  pause
  exit /b 1
)
node reset-admin.js
exit /b %ERRORLEVEL%
