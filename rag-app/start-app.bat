@echo off
REM ============================================================
REM  Bat server giao dien RAG  ->  http://localhost:8000
REM  Cu de cua so nay MO trong khi day. Dong cua so = tat server.
REM ============================================================
cd /d "%~dp0"
set PYTHONUTF8=1

echo [1/2] Bat 3 database + UI (Docker)...
docker compose up -d

echo [2/2] Bat server giao dien (uvicorn)...
echo Mo trinh duyet: http://localhost:8000
call .venv\Scripts\activate.bat
python -m uvicorn src.main:app --host 127.0.0.1 --port 8000
