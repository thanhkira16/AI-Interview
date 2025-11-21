# 🎭 Hệ thống Dialogues cho AI Avatar

Tôi đã tạo một hệ thống dialogues hoàn chỉnh cho model 3D với các tính năng sau:

## 📁 Files đã tạo:

### 1. `public/dialogues.json`
File JSON chứa 32+ đoạn hội thoại được phân loại theo 8 danh mục:

- **🤝 Greeting** - Chào hỏi cơ bản
- **👋 Introduction** - Giới thiệu bản thân  
- **😊 Emotions** - Thể hiện cảm xúc (vui, hứng thú, suy nghĩ, ngạc nhiên)
- **📚 Storytelling** - Kể chuyện (fantasy, sci-fi)
- **🎓 Educational** - Nội dung giáo dục (ngữ âm học, công nghệ)
- **💬 Interactive** - Tương tác với người dùng
- **🔤 Pronunciation** - Luyện tập phát âm (a, e, o, th)
- **⚙️ System** - Thông báo hệ thống

### 2. `src/components/DialoguePlayer.jsx`
Component React để:
- Hiển thị và phân loại dialogues
- Phát audio và kết nối với lipsync
- Giao diện thân thiện với thống kê

### 3. `src/components/TextToSpeech.jsx`  
Component Text-to-Speech với:
- Nhập văn bản tự do
- Chọn giọng đọc (hỗ trợ tiếng Việt)
- Điều chỉnh tốc độ, cao độ, âm lượng
- Văn bản mẫu có sẵn

### 4. `generate_audio.py`
Script Python tự động tạo file audio tiếng Việt từ văn bản:
```bash
pip install gtts
python generate_audio.py
```

## 🚀 Cách sử dụng:

### 1. Truy cập demo:
```bash
cd examples/lipsync-demo
npm run dev
```

### 2. Các tab có sẵn:
- **Visualizer** - Visualizer âm thanh cơ bản
- **3D Model** - Model 3D với lipsync  
- **Dialogues** - 📂 Trình phát dialogues có sẵn
- **Text-to-Speech** - 🎤 Nhập văn bản tự do

### 3. Sử dụng trong code:
```javascript
// Load dialogues
const response = await fetch('/dialogues.json');
const data = await response.json();

// Lấy dialogue theo category
const greetings = data.conversations.find(cat => cat.id === 'greeting');
const firstDialogue = greetings.dialogues[0];

// Phát audio với lipsync
const audio = new Audio(firstDialogue.audioFile);
lipsyncManager.connectAudio(audio);
audio.play();
```

## 📊 Thống kê:
- **32 đoạn hội thoại** được phân loại
- **8 danh mục** khác nhau
- **Metadata đầy đủ** (emotion, phoneme, duration, etc.)
- **Tương thích** với file audio có sẵn
- **Dễ mở rộng** thêm dialogues mới

## 🎯 Tính năng nổi bật:

### DialoguePlayer:
- ✅ Giao diện tabs phân loại
- ✅ Preview văn bản trước khi phát
- ✅ Hiển thị metadata (cảm xúc, phoneme, duration)
- ✅ Control phát/dừng
- ✅ Thống kê tổng quan

### TextToSpeech:
- ✅ Text-to-Speech thời gian thực
- ✅ Hỗ trợ đa ngôn ngữ 
- ✅ Điều chỉnh voice parameters
- ✅ Văn bản mẫu có sẵn
- ✅ Tích hợp lipsync

## 🔧 Customize:

### Thêm dialogue mới:
```json
{
  "id": "new_dialogue",
  "text": "Nội dung mới",
  "audioFile": "/audios/new_audio.mp3", 
  "duration": 5.0,
  "language": "vi",
  "emotion": "happy"
}
```

### Tạo audio tự động:
```python
# Thêm vào script generate_audio.py
new_texts = {
    "custom_greeting": "Chào bạn! Đây là dialogue tùy chỉnh."
}
```

## 🎬 Demo URLs:
- http://localhost:5173/ - Visualizer
- http://localhost:5173/#model - 3D Model  
- http://localhost:5173/#dialogues - Dialogues Player
- http://localhost:5173/#tts - Text-to-Speech

Bây giờ bạn có một hệ thống dialogues hoàn chỉnh để model 3D có thể "nói chuyện" một cách tự nhiên! 🎉