@echo off
cd /d "%~dp0"
if not exist .env copy .env.example .env >nul & notepad .env
if not exist node_modules call npm install
start "" http://localhost:8080
node server.js
pause
