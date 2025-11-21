# Combined TTS and STT Example
# pip install google-genai google-cloud-speech

import os
import json
from generate_audio import generate, save_binary_file
from speech_to_text import SpeechToText, transcribe_file

def demo_tts_stt_pipeline():
    """
    Demonstration of Text-to-Speech -> Speech-to-Text pipeline
    """
    print("=== TTS + STT Pipeline Demo ===\n")
    
    # Step 1: Generate speech from text
    print("1. Generating audio from text...")
    
    # You can modify the text here
    test_text = """Hello! This is a test of our text-to-speech and speech-to-text pipeline. 
    We will convert this text to speech, then convert the speech back to text to test accuracy."""
    
    # Note: You'll need to modify your generate_audio.py to accept custom text
    # For now, it will generate the default audio
    
    print("2. Audio generation completed (check generated files)")
    
    # Step 2: Find generated audio files
    audio_files = []
    for file in os.listdir('.'):
        if file.startswith('ENTER_FILE_NAME_') and file.endswith('.wav'):
            audio_files.append(file)
    
    if not audio_files:
        print("No audio files found. Please run the TTS generation first.")
        return
    
    print(f"Found {len(audio_files)} audio files")
    
    # Step 3: Transcribe each audio file
    print("\n3. Transcribing audio files...")
    
    stt = SpeechToText()  # Using default credentials
    
    for audio_file in audio_files:
        print(f"\nTranscribing: {audio_file}")
        
        # Transcribe the audio
        result = stt.transcribe_audio_file(
            audio_file_path=audio_file,
            language_code="en-US",
            enable_word_time_offsets=True
        )
        
        if result["success"]:
            print(f"✅ Transcription successful!")
            print(f"Text: {result['full_transcript']}")
            
            # Save detailed results
            output_file = f"{os.path.splitext(audio_file)[0]}_transcription.json"
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"Detailed results saved to: {output_file}")
            
            # Display confidence scores
            if result["results"]:
                avg_confidence = sum(r["confidence"] for r in result["results"]) / len(result["results"])
                print(f"Average confidence: {avg_confidence:.4f}")
        else:
            print(f"❌ Transcription failed: {result['error']}")

def transcribe_existing_audio():
    """
    Transcribe existing audio files in the directory
    """
    print("=== Transcribe Existing Audio ===\n")
    
    # Look for audio files
    audio_extensions = ['.wav', '.mp3', '.m4a', '.flac']
    audio_files = []
    
    for file in os.listdir('.'):
        if any(file.lower().endswith(ext) for ext in audio_extensions):
            audio_files.append(file)
    
    if not audio_files:
        print("No audio files found in current directory")
        return
    
    print(f"Found {len(audio_files)} audio files:")
    for i, file in enumerate(audio_files):
        print(f"  {i+1}. {file}")
    
    # Let user choose file or process all
    choice = input("\nEnter file number to transcribe (or 'all' for all files): ").strip()
    
    if choice.lower() == 'all':
        files_to_process = audio_files
    else:
        try:
            file_index = int(choice) - 1
            if 0 <= file_index < len(audio_files):
                files_to_process = [audio_files[file_index]]
            else:
                print("Invalid file number")
                return
        except ValueError:
            print("Invalid input")
            return
    
    # Process selected files
    stt = SpeechToText()
    
    for audio_file in files_to_process:
        print(f"\nProcessing: {audio_file}")
        
        result = transcribe_file(audio_file, language="en-US")
        
        if result["success"]:
            print(f"✅ Success!")
            print(f"Transcript: {result['full_transcript']}")
            
            # Show word timing if available
            for segment in result["results"]:
                if "words" in segment and segment["words"]:
                    print(f"\nWord timing for segment:")
                    for word in segment["words"]:
                        print(f"  {word['word']}: {word['start_time']:.2f}s - {word['end_time']:.2f}s")
                    break  # Only show first segment's timing
        else:
            print(f"❌ Failed: {result['error']}")

def setup_google_cloud_credentials():
    """
    Guide for setting up Google Cloud credentials
    """
    print("=== Google Cloud Speech-to-Text Setup ===\n")
    print("To use Google Cloud Speech-to-Text, you need to:")
    print("1. Create a Google Cloud Project")
    print("2. Enable the Speech-to-Text API")
    print("3. Create a Service Account and download the JSON key file")
    print("4. Set the GOOGLE_APPLICATION_CREDENTIALS environment variable")
    print("\nDetailed steps:")
    print("1. Go to https://console.cloud.google.com/")
    print("2. Create a new project or select existing one")
    print("3. Go to APIs & Services > Library")
    print("4. Search for 'Speech-to-Text API' and enable it")
    print("5. Go to APIs & Services > Credentials")
    print("6. Click 'Create Credentials' > 'Service Account'")
    print("7. Download the JSON key file")
    print("8. Set environment variable:")
    print("   export GOOGLE_APPLICATION_CREDENTIALS='path/to/your/key.json'")
    print("\nAlternatively, you can pass the credentials path directly to the SpeechToText class")

if __name__ == "__main__":
    print("Google Speech-to-Text Integration")
    print("================================")
    print("1. Run TTS + STT Pipeline Demo")
    print("2. Transcribe Existing Audio")
    print("3. Setup Instructions")
    print("4. Exit")
    
    while True:
        choice = input("\nEnter your choice (1-4): ").strip()
        
        if choice == '1':
            demo_tts_stt_pipeline()
        elif choice == '2':
            transcribe_existing_audio()
        elif choice == '3':
            setup_google_cloud_credentials()
        elif choice == '4':
            break
        else:
            print("Invalid choice. Please enter 1-4.")