@echo off
setlocal

set "NODE_DIR=C:\Program Files\nodejs"
set "NODE_EXE=%NODE_DIR%\node.exe"
set "NPM_CMD=%NODE_DIR%\npm.cmd"

if not exist "%NODE_EXE%" (
  echo Node.js was not found at "%NODE_EXE%".
  echo Install Node.js from https://nodejs.org/ and reopen your terminal.
  exit /b 1
)

if not exist "%NPM_CMD%" (
  echo npm was not found at "%NPM_CMD%".
  echo Reinstall Node.js and make sure npm is included.
  exit /b 1
)

set "PATH=%NODE_DIR%;%PATH%"

if not exist "node_modules" (
  echo Installing project dependencies...
  call "%NPM_CMD%" install
  if errorlevel 1 exit /b 1
)

call "%NPM_CMD%" run dev
