@echo off
REM Start Speech-to-Text API Server (Windows batch file)

echo 🚀 Khoi dong Speech-to-Text API Server...
echo 📍 Port: 5000
echo 🌐 CORS enabled cho React frontend
echo.

REM Kiem tra Python environment
if exist "D:\Mirabo\HireTab\wawa-lipsync\.venv\Scripts\python.exe" (
    set PYTHON_CMD=D:\Mirabo\HireTab\wawa-lipsync\.venv\Scripts\python.exe
    echo ✅ Su dung virtual environment
) else if exist "python" (
    set PYTHON_CMD=python
    echo ✅ Su dung python
) else (
    echo ❌ Khong tim thay Python. Vui long cai dat Python.
    pause
    exit /b 1
)

echo 🐍 Python: %PYTHON_CMD%

REM Kiem tra .env file
if exist ".env" (
    echo ✅ Tim thay file .env
    findstr "GOOGLE_APPLICATION_CREDENTIALS" .env >nul
    if errorlevel 1 (
        echo ⚠️ Chua cau hinh GOOGLE_APPLICATION_CREDENTIALS trong .env
        echo    Hay them dong: GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
    ) else (
        echo ✅ Tim thay GOOGLE_APPLICATION_CREDENTIALS trong .env
    )
) else (
    echo ⚠️ Khong tim thay file .env
)

echo.
echo 📋 Endpoints se co san:
echo    GET  http://localhost:5000/health - Kiem tra trang thai server
echo    POST http://localhost:5000/transcribe - Upload va transcribe file audio
echo    POST http://localhost:5000/transcribe-blob - Transcribe audio blob tu frontend
echo.
echo 🔄 De dung server, nhan Ctrl+C
echo.

REM Khoi dong server
%PYTHON_CMD% speech_api.py

pause