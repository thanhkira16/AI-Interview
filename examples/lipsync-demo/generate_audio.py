#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script tự động tạo file audio tiếng Việt từ JSON dialogues
Yêu cầu: pip install gtts
"""

from gtts import gTTS
import json
import os
import time

def create_audio_files():
    """Đọc dialogues.json và tạo file audio tương ứng"""
    
    # Đọc file JSON
    try:
        with open('public/dialogues.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ Không tìm thấy file dialogues.json")
        return
    
    # Tạo thư mục audio nếu chưa có
    audio_dir = 'public/audios/vietnamese'
    os.makedirs(audio_dir, exist_ok=True)
    
    total_dialogues = 0
    created_files = 0
    
    # Duyệt qua tất cả conversations
    for conversation in data['conversations']:
        print(f"\n🎭 Đang xử lý: {conversation['title']}")
        
        for dialogue in conversation['dialogues']:
            total_dialogues += 1
            
            # Tạo tên file
            filename = f"vietnamese_{conversation['id']}_{dialogue['id']}.mp3"
            filepath = os.path.join(audio_dir, filename)
            
            # Bỏ qua nếu file đã tồn tại
            if os.path.exists(filepath):
                print(f"⏭️  Bỏ qua (đã tồn tại): {filename}")
                continue
            
            try:
                # Tạo audio với gTTS
                print(f"🔊 Đang tạo: {filename}")
                tts = gTTS(
                    text=dialogue['text'], 
                    lang='vi', 
                    slow=False,
                    tld='com'  # Sử dụng Google.com domain cho chất lượng tốt hơn
                )
                
                # Lưu file
                tts.save(filepath)
                created_files += 1
                
                print(f"✅ Đã tạo: {filename}")
                
                # Delay để tránh bị rate limit
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Lỗi tạo {filename}: {str(e)}")
    
    print(f"\n📊 Kết quả:")
    print(f"   • Tổng đoạn hội thoại: {total_dialogues}")
    print(f"   • File audio đã tạo: {created_files}")
    print(f"   • Thư mục: {audio_dir}")

def update_json_with_new_audio_paths():
    """Cập nhật đường dẫn audio trong JSON"""
    
    try:
        with open('public/dialogues.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("❌ Không tìm thấy file dialogues.json")
        return
    
    # Cập nhật đường dẫn audio
    for conversation in data['conversations']:
        for dialogue in conversation['dialogues']:
            vietnamese_filename = f"vietnamese_{conversation['id']}_{dialogue['id']}.mp3"
            vietnamese_path = f"/audios/vietnamese/{vietnamese_filename}"
            
            # Thêm thuộc tính audio paths
            if 'audioPaths' not in dialogue:
                dialogue['audioPaths'] = {}
            
            dialogue['audioPaths']['vietnamese'] = vietnamese_path
            
            # Nếu chưa có audioFile hoặc muốn dùng tiếng Việt làm mặc định
            if 'audioFile' not in dialogue or dialogue['language'] == 'vi':
                if os.path.exists(f"public/audios/vietnamese/{vietnamese_filename}"):
                    dialogue['audioFile'] = vietnamese_path
    
    # Lưu file JSON đã cập nhật
    with open('public/dialogues.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("✅ Đã cập nhật đường dẫn audio trong dialogues.json")

if __name__ == "__main__":
    print("🎤 Tạo file audio tiếng Việt từ dialogues.json")
    print("=" * 50)
    
    create_audio_files()
    update_json_with_new_audio_paths()
    
    print("\n🎉 Hoàn thành! Bạn có thể sử dụng các file audio mới trong ứng dụng.")