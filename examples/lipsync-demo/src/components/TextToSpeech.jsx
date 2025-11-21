import { useState, useEffect, useRef } from 'react';
import { lipsyncManager } from '../App';
import { VISEMES } from 'wawa-lipsync';

export const TextToSpeech = () => {
    const [text, setText] = useState('Xin chào! Tôi là AI avatar. Hãy nhập văn bản để tôi đọc.');
    const [isPlaying, setIsPlaying] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [rate, setRate] = useState(0.9);
    const [pitch, setPitch] = useState(1.0);
    const [volume, setVolume] = useState(1.0);
    const [enableFakeLipsync, setEnableFakeLipsync] = useState(true);
    const audioRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const fakeLipsyncRef = useRef(null);
    const speechUtteranceRef = useRef(null);

    // Load available voices
    useEffect(() => {
        const updateVoices = () => {
            const availableVoices = speechSynthesis.getVoices();
            setVoices(availableVoices);

            // Tìm voice tiếng Việt
            const vietnameseVoice = availableVoices.find(voice =>
                voice.lang.includes('vi') || voice.name.includes('Vietnamese')
            );

            if (vietnameseVoice) {
                setSelectedVoice(vietnameseVoice.name);
            } else {
                // Fallback to English or first available voice
                const englishVoice = availableVoices.find(voice =>
                    voice.lang.includes('en')
                );
                setSelectedVoice(englishVoice ? englishVoice.name : availableVoices[0]?.name || '');
            }
        };

        updateVoices();
        speechSynthesis.addEventListener('voiceschanged', updateVoices);

        return () => {
            speechSynthesis.removeEventListener('voiceschanged', updateVoices);
        };
    }, []);

    // Simple direct viseme update approach
    const startDirectVisemeUpdate = (textContent, speechRate) => {
        if (!enableFakeLipsync || !lipsyncManager) return;

        console.log('🎯 Bắt đầu direct viseme update');

        // Create word sequence
        const words = textContent.split(/[\s.,!?;:-]+/).filter(word => word.length > 0);
        console.log(`📝 Direct update cho ${words.length} từ:`, words);

        let wordIndex = 0;
        const wordDuration = 800; // Fixed duration per word
        const pauseDuration = 200; // Pause between words

        // Clear any existing interval
        if (fakeLipsyncRef.current) {
            clearInterval(fakeLipsyncRef.current);
        }

        const updateViseme = () => {
            if (wordIndex >= words.length) {
                // Finished - set to silence
                lipsyncManager.viseme = VISEMES.sil;
                if (fakeLipsyncRef.current) {
                    clearInterval(fakeLipsyncRef.current);
                    fakeLipsyncRef.current = null;
                }
                console.log('✅ Direct viseme update hoàn thành');
                return;
            }

            const word = words[wordIndex].toLowerCase();
            const firstChar = word[0];
            let viseme = VISEMES.aa; // Default

            // Map character to viseme
            if ('aáàảãạăắằẳẵặâấầẩẫậ'.includes(firstChar)) {
                viseme = VISEMES.aa;
            } else if ('eéèẻẽẹêếềểễệ'.includes(firstChar)) {
                viseme = VISEMES.E;
            } else if ('iíìỉĩị'.includes(firstChar)) {
                viseme = VISEMES.I;
            } else if ('oóòỏõọôốồổỗộơớờởỡợ'.includes(firstChar)) {
                viseme = VISEMES.O;
            } else if ('uúùủũụưứừửữự'.includes(firstChar)) {
                viseme = VISEMES.U;
            } else if ('bpmw'.includes(firstChar)) {
                viseme = VISEMES.PP;
            } else if ('fv'.includes(firstChar)) {
                viseme = VISEMES.FF;
            } else if ('dt'.includes(firstChar)) {
                viseme = VISEMES.DD;
            } else if ('kgc'.includes(firstChar)) {
                viseme = VISEMES.kk;
            } else if ('sz'.includes(firstChar)) {
                viseme = VISEMES.SS;
            } else if ('n'.includes(firstChar)) {
                viseme = VISEMES.nn;
            } else if ('rlx'.includes(firstChar)) {
                viseme = VISEMES.RR;
            } else if ('jy'.includes(firstChar)) {
                viseme = VISEMES.CH;
            }

            // DIRECT UPDATE - bypass all lipsync logic
            const oldViseme = lipsyncManager.viseme;
            lipsyncManager.viseme = viseme;

            console.log(`🎯 DIRECT: "${word}" [${firstChar}] → ${oldViseme} ➜ ${viseme}`);

            wordIndex++;

            // Schedule pause and next word
            setTimeout(() => {
                if (lipsyncManager) {
                    lipsyncManager.viseme = VISEMES.sil;
                    console.log(`⏸️ Pause after "${word}"`);
                }
            }, wordDuration);
        };

        // Start immediately and repeat for each word
        updateViseme();
        fakeLipsyncRef.current = setInterval(updateViseme, wordDuration + pauseDuration);
    };

    const speakText = async () => {
        if (!text.trim()) return;

        // Debug: Kiểm tra lipsyncManager
        console.log('🔍 Kiểm tra lipsyncManager:', {
            exists: !!lipsyncManager,
            type: typeof lipsyncManager,
            viseme: lipsyncManager?.viseme,
            features: !!lipsyncManager?.features,
            processAudio: typeof lipsyncManager?.processAudio
        });

        // Stop any current speech and fake lipsync
        speechSynthesis.cancel();
        if (fakeLipsyncRef.current) {
            clearInterval(fakeLipsyncRef.current);
            fakeLipsyncRef.current = null;
        }

        setIsPlaying(true);

        try {
            // Create speech utterance
            const utterance = new SpeechSynthesisUtterance(text);
            speechUtteranceRef.current = utterance;

            // Set voice
            const voice = voices.find(v => v.name === selectedVoice);
            if (voice) {
                utterance.voice = voice;
            }

            // Set properties
            utterance.rate = rate;
            utterance.pitch = pitch;
            utterance.volume = volume;

            utterance.onstart = () => {
                console.log('🔊 Bắt đầu phát âm');
                // DON'T start fake lipsync here - already started immediately
                console.log('ℹ️ Fake lipsync đã được khởi tạo trước đó');
            };

            utterance.onend = () => {
                setIsPlaying(false);
                speechUtteranceRef.current = null;
                // Stop fake lipsync
                if (fakeLipsyncRef.current) {
                    clearInterval(fakeLipsyncRef.current);
                    fakeLipsyncRef.current = null;
                }
                if (lipsyncManager) {
                    lipsyncManager.viseme = VISEMES.sil;
                    if (lipsyncManager.features) {
                        lipsyncManager.features.volume = 0;
                    }
                }
                console.log('✅ Hoàn thành phát âm');
            };

            utterance.onerror = (error) => {
                setIsPlaying(false);
                speechUtteranceRef.current = null;
                // Stop fake lipsync on error
                if (fakeLipsyncRef.current) {
                    clearInterval(fakeLipsyncRef.current);
                    fakeLipsyncRef.current = null;
                }
                console.error('❌ Lỗi phát âm:', error);
            };

            // Speak the text
            speechSynthesis.speak(utterance);

            // Start direct viseme update immediately (don't wait for onstart)
            if (enableFakeLipsync) {
                console.log('🎯 Bắt đầu direct viseme update ngay lập tức...');
                startDirectVisemeUpdate(text, rate);
            }

        } catch (error) {
            console.error('Lỗi tạo speech:', error);
            setIsPlaying(false);
        }
    };

    const stopSpeech = () => {
        speechSynthesis.cancel();
        setIsPlaying(false);
        speechUtteranceRef.current = null;

        // Stop direct viseme update
        if (fakeLipsyncRef.current) {
            clearInterval(fakeLipsyncRef.current);
            fakeLipsyncRef.current = null;
            console.log('⏹️ Đã dừng direct viseme update');
        }

        // Reset lipsync manager
        if (lipsyncManager) {
            lipsyncManager.viseme = VISEMES.sil;
            if (lipsyncManager.features) {
                lipsyncManager.features.volume = 0;
            }
            console.log('🔄 Reset lipsyncManager về silence');
        }

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (fakeLipsyncRef.current) {
                clearInterval(fakeLipsyncRef.current);
            }
            if (speechUtteranceRef.current) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    const predefinedTexts = [
        "Xin chào! Tôi là AI avatar của bạn.",
        "Tôi có thể đồng bộ môi với giọng nói một cách tự nhiên.",
        "Hãy thử nhập văn bản khác để xem tôi hoạt động.",
        "Công nghệ lipsync này sử dụng Web Audio API.",
        "Bạn có thể điều chỉnh tốc độ, cao độ và âm lượng.",
        "Chúc bạn có trải nghiệm thú vị với AI avatar!"
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🎤 Text-to-Speech với Lipsync</h3>

            {/* Text Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Văn bản cần đọc:
                </label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Nhập văn bản tiếng Việt hoặc tiếng Anh..."
                />
            </div>

            {/* Quick Text Buttons */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Văn bản mẫu:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {predefinedTexts.map((preText, index) => (
                        <button
                            key={index}
                            onClick={() => setText(preText)}
                            className="p-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded border transition-colors"
                        >
                            {preText.length > 50 ? preText.substring(0, 50) + '...' : preText}
                        </button>
                    ))}
                </div>
            </div>

            {/* Voice Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giọng đọc:
                </label>
                <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang}) {voice.default ? '(mặc định)' : ''}
                        </option>
                    ))}
                </select>
            </div>

            {/* Voice Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tốc độ: {rate}
                    </label>
                    <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={rate}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cao độ: {pitch}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={pitch}
                        onChange={(e) => setPitch(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Âm lượng: {volume}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>
            </div>

            {/* Fake Lipsync Toggle */}
            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={enableFakeLipsync}
                        onChange={(e) => setEnableFakeLipsync(e.target.checked)}
                        className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        🤖 Bật đồng bộ môi thông minh (Fake Lipsync)
                    </span>
                </label>
                <p className="text-xs text-gray-500 ml-6">
                    Mô phỏng chuyển động môi dựa trên nội dung văn bản khi sử dụng Speech Synthesis
                </p>
            </div>

            {/* Control Buttons */}
            <div className="flex space-x-3 mb-4">
                <button
                    onClick={speakText}
                    disabled={isPlaying || !text.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isPlaying ? '🔊 Đang đọc...' : '▶️ Đọc văn bản'}
                </button>

                {isPlaying && (
                    <button
                        onClick={stopSpeech}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        ⏹️ Dừng
                    </button>
                )}

                <button
                    onClick={() => setText('')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                    🗑️ Xóa
                </button>

                {/* Test Lipsync Button */}
                <button
                    onClick={() => {
                        console.log('🧪 Test lipsync manager...');
                        if (lipsyncManager) {
                            // Test cycle through different visemes
                            const testVisemes = [VISEMES.aa, VISEMES.E, VISEMES.I, VISEMES.O, VISEMES.U, VISEMES.PP, VISEMES.FF, VISEMES.SS, VISEMES.sil];
                            let index = 0;

                            const testInterval = setInterval(() => {
                                if (index < testVisemes.length) {
                                    const viseme = testVisemes[index];
                                    lipsyncManager.viseme = viseme;
                                    lipsyncManager.features = {
                                        volume: viseme === VISEMES.sil ? 0 : 0.5,
                                        centroid: viseme === VISEMES.sil ? 0 : 3000,
                                        bands: Array(7).fill(viseme === VISEMES.sil ? 0 : 0.3),
                                        deltaBands: Array(7).fill(0)
                                    };
                                    console.log(`🎭 Test viseme: ${viseme}`);
                                    index++;
                                } else {
                                    clearInterval(testInterval);
                                    lipsyncManager.viseme = VISEMES.sil;
                                    lipsyncManager.features = { volume: 0, centroid: 0, bands: Array(7).fill(0), deltaBands: Array(7).fill(0) };
                                    console.log('✅ Test hoàn thành');
                                }
                            }, 500);
                        } else {
                            console.error('❌ LipsyncManager không tồn tại');
                        }
                    }}
                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
                    disabled={isPlaying}
                >
                    🧪 Test
                </button>
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p className="mb-1">
                    <strong>💡 Lưu ý:</strong> Chức năng này sử dụng Speech Synthesis API của trình duyệt.
                </p>
                <p className="mb-1">
                    • Chất lượng giọng đọc phụ thuộc vào hệ điều hành và trình duyệt
                </p>
                <p className="mb-1">
                    • {enableFakeLipsync ? '🤖' : '❌'} <strong>Fake Lipsync:</strong> {enableFakeLipsync ? 'ĐANG BẬT' : 'TẮT'} - Model 3D sẽ {enableFakeLipsync ? 'mô phỏng chuyển động môi dựa trên nội dung văn bản' : 'không có chuyển động môi'}
                </p>
                <p className="mb-1">
                    • Fake Lipsync phân tích văn bản và tạo chuỗi viseme tương ứng với âm thanh
                </p>
                <p>
                    • Để có chất lượng tốt hơn, hãy sử dụng file audio được tạo sẵn trong DialoguePlayer
                </p>
            </div>

            {/* Status Display */}
            {isPlaying && enableFakeLipsync && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2">
                        <div className="animate-pulse w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-700">
                            🔊 Đang phát speech với fake lipsync simulation
                        </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                        Nhân vật 3D đang mô phỏng chuyển động môi theo từng từ: "{text.substring(0, 50)}{text.length > 50 ? '...' : ''}"
                    </p>
                    <div className="text-xs text-gray-500 mt-2 font-mono">
                        🔍 Debug: Mở Console (F12) để xem chi tiết viseme updates
                    </div>
                </div>
            )}

            {/* Debug Info */}
            <div className="mt-4 p-2 bg-gray-50 border rounded-md text-xs">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <strong>🎤 Speech Status:</strong> {isPlaying ? '🔊 Đang phát' : '⏹️ Dừng'}
                    </div>
                    <div>
                        <strong>🤖 Fake Lipsync:</strong> {enableFakeLipsync ? '✅ BẬT' : '❌ TẮT'}
                    </div>
                    <div>
                        <strong>🎭 LipsyncManager:</strong> {lipsyncManager ? '✅ OK' : '❌ Lỗi'}
                    </div>
                    <div>
                        <strong>📝 Text Length:</strong> {text.length} chars
                    </div>
                </div>
            </div>
        </div>
    );
};