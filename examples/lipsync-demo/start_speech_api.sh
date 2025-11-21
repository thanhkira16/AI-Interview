#!/bin/bash

# Start Speech-to-Text API Server
# Chạy server Flask để xử lý Speech-to-Text

echo "🚀 Khởi động Speech-to-Text API Server..."
echo "📍 Port: 5000"
echo "🌐 CORS enabled cho React frontend"
echo ""

# Kiểm tra Python environment
if [[ -f "../../../.venv/Scripts/python.exe" ]]; then
    PYTHON_CMD="../../../.venv/Scripts/python.exe"
    echo "✅ Sử dụng virtual environment"
elif command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    echo "✅ Sử dụng python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    echo "✅ Sử dụng python"
else
    echo "❌ Không tìm thấy Python. Vui lòng cài đặt Python."
    exit 1
fi

echo "🐍 Python: $PYTHON_CMD"

# Kiểm tra .env file
if [[ -f ".env" ]]; then
    echo "✅ Tìm thấy file .env"
    if grep -q "GOOGLE_APPLICATION_CREDENTIALS" .env; then
        echo "✅ Tìm thấy GOOGLE_APPLICATION_CREDENTIALS trong .env"
    else
        echo "⚠️  Chưa cấu hình GOOGLE_APPLICATION_CREDENTIALS trong .env"
        echo "   Hãy thêm dòng: GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json"
    fi
else
    echo "⚠️  Không tìm thấy file .env"
fi

echo ""
echo "📋 Endpoints sẽ có sẵn:"
echo "   GET  http://localhost:5000/health - Kiểm tra trạng thái server"
echo "   POST http://localhost:5000/transcribe - Upload và transcribe file audio"
echo "   POST http://localhost:5000/transcribe-blob - Transcribe audio blob từ frontend"
echo ""
echo "🔄 Để dừng server, nhấn Ctrl+C"
echo ""

# Khởi động server
$PYTHON_CMD speech_api.py