@echo off
setlocal
cd /d "%~dp0"
echo ===============================================
echo       MyOffice One - Windows 11 Installer
echo ===============================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo Please install FREE Node.js LTS from https://nodejs.org/
  echo Then double-click this file again.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo npm not found. Reinstall Node.js LTS.
  pause
  exit /b 1
)
echo [1/3] Downloading free desktop build dependencies...
call npm ci --no-audit --no-fund
if errorlevel 1 (echo Dependency download failed. Check internet.&pause&exit /b 1)
echo [2/3] Checking JavaScript syntax and spreadsheet smoke test...
call npm test
if errorlevel 1 (echo Tests failed. Installer not created.&pause&exit /b 1)
echo [3/3] Building MyOffice One Setup EXE...
call npm run installer-win
if errorlevel 1 (echo Installer build failed. See error above.&pause&exit /b 1)
echo.
echo SUCCESS: Open dist-installer\ and double-click MyOffice-One-Setup-0.4.0-x64.exe
echo The installer will request administrator permission to register Open with options.
echo.
explorer "%~dp0dist-installer"
pause
