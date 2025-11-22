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
import requests
from dotenv import load_dotenv
from career_recommender import CareerRecommender

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

class SpeechToTextAPI:
    def __init__(self):
        # Try to initialize with credentials from environment
        credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
        # Support using an API key (GEMINI_API_KEY) to call the REST Speech-to-Text
        # endpoint when `GOOGLE_APPLICATION_CREDENTIALS=use_gemini_api`.
        self.use_gemini_api = False
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')

        # If the env var explicitly requests gemini path, or if the path
        # doesn't exist but an API key is present, switch to REST mode.
        if credentials_path == 'use_gemini_api' or (credentials_path and not os.path.exists(credentials_path) and self.gemini_api_key):
            if not self.gemini_api_key:
                print("⚠️ Requested GEMINI API mode but GEMINI_API_KEY is not set")
            else:
                self.use_gemini_api = True
                self.client = None
                print("✅ Using REST Speech-to-Text via GEMINI_API_KEY")
                return
        
        # If env var points to a file, prefer that. If it's set but the file
        # doesn't exist (for example a placeholder like 'use_gemini_api'),
        # temporarily unset it and try application-default credentials instead.
        if credentials_path:
            if os.path.exists(credentials_path):
                try:
                    credentials = service_account.Credentials.from_service_account_file(credentials_path)
                    self.client = speech.SpeechClient(credentials=credentials)
                    print(f"✅ Initialized with credentials: {credentials_path}")
                except Exception as e:
                    print(f"❌ Failed to initialize Speech client with provided credentials: {e}")
                    self.client = None
            else:
                print(f"⚠️ GOOGLE_APPLICATION_CREDENTIALS is set but file was not found: {credentials_path}")
                print("⚠️ Trying Application Default Credentials (unsetting env var temporarily)")
                # Temporarily remove the env var so google auth won't try to read it
                original = os.environ.pop('GOOGLE_APPLICATION_CREDENTIALS', None)
                try:
                    self.client = speech.SpeechClient()
                    print("✅ Initialized with default credentials")
                except Exception as e:
                    print(f"❌ Failed to initialize Speech client with default credentials: {e}")
                    self.client = None
                finally:
                    # Restore original env var so we don't change global state permanently
                    if original is not None:
                        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = original
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
        # If configured to use REST (GEMINI_API_KEY), call Speech-to-Text REST endpoint
        if getattr(self, 'use_gemini_api', False):
            try:
                if not self.gemini_api_key:
                    return {"error": "GEMINI_API_KEY not configured for REST Speech-to-Text."}

                audio_b64 = base64.b64encode(audio_data).decode('utf-8')
                url = f"https://speech.googleapis.com/v1/speech:recognize?key={self.gemini_api_key}"
                payload = {
                    "config": {
                        "encoding": "WEBM_OPUS",
                        "sampleRateHertz": int(sample_rate),
                        "languageCode": language_code,
                        "enableAutomaticPunctuation": True,
                        "enableWordTimeOffsets": True,
                        "audioChannelCount": 1,
                        "alternativeLanguageCodes": ["en-US"]
                    },
                    "audio": {"content": audio_b64}
                }

                resp = requests.post(url, json=payload, timeout=60)
                resp.raise_for_status()
                data = resp.json()

                results = []
                for r in data.get('results', []):
                    alt = (r.get('alternatives') or [{}])[0]
                    result_data = {
                        'transcript': alt.get('transcript', ''),
                        'confidence': alt.get('confidence', 0.0)
                    }
                    # words/time offsets
                    if alt.get('words'):
                        words = []
                        for w in alt.get('words', []):
                            # times can be strings like '1.230s'
                            def _parse_time(t):
                                try:
                                    if isinstance(t, str) and t.endswith('s'):
                                        return float(t[:-1])
                                    return float(t)
                                except Exception:
                                    return 0.0
                            words.append({
                                'word': w.get('word'),
                                'start_time': _parse_time(w.get('startTime', 0)),
                                'end_time': _parse_time(w.get('endTime', 0))
                            })
                        result_data['words'] = words
                    results.append(result_data)

                return {
                    'success': True,
                    'results': results,
                    'full_transcript': ' '.join([r['transcript'] for r in results]) if results else ''
                }

            except Exception as e:
                return {"error": f"Gemini/REST transcription failed: {str(e)}"}

        # Fallback: require a client-based SpeechClient
        if not getattr(self, 'client', None):
            return {"error": "Speech client not initialized. Please check your Google Cloud credentials or set GEMINI_API_KEY / use_gemini_api."}

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

# Initialize recommender (lazy load errors will raise at startup if dataset missing)
try:
    recommender = CareerRecommender()
    print(f"✅ CareerRecommender initialized with dataset: {recommender.dataset_path}")
except Exception as e:
    recommender = None
    print(f"⚠️ CareerRecommender initialization failed: {e}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "speech_client_ready": (stt_api.client is not None) or getattr(stt_api, 'use_gemini_api', False)
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
        
        # If we have a recommender and transcription succeeded, also produce suggestions
        if recommender and result.get('success') and result.get('full_transcript'):
            try:
                suggested = recommender.recommend(result['full_transcript'], top_n=5)
                suggested['user'] = data.get('user', '')
                suggested['desired_job'] = data.get('desired_job', '')
                result['suggestions'] = suggested
            except Exception as e:
                result['suggestions_error'] = str(e)

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