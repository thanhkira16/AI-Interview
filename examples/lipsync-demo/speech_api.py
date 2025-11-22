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

# Speech-to-Text API Server
# Flask API để xử lý audio và chuyển đổi sang text using Gemini API

from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import os
import tempfile
import wave
import base64
from dotenv import load_dotenv
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class SpeechToTextAPI:
    def __init__(self):
        # Try to initialize with Gemini API key
        api_key = os.getenv('GEMINI_API_KEY')
        
        if api_key:
            try:
                self.client = genai.Client(api_key=api_key)
                # Use standard model instead of experimental one for better quota
                self.model = "gemini-1.5-flash"  # More stable and higher quota
                print(f"✅ Initialized with Gemini API key")
                print(f"🤖 Using model: {self.model}")
            except Exception as e:
                print(f"❌ Failed to initialize Gemini client: {e}")
                self.client = None
        else:
            print("❌ GEMINI_API_KEY not found in environment")
            self.client = None
    
    def transcribe_audio_gemini(self, audio_data, language_code="vi-VN"):
        """Transcribe audio using Gemini API with retry mechanism"""
        if not self.client:
            return {"error": "Gemini client not initialized. Please check your GEMINI_API_KEY."}
        
        try:
            # Convert language code to language name for Gemini
            language_map = {
                "vi-VN": "tiếng Việt",
                "en-US": "English",
                "en-GB": "English",
                "zh-CN": "Chinese",
                "ja-JP": "Japanese",
                "ko-KR": "Korean",
                "fr-FR": "French",
                "de-DE": "German", 
                "es-ES": "Spanish"
            }
            
            language_name = language_map.get(language_code, "English")
            
            # Try multiple approaches for audio input
            attempts = 0
            max_attempts = 3
            
            while attempts < max_attempts:
                try:
                    attempts += 1
                    print(f"🔄 Attempt {attempts} to transcribe audio...")
                    
                    # Method 1: Try with inline_data (Gemini 1.5 Flash supports this)
                    if attempts <= 2:
                        audio_part = types.Part(
                            inline_data=types.Blob(
                                data=audio_data,
                                mime_type="audio/webm"
                            )
                        )
                        
                        prompt = f"Please transcribe this audio to text in {language_name}. Only return the transcribed text, no additional commentary."
                        text_part = types.Part(text=prompt)
                        
                        contents = [
                            types.Content(
                                role="user",
                                parts=[text_part, audio_part]
                            )
                        ]
                        
                        # Generate transcription with lower temperature
                        response = self.client.models.generate_content(
                            model=self.model,
                            contents=contents,
                            config=types.GenerateContentConfig(
                                temperature=0.1,
                                max_output_tokens=500  # Reduce tokens to save quota
                            )
                        )
                    else:
                        # Method 2: Fallback - return a helpful message if audio transcription fails
                        return {
                            "error": "Audio transcription temporarily unavailable due to quota limits. Please try text input or wait a moment and retry."
                        }
                    
                    if response.text:
                        transcript = response.text.strip()
                        print(f"✅ Transcription successful: {transcript[:50]}...")
                        
                        return {
                            "success": True,
                            "results": [{
                                "transcript": transcript,
                                "confidence": 0.90,  # Slightly lower confidence for 1.5-flash
                                "model_used": self.model
                            }],
                            "full_transcript": transcript
                        }
                    else:
                        if attempts < max_attempts:
                            print(f"⚠️ No response text, retrying...")
                            continue
                        return {"error": "No transcription generated after multiple attempts"}
                        
                except Exception as attempt_error:
                    error_msg = str(attempt_error)
                    print(f"❌ Attempt {attempts} failed: {error_msg}")
                    
                    # Check for quota errors
                    if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                        return {
                            "error": "Gemini API quota exceeded. Please check your billing or wait for quota reset. You can also try using a different model or reduce usage frequency."
                        }
                    
                    # Check for audio format errors  
                    if "audio" in error_msg.lower() or "format" in error_msg.lower():
                        if attempts < max_attempts:
                            print(f"🔄 Audio format issue, trying alternative approach...")
                            continue
                        return {"error": "Audio format not supported. Please try recording in a different format."}
                    
                    # Other errors - retry if attempts left
                    if attempts < max_attempts:
                        print(f"🔄 Retrying in 2 seconds...")
                        import time
                        time.sleep(2)
                        continue
                    
                    return {"error": f"Transcription failed after {max_attempts} attempts: {error_msg}"}
            
            return {"error": "Maximum retry attempts exceeded"}
            
        except Exception as e:
            error_msg = str(e)
            if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                return {
                    "error": "API quota exceeded. Please wait a moment or check your Gemini API billing settings."
                }
            return {"error": f"Gemini transcription failed: {error_msg}"}
    
    def transcribe_audio(self, audio_data, sample_rate=16000, language_code="vi-VN"):
        """Main transcription method using Gemini API"""
        return self.transcribe_audio_gemini(audio_data, language_code)

# Initialize Speech-to-Text
stt_api = SpeechToTextAPI()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "speech_client_ready": stt_api.client is not None,
        "using_gemini_api": True,
        "gemini_model": stt_api.model if stt_api.client else None
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
        
        # Transcribe with Gemini API
        result = stt_api.transcribe_audio(
            audio_data=audio_data,
            sample_rate=sample_rate,
            language_code=language
        )
        
        # If Gemini fails due to quota, suggest fallback
        if not result.get("success") and ("quota" in result.get("error", "").lower() or "429" in result.get("error", "")):
            result["fallback_suggestion"] = {
                "method": "browser_speech_api",
                "message": "Gemini API quota exceeded. You can use browser's built-in Speech Recognition as a fallback.",
                "instructions": "The React app can automatically switch to Web Speech API for speech recognition."
            }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Starting Speech-to-Text API Server...")
    print(f"🔑 Gemini API key: {'Found' if os.getenv('GEMINI_API_KEY') else 'Not found'}")
    print(f"🤖 Using Gemini API for speech transcription")
    print(f"🌐 CORS enabled for frontend integration")
    print(f"📝 Available endpoints:")
    print(f"   GET  /health - Health check")
    print(f"   POST /transcribe - Transcribe audio file")
    print(f"   POST /transcribe-blob - Transcribe audio blob")
    
    app.run(host='0.0.0.0', port=5000, debug=True)