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

    // Speech-to-Text states
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('vi-VN');
    const [transcriptionResult, setTranscriptionResult] = useState(null);
    const [webSpeechSupported, setWebSpeechSupported] = useState(false);

    const audioRef = useRef(null);
    const fakeLipsyncRef = useRef(null);
    const speechUtteranceRef = useRef(null);
    const recordingTimerRef = useRef(null);
    const speechRecognitionRef = useRef(null);

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

    // Check Web Speech API support
    useEffect(() => {
        const checkWebSpeechSupport = () => {
            const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
            setWebSpeechSupported(isSupported);
            console.log('🎤 Web Speech API supported:', isSupported);
        };

        checkWebSpeechSupport();
    }, []);

    // Live Speech Recognition (Web Speech API)
    const startLiveRecording = async () => {
        if (!webSpeechSupported) {
            alert('Trình duyệt của bạn không hỗ trợ Web Speech API. Vui lòng sử dụng Chrome, Edge hoặc Safari.');
            return;
        }

        try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            speechRecognitionRef.current = recognition;

            // Configure recognition
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = selectedLanguage;
            recognition.maxAlternatives = 1;

            setIsRecording(true);
            setRecordingTime(0);
            setTranscriptionResult(null);

            let finalTranscript = '';
            let interimTranscript = '';

            recognition.onstart = () => {
                console.log('🎤 Web Speech API bắt đầu...');
            };

            recognition.onresult = (event) => {
                interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                // Update real-time transcription display
                const currentTranscript = (finalTranscript + interimTranscript).trim();
                setTranscriptionResult({
                    success: true,
                    results: [{
                        transcript: currentTranscript,
                        confidence: event.results[event.results.length - 1][0].confidence || 0.8,
                        method: 'Web Speech API (Live)',
                        interim: !event.results[event.results.length - 1].isFinal
                    }],
                    full_transcript: currentTranscript,
                    live_mode: true
                });

                console.log('📝 Live transcript:', currentTranscript);
            };

            recognition.onerror = (event) => {
                console.error('❌ Web Speech API error:', event.error);
                setIsRecording(false);

                let errorMessage = 'Lỗi nhận dạng giọng nói: ';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage += 'Không phát hiện giọng nói. Vui lòng nói vào microphone.';
                        break;
                    case 'audio-capture':
                        errorMessage += 'Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.';
                        break;
                    case 'not-allowed':
                        errorMessage += 'Quyền truy cập microphone bị từ chối.';
                        break;
                    case 'network':
                        errorMessage += 'Lỗi kết nối mạng.';
                        break;
                    default:
                        errorMessage += event.error;
                }

                setTranscriptionResult({ error: errorMessage });

                if (recordingTimerRef.current) {
                    clearInterval(recordingTimerRef.current);
                    recordingTimerRef.current = null;
                }
            };

            recognition.onend = () => {
                console.log('⏹️ Web Speech API kết thúc');
                setIsRecording(false);

                if (recordingTimerRef.current) {
                    clearInterval(recordingTimerRef.current);
                    recordingTimerRef.current = null;
                }

                // Show final result with option to use text
                if (finalTranscript.trim()) {
                    const shouldReplace = window.confirm(
                        `Ghi âm trực tiếp hoàn thành!\n\n"${finalTranscript.trim()}"\n\nBạn có muốn sử dụng văn bản này không?`
                    );

                    if (shouldReplace) {
                        setText(finalTranscript.trim());
                    }
                }
            };

            // Start timer
            recordingTimerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

            recognition.start();
            console.log('🎤 Bắt đầu live recording với Web Speech API...');

        } catch (error) {
            console.error('❌ Lỗi khởi tạo Web Speech API:', error);
            alert('Không thể khởi tạo Web Speech API. Vui lòng thử lại.');
            setIsRecording(false);
        }
    };

    const stopLiveRecording = () => {
        if (speechRecognitionRef.current) {
            speechRecognitionRef.current.stop();
            speechRecognitionRef.current = null;
        }

        setIsRecording(false);

        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }

        console.log('⏹️ Dừng live recording');
    };

    const formatRecordingTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
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
            if (recordingTimerRef.current) {
                clearInterval(recordingTimerRef.current);
            }
            if (speechRecognitionRef.current) {
                speechRecognitionRef.current.stop();
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

    const languageOptions = [
        { code: 'vi-VN', name: 'Tiếng Việt' },
        { code: 'en-US', name: 'English (US)' },
        { code: 'en-GB', name: 'English (UK)' },
        { code: 'zh-CN', name: '中文 (简体)' },
        { code: 'ja-JP', name: '日本語' },
        { code: 'ko-KR', name: '한국어' },
        { code: 'fr-FR', name: 'Français' },
        { code: 'de-DE', name: 'Deutsch' },
        { code: 'es-ES', name: 'Español' },
    ];

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg space-y-6">
            <h3 className="text-xl font-bold text-gray-800">🎤 Speech-to-Text & Text-to-Speech</h3>

            {/* Speech-to-Text Section */}
            <div className="border rounded-lg p-4 bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">🎙️ Ghi âm giọng nói → Văn bản</h4>

                {/* Web Speech API Support Status */}
                <div className="mb-4">
                    <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${webSpeechSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium">
                            🎤 Ghi âm trực tiếp (Web Speech API): {webSpeechSupported ? 'Được hỗ trợ' : 'Không được hỗ trợ'}
                        </span>
                    </div>
                    {!webSpeechSupported && (
                        <p className="text-xs text-red-600 mt-1">
                            ⚠️ Web Speech API không được hỗ trợ. Vui lòng sử dụng Chrome, Edge hoặc Safari.
                        </p>
                    )}
                </div>
                {/* Language Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngôn ngữ nhận dạng:
                    </label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        disabled={isRecording}
                    >
                        {languageOptions.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.name} ({lang.code})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Recording Controls */}
                <div className="flex items-center space-x-3 mb-4">
                    {!isRecording ? (
                        <button
                            onClick={startLiveRecording}
                            disabled={!webSpeechSupported}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <span>🎤</span>
                            <span>Ghi âm trực tiếp</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopLiveRecording}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2"
                        >
                            <span>⏹️</span>
                            <span>Dừng ghi âm</span>
                        </button>
                    )}

                    {isRecording && (
                        <div className="flex items-center space-x-2">
                            <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm font-medium text-red-600">
                                Đang nghe: {formatRecordingTime(recordingTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Transcription Result */}
                {transcriptionResult && (
                    <div className="mt-4">
                        {transcriptionResult.error ? (
                            <div className="p-3 bg-red-100 border border-red-300 rounded-md">
                                <p className="text-sm text-red-700">
                                    ❌ Lỗi: {transcriptionResult.error}
                                </p>
                            </div>
                        ) : (
                            <div className={`p-3 border rounded-md ${transcriptionResult.live_mode
                                ? 'bg-green-50 border-green-300'
                                : 'bg-green-100 border-green-300'
                                }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-green-700">
                                        {transcriptionResult.live_mode ? '🎤 Nhận dạng trực tiếp:' : '✅ Kết quả nhận dạng:'}
                                    </p>
                                    {transcriptionResult.results && transcriptionResult.results[0] && (
                                        <span className="text-xs text-green-600">
                                            {transcriptionResult.results[0].method} |
                                            Tin cậy: {(transcriptionResult.results[0].confidence * 100).toFixed(1)}%
                                            {transcriptionResult.results[0].interim && ' (tạm thời)'}
                                        </span>
                                    )}
                                </div>
                                <p className="text-green-800 font-medium">"{transcriptionResult.full_transcript}"</p>
                                {!transcriptionResult.live_mode && (
                                    <button
                                        onClick={() => setText(transcriptionResult.full_transcript)}
                                        className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                    >
                                        📝 Sử dụng văn bản này
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Recording Tips */}
                <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    <p><strong>💡 Mẹo để ghi âm tốt:</strong></p>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>🎤 <strong>Live Recording:</strong> Nói liên tục, hệ thống sẽ nhận dạng real-time</li>
                        <li>⏸️ Dừng một chút giữa các câu để hệ thống xử lý</li>
                        <li>🔄 Không cần upload file, hoạt động trực tiếp trên trình duyệt</li>
                        <li>📱 Hoạt động offline, không phụ thuộc vào server</li>
                        <li>🔊 Nói rõ ràng và với tốc độ vừa phải</li>
                        <li>🔇 Giảm tiếng ồn xung quanh</li>
                        <li>📏 Đặt micro gần miệng (khoảng 10-15cm)</li>
                        <li>🌍 Chọn ngôn ngữ phù hợp với nội dung bạn nói</li>
                    </ul>
                </div>
            </div>

            {/* Text-to-Speech Section */}
            <div className="border rounded-lg p-4 bg-green-50">
                <h4 className="text-lg font-semibold text-green-800 mb-3">🔊 Văn bản → Giọng nói</h4>

                {/* Text Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Văn bản cần đọc:
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
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
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
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

                {/* Status Display */}
                {isPlaying && enableFakeLipsync && (
                    <div className="p-3 bg-green-100 border border-green-200 rounded-md">
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
            </div>

            {/* Info */}
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                <p className="mb-2">
                    <strong>💡 Hướng dẫn sử dụng:</strong>
                </p>
                <ul className="space-y-1 text-xs">
                    <li>🎤 <strong>Speech-to-Text:</strong> Ghi âm trực tiếp giọng nói và chuyển đổi thành văn bản</li>
                    <li>🔊 <strong>Text-to-Speech:</strong> Chuyển văn bản thành giọng nói với đồng bộ môi</li>
                    <li>🤖 <strong>Fake Lipsync:</strong> Model 3D sẽ mô phỏng chuyển động môi theo nội dung</li>
                    <li>🌐 <strong>Đa ngôn ngữ:</strong> Hỗ trợ tiếng Việt, tiếng Anh và nhiều ngôn ngữ khác</li>
                    <li>📱 <strong>Offline:</strong> Hoạt động hoàn toàn trên trình duyệt, không cần server</li>
                </ul>
            </div>

            {/* Debug Info */}
            <div className="p-2 bg-gray-50 border rounded-md text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                        <strong>🎤 Speech Status:</strong> {isPlaying ? '🔊 Đang phát' : '⏹️ Dừng'}
                    </div>
                    <div>
                        <strong>🎙️ Recording:</strong> {isRecording ? '🔴 Đang ghi' : '⏹️ Dừng'}
                    </div>
                    <div>
                        <strong>🤖 Fake Lipsync:</strong> {enableFakeLipsync ? '✅ BẬT' : '❌ TẮT'}
                    </div>
                    <div>
                        <strong>🎤 Web Speech API:</strong> {webSpeechSupported ? '✅ Hỗ trợ' : '❌ Không hỗ trợ'}
                    </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
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