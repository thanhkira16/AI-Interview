# Speech-to-Text Integration

This project integrates Google Cloud Speech-to-Text API with the existing text-to-speech functionality.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set up Google Cloud Speech-to-Text

#### Option A: Using Service Account (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Speech-to-Text API:
   - Go to APIs & Services > Library
   - Search for "Speech-to-Text API"
   - Click "Enable"
4. Create a Service Account:
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "Service Account"
   - Fill in the details and create
   - Click on the created service account
   - Go to "Keys" tab > "Add Key" > "Create New Key"
   - Choose JSON format and download
5. Set the credentials in your `.env` file:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
   ```

#### Option B: Using Application Default Credentials

```bash
gcloud auth application-default login
```

### 3. Environment Variables

Your `.env` file should contain:
```
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
```

## Usage

### Basic Speech-to-Text

```python
from speech_to_text import transcribe_file

# Transcribe an audio file
result = transcribe_file("audio.wav", language="en-US")

if result["success"]:
    print(result["full_transcript"])
else:
    print(f"Error: {result['error']}")
```

### Advanced Usage

```python
from speech_to_text import SpeechToText

# Initialize with custom credentials
stt = SpeechToText(credentials_path="path/to/credentials.json")

# Transcribe with detailed options
result = stt.transcribe_audio_file(
    audio_file_path="audio.wav",
    language_code="en-US",
    enable_word_time_offsets=True,
    enable_automatic_punctuation=True
)

# Access word-level timing
for segment in result["results"]:
    if "words" in segment:
        for word in segment["words"]:
            print(f"{word['word']}: {word['start_time']}s - {word['end_time']}s")
```

### Combined TTS + STT Demo

Run the complete demo:
```bash
python tts_stt_demo.py
```

This will:
1. Generate audio using text-to-speech
2. Transcribe the generated audio back to text
3. Compare results and show accuracy

### Streaming Recognition

```python
from speech_to_text import SpeechToText

stt = SpeechToText()

# For streaming recognition, you need to implement audio_generator
# This is typically used for real-time transcription from microphone
for result in stt.transcribe_streaming(audio_generator):
    print(f"Transcript: {result['transcript']}")
    if result['is_final']:
        print(f"Final result with confidence: {result['confidence']}")
```

## File Structure

- `speech_to_text.py` - Main Speech-to-Text implementation
- `tts_stt_demo.py` - Combined TTS+STT demonstration
- `generate_audio.py` - Existing TTS functionality  
- `requirements.txt` - Python dependencies
- `.env` - Environment variables

## Supported Languages

Common language codes:
- English: `en-US`
- Vietnamese: `vi-VN`
- Spanish: `es-ES`
- French: `fr-FR`
- German: `de-DE`
- Chinese: `zh-CN`
- Japanese: `ja-JP`
- Korean: `ko-KR`

Full list: [Google Cloud Speech-to-Text Language Support](https://cloud.google.com/speech-to-text/docs/languages)

## Features

### Speech Recognition Features
- **Automatic Punctuation**: Adds punctuation to transcripts
- **Word-level Timestamps**: Get timing for each word
- **Confidence Scores**: Reliability scores for transcriptions
- **Multi-language Support**: 125+ languages supported
- **Streaming Recognition**: Real-time transcription
- **Speaker Diarization**: Identify different speakers (premium feature)

### Audio Format Support
- WAV (recommended)
- MP3
- FLAC
- OGG

### Configuration Options
- Sample rate detection
- Channel count detection  
- Custom encoding settings
- Language detection
- Profanity filtering

## Troubleshooting

### Common Issues

1. **Authentication Error**
   ```
   google.auth.exceptions.DefaultCredentialsError
   ```
   Solution: Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly

2. **API Not Enabled**
   ```
   google.api_core.exceptions.Forbidden: 403 Speech-to-Text API has not been used
   ```
   Solution: Enable Speech-to-Text API in Google Cloud Console

3. **Audio Format Issues**
   ```
   Invalid audio format
   ```
   Solution: Convert audio to WAV format with 16kHz sample rate

4. **Quota Exceeded**
   ```
   google.api_core.exceptions.ResourceExhausted: 429 Quota exceeded
   ```
   Solution: Check your Google Cloud quotas and billing

### Tips for Better Accuracy

1. **Audio Quality**
   - Use clear, high-quality audio
   - Minimize background noise
   - 16kHz sample rate works best

2. **Language Settings**
   - Set correct language code
   - Use region-specific codes when possible
   - Enable automatic punctuation

3. **Content Type**
   - Use appropriate models for your content type
   - Consider enhanced models for better accuracy

## Cost Considerations

Google Cloud Speech-to-Text pricing (as of 2024):
- Standard recognition: $0.024 per minute
- Enhanced models: $0.048 per minute  
- Free tier: 60 minutes per month

Monitor usage in Google Cloud Console to avoid unexpected charges.

## Examples

### Transcribe Multiple Files

```python
import os
from speech_to_text import transcribe_file

audio_files = [f for f in os.listdir('.') if f.endswith('.wav')]

for file in audio_files:
    print(f"Processing: {file}")
    result = transcribe_file(file)
    if result["success"]:
        print(f"Transcript: {result['full_transcript']}")
        print(f"Confidence: {result['results'][0]['confidence']:.4f}")
    print("-" * 50)
```

### Save Results to File

```python
import json
from speech_to_text import transcribe_file

result = transcribe_file("audio.wav")

# Save to JSON
with open("transcription.json", "w") as f:
    json.dump(result, f, indent=2)

# Save transcript only
with open("transcript.txt", "w") as f:
    f.write(result["full_transcript"])
```