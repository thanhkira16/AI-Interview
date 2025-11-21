# 🎤 Speech-to-Text & Text-to-Speech Integration

Tính năng ghi âm giọng nói và chuyển đổi sang văn bản sử dụng Google Cloud Speech-to-Text API, tích hợp với Text-to-Speech và lipsync.

## 🚀 Cài đặt

### 1. Cài đặt dependencies Python

```bash
# Từ thư mục lipsync-demo
pip install google-cloud-speech python-dotenv flask flask-cors
```

### 2. Cấu hình Google Cloud Speech-to-Text

#### Bước 1: Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Speech-to-Text API:
   - Vào **APIs & Services** > **Library**
   - Tìm "Speech-to-Text API" và click **Enable**

#### Bước 2: Tạo Service Account
1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **Service Account**
3. Điền thông tin và tạo service account
4. Click vào service account vừa tạo
5. Vào tab **Keys** > **Add Key** > **Create New Key**
6. Chọn format **JSON** và download file

#### Bước 3: Cấu hình credentials
Thêm vào file `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

## 🎯 Sử dụng

### 1. Khởi động API Server

**Windows:**
```cmd
start_speech_api.bat
```

**Linux/Mac:**
```bash
./start_speech_api.sh
```

**Hoặc chạy trực tiếp:**
```bash
python speech_api.py
```

Server sẽ chạy trên `http://localhost:5000`

### 2. Sử dụng trong React App

1. Khởi động React development server:
   ```bash
   npm run dev
   ```

2. Truy cập ứng dụng và sử dụng component Speech-to-Text

## 🎤 Tính năng

### Speech-to-Text
- **Ghi âm giọng nói**: Click "Bắt đầu ghi âm" để ghi lại giọng nói
- **Đa ngôn ngữ**: Hỗ trợ tiếng Việt, tiếng Anh và nhiều ngôn ngữ khác
- **Chất lượng cao**: Sử dụng Google Cloud Speech-to-Text API
- **Thời gian thực**: Hiển thị kết quả ngay sau khi ghi xong
- **Tự động điền**: Tùy chọn tự động điền kết quả vào ô văn bản

### Text-to-Speech
- **Giọng nói tự nhiên**: Sử dụng Speech Synthesis API của trình duyệt
- **Đồng bộ môi**: Fake lipsync thông minh dựa trên nội dung văn bản
- **Điều chỉnh giọng**: Tốc độ, cao độ, âm lượng có thể tùy chỉnh
- **Đa giọng**: Hỗ trợ nhiều giọng đọc khác nhau

### Lipsync Integration
- **Phân tích văn bản**: Tạo chuỗi viseme dựa trên nội dung
- **Đồng bộ thời gian**: Chuyển động môi theo từng từ
- **Model 3D**: Tích hợp với avatar 3D sử dụng wawa-lipsync

## 🔧 API Endpoints

### GET `/health`
Kiểm tra trạng thái server và Google Cloud credentials
```bash
curl http://localhost:5000/health
```

### POST `/transcribe`
Upload và transcribe file audio
```bash
curl -X POST -F "audio=@audio.wav" -F "language=vi-VN" http://localhost:5000/transcribe
```

### POST `/transcribe-blob`
Transcribe audio blob từ frontend recording
```json
{
  "audioData": "data:audio/webm;base64,GkXfo...",
  "language": "vi-VN",
  "sampleRate": 16000
}
```

## 🌐 Ngôn ngữ hỗ trợ

- **Tiếng Việt**: `vi-VN`
- **English (US)**: `en-US`
- **English (UK)**: `en-GB`
- **中文 (简体)**: `zh-CN`
- **日本語**: `ja-JP`
- **한국어**: `ko-KR`
- **Français**: `fr-FR`
- **Deutsch**: `de-DE`
- **Español**: `es-ES`

## 🎯 Mẹo sử dụng

### Để có kết quả tốt nhất:
1. **Audio chất lượng**:
   - Nói rõ ràng và với tốc độ vừa phải
   - Giảm tiếng ồn xung quanh
   - Đặt microphone gần miệng (10-15cm)

2. **Chọn ngôn ngữ phù hợp**:
   - Đặt ngôn ngữ nhận dạng phù hợp với nội dung bạn nói
   - Sử dụng `vi-VN` cho tiếng Việt
   - Sử dụng `en-US` cho tiếng Anh

3. **Môi trường ghi âm**:
   - Không gian yên tĩnh
   - Tránh echo và tiếng vang
   - Đảm bảo kết nối internet ổn định

## 🔍 Debug và Troubleshooting

### Lỗi thường gặp:

1. **API Server Offline**
   ```
   ❌ API Server Offline
   ```
   **Giải pháp**: Chạy `python speech_api.py` để khởi động server

2. **No Credentials**
   ```
   ⚠️ API Server Online (No Credentials)
   ```
   **Giải pháp**: Cấu hình `GOOGLE_APPLICATION_CREDENTIALS` trong `.env`

3. **Microphone Access Denied**
   ```
   Không thể truy cập microphone
   ```
   **Giải pháp**: Cho phép trình duyệt sử dụng microphone

4. **CORS Error**
   ```
   Access-Control-Allow-Origin error
   ```
   **Giải pháp**: Đảm bảo Flask server đang chạy với CORS enabled

### Kiểm tra logs:
- **Frontend**: Mở Developer Tools (F12) > Console
- **Backend**: Xem terminal chạy `speech_api.py`

## 💰 Chi phí

### Google Cloud Speech-to-Text (tham khảo 2024):
- **Free tier**: 60 phút/tháng
- **Standard**: $0.024/phút
- **Enhanced**: $0.048/phút

**Lưu ý**: Theo dõi usage trong Google Cloud Console để tránh chi phí ngoài ý muốn.

## 📁 Cấu trúc file

```
lipsync-demo/
├── speech_api.py              # Flask API server
├── speech_to_text.py         # Core Speech-to-Text functions  
├── start_speech_api.bat      # Windows startup script
├── start_speech_api.sh       # Linux/Mac startup script
├── .env                      # Environment variables
├── requirements.txt          # Python dependencies
└── src/
    └── components/
        └── TextToSpeech.jsx  # React component với STT integration
```

## 🔗 Tài liệu tham khảo

- [Google Cloud Speech-to-Text Documentation](https://cloud.google.com/speech-to-text/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [WAWA Lipsync Library](https://github.com/wawa-lipsync/wawa-lipsync)

---

## 🎉 Demo Flow

1. **Ghi âm**: Click "Bắt đầu ghi âm" → Nói vào microphone
2. **Transcribe**: Dừng ghi âm → Xem kết quả chuyển đổi 
3. **Sử dụng**: Click "Sử dụng văn bản này" để điền vào ô text
4. **Text-to-Speech**: Click "Đọc văn bản" để phát âm với lipsync
5. **Avatar**: Xem avatar 3D đồng bộ chuyển động môi

Chúc bạn có trải nghiệm thú vị với tính năng Speech-to-Text! 🚀