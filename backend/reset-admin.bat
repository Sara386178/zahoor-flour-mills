@echo off
REM Bypasses PowerShell npm.ps1 when execution policy blocks scripts.
cd /d "%~dp0"
node reset-admin.js
exit /b %ERRORLEVEL%
