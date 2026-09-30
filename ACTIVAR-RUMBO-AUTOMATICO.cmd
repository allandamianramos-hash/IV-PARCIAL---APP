@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0rumbo-background.ps1" -Install -Open
if errorlevel 1 pause
