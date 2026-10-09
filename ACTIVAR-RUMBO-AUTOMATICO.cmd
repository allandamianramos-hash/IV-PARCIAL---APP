@echo off
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\iniciar-proyecto.ps1" -Install -Open
if errorlevel 1 pause
