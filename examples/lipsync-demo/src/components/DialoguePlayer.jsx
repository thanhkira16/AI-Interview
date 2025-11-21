import { useState, useEffect } from 'react';
import { lipsyncManager } from '../App';

export const DialoguePlayer = () => {
    const [dialogues, setDialogues] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('greeting');
    const [selectedDialogue, setSelectedDialogue] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentAudio, setCurrentAudio] = useState(null);

    // Load dialogues from JSON file
    useEffect(() => {
        fetch('/dialogues.json')
            .then(response => response.json())
            .then(data => {
                setDialogues(data);
                // Set first dialogue as default
                if (data.conversations.length > 0) {
                    setSelectedDialogue(data.conversations[0].dialogues[0]);
                }
            })
            .catch(error => console.error('Error loading dialogues:', error));
    }, []);

    // Stop audio when component unmounts
    useEffect(() => {
        return () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
        };
    }, [currentAudio]);

    const playDialogue = (dialogue) => {
        // Stop current audio if playing
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        const audio = new Audio(dialogue.audioFile);
        setCurrentAudio(audio);

        // Connect audio to lipsync
        lipsyncManager.connectAudio(audio);

        audio.onplay = () => setIsPlaying(true);
        audio.onended = () => {
            setIsPlaying(false);
            setCurrentAudio(null);
        };
        audio.onerror = (e) => {
            console.error('Error playing audio:', e);
            setIsPlaying(false);
            setCurrentAudio(null);
        };

        audio.play();
        setSelectedDialogue(dialogue);
    };

    const stopAudio = () => {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            setIsPlaying(false);
            setCurrentAudio(null);
        }
    };

    if (!dialogues) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-center mt-2 text-gray-600">Đang tải đoạn hội thoại...</p>
            </div>
        );
    }

    const selectedCategoryData = dialogues.conversations.find(cat => cat.id === selectedCategory);

    return (
        <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🎭 Trình phát đoạn hội thoại</h2>

            {/* Category Selector */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn danh mục:
                </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {dialogues.conversations.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.title} - {category.description}
                        </option>
                    ))}
                </select>
            </div>

            {/* Current Dialogue Display */}
            {selectedDialogue && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-blue-800">
                            {selectedDialogue.id.replace(/_/g, ' ').toUpperCase()}
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => playDialogue(selectedDialogue)}
                                disabled={isPlaying}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 text-sm"
                            >
                                {isPlaying ? '🔊 Đang phát' : '▶️ Phát'}
                            </button>
                            {isPlaying && (
                                <button
                                    onClick={stopAudio}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                >
                                    ⏹️ Dừng
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">
                        <strong>Nội dung:</strong> "{selectedDialogue.text}"
                    </p>
                    <div className="text-xs text-gray-500 space-x-4">
                        <span>⏱️ {selectedDialogue.duration}s</span>
                        <span>🗣️ {selectedDialogue.language}</span>
                        {selectedDialogue.emotion && <span>😊 {selectedDialogue.emotion}</span>}
                        {selectedDialogue.phoneme && <span>🔤 /{selectedDialogue.phoneme}/</span>}
                    </div>
                </div>
            )}

            {/* Dialogue List */}
            {selectedCategoryData && (
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">
                        {selectedCategoryData.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{selectedCategoryData.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {selectedCategoryData.dialogues.map((dialogue) => (
                            <div
                                key={dialogue.id}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${selectedDialogue?.id === dialogue.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedDialogue(dialogue)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-gray-800 text-sm">
                                        {dialogue.id.replace(/_/g, ' ').toUpperCase()}
                                    </h4>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playDialogue(dialogue);
                                        }}
                                        disabled={isPlaying && selectedDialogue?.id === dialogue.id}
                                        className="text-lg hover:scale-110 transition-transform disabled:opacity-50"
                                    >
                                        {isPlaying && selectedDialogue?.id === dialogue.id ? '🔊' : '▶️'}
                                    </button>
                                </div>

                                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                                    {dialogue.text.substring(0, 80)}...
                                </p>

                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>⏱️ {dialogue.duration}s</span>
                                    {dialogue.emotion && <span>😊</span>}
                                    {dialogue.phoneme && <span>🔤</span>}
                                    {dialogue.type === 'system' && <span>⚙️</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistics */}
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2">📊 Thống kê</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                        <span className="font-medium">Tổng đoạn hội thoại:</span>
                        <br />
                        <span className="text-blue-600 font-bold">{dialogues.metadata.total_dialogues}</span>
                    </div>
                    <div>
                        <span className="font-medium">Danh mục:</span>
                        <br />
                        <span className="text-green-600 font-bold">{dialogues.conversations.length}</span>
                    </div>
                    <div>
                        <span className="font-medium">Ngôn ngữ:</span>
                        <br />
                        <span className="text-purple-600 font-bold">{dialogues.metadata.languages.join(', ')}</span>
                    </div>
                    <div>
                        <span className="font-medium">Phiên bản:</span>
                        <br />
                        <span className="text-orange-600 font-bold">{dialogues.metadata.version}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};