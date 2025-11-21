# Speech-to-Text API Server
# Flask API để xử lý audio và chuyển đổi sang text

from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import os
import tempfile
import wave
from google.cloud import speech
from google.oauth2 import service_account
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class SpeechToTextAPI:
    def __init__(self):
        # Try to initialize with credentials from environment
        credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        
        if credentials_path and os.path.exists(credentials_path):
            credentials = service_account.Credentials.from_service_account_file(credentials_path)
            self.client = speech.SpeechClient(credentials=credentials)
            print(f"✅ Initialized with credentials: {credentials_path}")
        else:
            try:
                # Try default credentials
                self.client = speech.SpeechClient()
                print("✅ Initialized with default credentials")
            except Exception as e:
                print(f"❌ Failed to initialize Speech client: {e}")
                self.client = None
    
    def transcribe_audio(self, audio_data, sample_rate=16000, language_code="vi-VN"):
        """Transcribe audio data to text"""
        if not self.client:
            return {"error": "Speech client not initialized. Please check your Google Cloud credentials."}
        
        try:
            # Configure recognition
            audio = speech.RecognitionAudio(content=audio_data)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
                sample_rate_hertz=sample_rate,
                language_code=language_code,
                enable_automatic_punctuation=True,
                enable_word_time_offsets=True,
                audio_channel_count=1,
                alternative_language_codes=["en-US"]  # Fallback to English
            )
            
            # Perform recognition
            response = self.client.recognize(config=config, audio=audio)
            
            # Process results
            results = []
            for result in response.results:
                alternative = result.alternatives[0]
                result_data = {
                    "transcript": alternative.transcript,
                    "confidence": alternative.confidence
                }
                
                # Add word timing if available
                if alternative.words:
                    words = []
                    for word_info in alternative.words:
                        word_data = {
                            "word": word_info.word,
                            "start_time": word_info.start_time.total_seconds(),
                            "end_time": word_info.end_time.total_seconds()
                        }
                        words.append(word_data)
                    result_data["words"] = words
                
                results.append(result_data)
            
            return {
                "success": True,
                "results": results,
                "full_transcript": " ".join([r["transcript"] for r in results]) if results else ""
            }
            
        except Exception as e:
            return {"error": f"Transcription failed: {str(e)}"}

# Initialize Speech-to-Text
stt_api = SpeechToTextAPI()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "speech_client_ready": stt_api.client is not None
    })

@app.route('/transcribe', methods=['POST'])
def transcribe():
    """Transcribe audio to text"""
    try:
        # Get parameters
        language = request.form.get('language', 'vi-VN')
        sample_rate = int(request.form.get('sample_rate', 16000))
        
        # Get audio file
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({"error": "No audio file selected"}), 400
        
        # Read audio data
        audio_data = audio_file.read()
        
        # Transcribe
        result = stt_api.transcribe_audio(
            audio_data=audio_data,
            sample_rate=sample_rate,
            language_code=language
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/transcribe-blob', methods=['POST'])
def transcribe_blob():
    """Transcribe audio blob from frontend recording"""
    try:
        data = request.get_json()
        
        if not data or 'audioData' not in data:
            return jsonify({"error": "No audio data provided"}), 400
        
        # Decode base64 audio data
        audio_base64 = data['audioData'].split(',')[1] if ',' in data['audioData'] else data['audioData']
        audio_data = base64.b64decode(audio_base64)
        
        # Get parameters
        language = data.get('language', 'vi-VN')
        sample_rate = data.get('sampleRate', 16000)
        
        # Transcribe
        result = stt_api.transcribe_audio(
            audio_data=audio_data,
            sample_rate=sample_rate,
            language_code=language
        )
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Starting Speech-to-Text API Server...")
    print(f"🔑 Google credentials: {os.getenv('GOOGLE_APPLICATION_CREDENTIALS', 'Not set')}")
    print(f"🌐 CORS enabled for frontend integration")
    print(f"📝 Available endpoints:")
    print(f"   GET  /health - Health check")
    print(f"   POST /transcribe - Transcribe audio file")
    print(f"   POST /transcribe-blob - Transcribe audio blob")
    
    app.run(host='0.0.0.0', port=5000, debug=True)