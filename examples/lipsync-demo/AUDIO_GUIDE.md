# Hướng dẫn tạo file audio cho đoạn hội thoại

## Các công cụ Text-to-Speech miễn phí:

### 1. Online TTS Tools:
- **Google Translate**: Nhập văn bản tiếng Việt → Nhấn icon loa để nghe → Dùng browser dev tools để download
- **ResponsiveVoice**: https://responsivevoice.org/text-to-speech-languages/
- **TTSMaker**: https://ttsmaker.com/
- **Natural Reader**: https://www.naturalreaders.com/

### 2. AI Voice Services:
- **ElevenLabs**: https://elevenlabs.io/ (có Vietnamese voices)
- **OpenAI TTS**: https://platform.openai.com/docs/guides/text-to-speech
- **Azure Cognitive Services**: https://azure.microsoft.com/en-us/products/ai-services/text-to-speech

### 3. Offline Tools:
- **eSpeak**: Miễn phí, hỗ trợ tiếng Việt
- **Festival**: Text-to-speech synthesis system
- **pico2wave**: Lightweight TTS

## Script tạo audio tự động:

```javascript
// Sử dụng Web Speech API (chỉ hoạt động trên browser)
function generateAudio(text, filename) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  
  // Tìm voice tiếng Việt
  const voices = speechSynthesis.getVoices();
  const vietnameseVoice = voices.find(voice => voice.lang.includes('vi'));
  if (vietnameseVoice) {
    utterance.voice = vietnameseVoice;
  }
  
  speechSynthesis.speak(utterance);
}
```

## Python script với gTTS:

```python
from gtts import gTTS
import os

dialogues = {
    "greeting_hello": "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp gì cho bạn hôm nay?",
    "greeting_morning": "Chào buổi sáng! Hy vọng bạn đã có một đêm ngon giấc.",
    "introduction_self": "Tôi là một AI avatar có khả năng đồng bộ môi với giọng nói.",
    "emotion_happy": "Tôi cảm thấy rất vui mừng khi được nói chuyện với bạn!",
    "story_wizard": "Ngày xửa ngày xưa, có một pháp sư trẻ tuổi tên là Wizard."
}

for key, text in dialogues.items():
    tts = gTTS(text=text, lang='vi', slow=False)
    filename = f"vietnamese_{key}.mp3"
    tts.save(f"public/audios/{filename}")
    print(f"Created: {filename}")
```

## Cài đặt và chạy script:

```bash
pip install gtts
python generate_audio.py
```

## Lưu ý:
1. File audio nên có độ dài 2-10 giây để phù hợp với lipsync
2. Chất lượng audio tốt sẽ cho kết quả viseme chính xác hơn
3. Tần số sample rate khuyến nghị: 44.1kHz
4. Format: MP3 hoặc WAV
5. Tránh background noise và echo