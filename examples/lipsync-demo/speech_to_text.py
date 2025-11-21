# To run this code you need to install the following dependencies:
# pip install google-cloud-speech

import io
import os
from google.cloud import speech
from google.oauth2 import service_account
import wave
import json

class SpeechToText:
    def __init__(self, credentials_path=None):
        """
        Initialize Speech-to-Text client
        
        Args:
            credentials_path: Path to Google Cloud service account JSON file
                            If None, will use GOOGLE_APPLICATION_CREDENTIALS environment variable
        """
        if credentials_path:
            credentials = service_account.Credentials.from_service_account_file(credentials_path)
            self.client = speech.SpeechClient(credentials=credentials)
        else:
            # Use default credentials from environment
            self.client = speech.SpeechClient()
    
    def transcribe_audio_file(self, audio_file_path, language_code="en-US", 
                            enable_word_time_offsets=True, enable_automatic_punctuation=True):
        """
        Transcribe audio file to text
        
        Args:
            audio_file_path: Path to audio file (WAV format recommended)
            language_code: Language code (e.g., "en-US", "vi-VN")
            enable_word_time_offsets: Include word timing information
            enable_automatic_punctuation: Add punctuation automatically
            
        Returns:
            Dictionary with transcription results
        """
        try:
            # Read audio file
            with io.open(audio_file_path, "rb") as audio_file:
                content = audio_file.read()
            
            # Get audio info for better configuration
            sample_rate, channels = self._get_audio_info(audio_file_path)
            
            audio = speech.RecognitionAudio(content=content)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=sample_rate,
                language_code=language_code,
                enable_word_time_offsets=enable_word_time_offsets,
                enable_automatic_punctuation=enable_automatic_punctuation,
                audio_channel_count=channels,
            )
            
            # Perform transcription
            response = self.client.recognize(config=config, audio=audio)
            
            # Process results
            results = []
            for result in response.results:
                alternative = result.alternatives[0]
                result_data = {
                    "transcript": alternative.transcript,
                    "confidence": alternative.confidence
                }
                
                # Add word timing if enabled
                if enable_word_time_offsets and alternative.words:
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
                "full_transcript": " ".join([r["transcript"] for r in results])
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
    
    def transcribe_streaming(self, audio_generator, language_code="en-US", 
                           sample_rate=16000, interim_results=True):
        """
        Perform streaming speech recognition
        
        Args:
            audio_generator: Generator yielding audio chunks
            language_code: Language code
            sample_rate: Audio sample rate
            interim_results: Return interim results
            
        Yields:
            Transcription results as they become available
        """
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=sample_rate,
            language_code=language_code,
            enable_automatic_punctuation=True,
        )
        
        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=interim_results,
        )
        
        audio_generator = (speech.StreamingRecognizeRequest(audio_content=chunk)
                          for chunk in audio_generator)
        
        requests = (speech.StreamingRecognizeRequest(streaming_config=streaming_config),)
        requests = requests + tuple(audio_generator)
        
        responses = self.client.streaming_recognize(requests)
        
        for response in responses:
            for result in response.results:
                yield {
                    "transcript": result.alternatives[0].transcript,
                    "is_final": result.is_final,
                    "confidence": result.alternatives[0].confidence if result.is_final else None
                }
    
    def _get_audio_info(self, audio_file_path):
        """Get audio file information (sample rate, channels)"""
        try:
            with wave.open(audio_file_path, 'rb') as wav_file:
                sample_rate = wav_file.getframerate()
                channels = wav_file.getnchannels()
                return sample_rate, channels
        except:
            # Default values if unable to read file info
            return 16000, 1


def transcribe_file(file_path, language="en-US", credentials_path=None):
    """
    Simple function to transcribe an audio file
    
    Args:
        file_path: Path to audio file
        language: Language code (default: "en-US")
        credentials_path: Path to service account JSON (optional)
    
    Returns:
        Transcription result dictionary
    """
    stt = SpeechToText(credentials_path)
    return stt.transcribe_audio_file(file_path, language)


def save_transcription(transcription_result, output_file):
    """Save transcription results to JSON file"""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(transcription_result, f, ensure_ascii=False, indent=2)
    print(f"Transcription saved to: {output_file}")


if __name__ == "__main__":
    # Example usage
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python speech_to_text.py <audio_file_path> [language_code] [credentials_path]")
        sys.exit(1)
    
    audio_file = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else "en-US"
    credentials = sys.argv[3] if len(sys.argv) > 3 else None
    
    print(f"Transcribing: {audio_file}")
    print(f"Language: {language}")
    
    result = transcribe_file(audio_file, language, credentials)
    
    if result["success"]:
        print("\n=== TRANSCRIPTION RESULTS ===")
        print(f"Full transcript: {result['full_transcript']}")
        
        print("\n=== DETAILED RESULTS ===")
        for i, res in enumerate(result["results"]):
            print(f"Segment {i+1}:")
            print(f"  Text: {res['transcript']}")
            print(f"  Confidence: {res['confidence']:.4f}")
            
            if "words" in res:
                print("  Word timing:")
                for word in res["words"]:
                    print(f"    {word['word']}: {word['start_time']:.2f}s - {word['end_time']:.2f}s")
        
        # Save to file
        output_file = os.path.splitext(audio_file)[0] + "_transcription.json"
        save_transcription(result, output_file)
        
    else:
        print(f"Error: {result['error']}")