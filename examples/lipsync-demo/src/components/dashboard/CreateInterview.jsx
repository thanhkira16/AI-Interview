import React, { useState } from 'react';

// Dropdown Component
const Dropdown = ({ label, placeholder, icon, options = [], required = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {label && required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option value="">{placeholder}</option>
                {options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

// TextArea Component
const TextArea = ({ label, placeholder, icon, required = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {label && required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <textarea
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows="3"
                placeholder={placeholder}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
                {icon && (
                    <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9zM15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
                <svg className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </div>
        </div>
    </div>
);

// Language Selector Component
const LanguageSelector = () => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngôn ngữ lúc bắt đầu
        </label>
        <div className="relative">
            <select className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>Tiếng Việt</option>
                <option>English</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

// Section Component
const Section = ({ icon, title, children }) => (
    <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// Main Component
const CreateInterview = ({ isOpen, onClose }) => {
    const [targetAudience, setTargetAudience] = useState(''); // học sinh, sinh viên, người đi làm
    const [selectedBlock, setSelectedBlock] = useState('');
    const [blockScores, setBlockScores] = useState({}); // Store scores for selected block subjects
    const [useCustomSubjects, setUseCustomSubjects] = useState(false);
    const [customSubjects, setCustomSubjects] = useState([{ name: '', score: '' }]);
    const [formData, setFormData] = useState({
        industry: '',
        degree: '',
        interviewType: '',
        jobDescription: '',
        language: 'Tiếng Việt',
        additionalInfo: '',
        interviewName: ''
    });

    // Subject blocks data
    const subjectBlocks = {
        'Nhóm Khối A (Khoa học Tự nhiên)': {
            'A00': [{ name: 'Toán', key: 'toan' }, { name: 'Vật lý', key: 'vat_li' }, { name: 'Hóa học', key: 'hoa_hoc' }],
            'A01': [{ name: 'Toán', key: 'toan' }, { name: 'Vật lý', key: 'vat_li' }, { name: 'Ngoại ngữ', key: 'ngoai_ngu' }],
            'A02': [{ name: 'Toán', key: 'toan' }, { name: 'Vật lý', key: 'vat_li' }, { name: 'Sinh học', key: 'sinh_hoc' }]
        },
        'Nhóm Khối B (Khoa học Sinh học)': {
            'B00': [{ name: 'Toán', key: 'toan' }, { name: 'Hóa học', key: 'hoa_hoc' }, { name: 'Sinh học', key: 'sinh_hoc' }],
            'B02': [{ name: 'Toán', key: 'toan' }, { name: 'Sinh học', key: 'sinh_hoc' }, { name: 'Địa lý', key: 'dia_li' }],
            'B03': [{ name: 'Toán', key: 'toan' }, { name: 'Sinh học', key: 'sinh_hoc' }, { name: 'Ngữ văn', key: 'ngu_van' }]
        },
        'Nhóm Khối C (Khoa học Xã hội)': {
            'C00': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Lịch sử', key: 'lich_su' }, { name: 'Địa lý', key: 'dia_li' }],
            'C01': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Lịch sử', key: 'lich_su' }, { name: 'Ngoại ngữ', key: 'ngoai_ngu' }],
            'C03': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Địa lý', key: 'dia_li' }, { name: 'GDCD', key: 'gdcd' }]
        },
        'Nhóm Khối D (Ngoại ngữ – Xã hội)': {
            'D01': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Ngoại ngữ', key: 'ngoai_ngu' }],
            'D03': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Lịch sử', key: 'lich_su' }],
            'D04': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'GDCD', key: 'gdcd' }],
            'D06': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Địa lý', key: 'dia_li' }],
            'D07': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Hóa học', key: 'hoa_hoc' }],
            'D08': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Sinh học', key: 'sinh_hoc' }],
            'D09': [{ name: 'Ngữ văn', key: 'ngu_van' }, { name: 'Toán', key: 'toan' }, { name: 'Vật lý', key: 'vat_li' }]
        }
    };

    const addCustomSubject = () => {
        setCustomSubjects([...customSubjects, { name: '', score: '' }]);
    };

    const removeCustomSubject = (index) => {
        if (customSubjects.length > 1) {
            setCustomSubjects(customSubjects.filter((_, i) => i !== index));
        }
    };

    const updateCustomSubject = (index, field, value) => {
        const updated = customSubjects.map((subject, i) =>
            i === index ? { ...subject, [field]: value } : subject
        );
        setCustomSubjects(updated);
    };

    const updateBlockScore = (subjectKey, score) => {
        setBlockScores(prev => ({
            ...prev,
            [subjectKey]: score
        }));
    };

    const getSelectedBlockSubjects = () => {
        if (!selectedBlock) return [];

        for (const [groupName, blocks] of Object.entries(subjectBlocks)) {
            if (blocks[selectedBlock]) {
                return blocks[selectedBlock];
            }
        }
        return [];
    };

    const handleBlockSelection = (blockCode) => {
        setSelectedBlock(blockCode);
        // Reset block scores when changing block
        setBlockScores({});
    };

    const isFormValid = () => {
        if (targetAudience === 'học sinh') {
            return formData.interviewName.trim() !== '';
        }
        // For sinh viên and người đi làm, use original validation logic
        return formData.industry && formData.degree && formData.interviewType && formData.jobDescription && formData.interviewName;
    };

    const handleSubmit = () => {
        console.log('Form submitted:', {
            targetAudience,
            selectedBlock,
            blockScores,
            useCustomSubjects,
            customSubjects,
            formData
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyPress = (e, index, field) => {
        if (e.key === 'Enter' && field === 'score' && index === customSubjects.length - 1) {
            e.preventDefault();
            addCustomSubject();
            // Focus on the new subject name field after a short delay
            setTimeout(() => {
                const newIndex = customSubjects.length;
                const nameInput = document.querySelector(`input[data-subject-index="${newIndex}"][data-field="name"]`);
                if (nameInput) {
                    nameInput.focus();
                }
            }, 50);
        } else if (e.key === 'Enter' && field === 'name') {
            e.preventDefault();
            // Focus on the score field of the same subject
            const scoreInput = document.querySelector(`input[data-subject-index="${index}"][data-field="score"]`);
            if (scoreInput) {
                scoreInput.focus();
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
                <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-6 rounded-t-2xl relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Tạo buổi phỏng vấn mới</h1>
                            <p className="text-sm opacity-90">Thiết kế lịch hẹn phỏng vấn hoàn hảo theo ý bạn</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Đối tượng phỏng vấn */}
                    <Section
                        icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>}
                        title="Đối tượng phỏng vấn"
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bạn là<span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-3">
                                {['học sinh', 'sinh viên', 'người đi làm'].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="targetAudience"
                                            value={option}
                                            checked={targetAudience === option}
                                            onChange={(e) => setTargetAudience(e.target.value)}
                                            className="w-4 h-4 text-green-500 focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700 capitalize">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Khối học - chỉ hiển thị cho học sinh */}
                    {targetAudience === 'học sinh' && (
                        <Section
                            icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>}
                            title="Thông tin học tập"
                        >
                            <div className="mb-4">
                                <label className="flex items-center space-x-3 cursor-pointer mb-4">
                                    <input
                                        type="checkbox"
                                        checked={useCustomSubjects}
                                        onChange={(e) => setUseCustomSubjects(e.target.checked)}
                                        className="w-4 h-4 text-green-500 focus:ring-green-500"
                                    />
                                    <span className="text-sm text-gray-700">Tôi chưa biết chọn khối nào</span>
                                </label>
                            </div>

                            {!useCustomSubjects && (
                                <div className="space-y-4">
                                    {Object.entries(subjectBlocks).map(([groupName, blocks]) => (
                                        <div key={groupName} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">{groupName}</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {Object.entries(blocks).map(([blockCode, subjects]) => (
                                                    <label key={blockCode} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                        <input
                                                            type="radio"
                                                            name="selectedBlock"
                                                            value={blockCode}
                                                            checked={selectedBlock === blockCode}
                                                            onChange={(e) => handleBlockSelection(e.target.value)}
                                                            className="w-4 h-4 text-green-500 focus:ring-green-500 mt-1"
                                                        />
                                                        <div>
                                                            <div className="font-medium text-sm">{blockCode}</div>
                                                            <div className="text-xs text-gray-600 space-y-1">
                                                                {subjects.map((subject, idx) => (
                                                                    <div key={idx}>• {subject.name}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Score Input Section for Selected Block */}
                            {selectedBlock && !useCustomSubjects && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h4 className="font-semibold text-gray-800 mb-4 text-green-800">
                                        Nhập điểm cho khối {selectedBlock}
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {getSelectedBlockSubjects().map((subject, index) => (
                                            <div key={subject.key} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {subject.name}
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Nhập điểm"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={blockScores[subject.key] || ''}
                                                    onChange={(e) => updateBlockScore(subject.key, e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Custom Subjects Input */}
                            {useCustomSubjects && (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-800">Nhập điểm các môn học</h4>
                                        <button
                                            type="button"
                                            onClick={addCustomSubject}
                                            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Thêm môn
                                        </button>
                                    </div>
                                    {customSubjects.map((subject, index) => (
                                        <div key={index} className="flex gap-3 items-center">
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    placeholder="Tên môn học"
                                                    value={subject.name}
                                                    onChange={(e) => updateCustomSubject(index, 'name', e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, index, 'name')}
                                                    data-subject-index={index}
                                                    data-field="name"
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    placeholder="Điểm"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={subject.score}
                                                    onChange={(e) => updateCustomSubject(index, 'score', e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, index, 'score')}
                                                    data-subject-index={index}
                                                    data-field="score"
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                />
                                            </div>
                                            {customSubjects.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeCustomSubject(index)}
                                                    className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>
                    )}

                    {/* Thông tin chung - ẩn cho học sinh */}
                    {targetAudience !== 'học sinh' && (
                        <Section
                            icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>}
                            title="Thông tin chung"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Dropdown
                                    label="Ngành nghề"
                                    placeholder="Chọn ngành nghề"
                                    options={['Công nghệ thông tin', 'Kinh doanh', 'Marketing', 'Kế toán', 'Nhân sự']}
                                    required={true}
                                />
                                <Dropdown
                                    label="Bằng cấp"
                                    placeholder="Chọn độ khó"
                                    options={['Thực tập sinh', 'Nhân viên', 'Chuyên viên', 'Quản lý', 'Giám đốc']}
                                    required={true}
                                />
                            </div>

                            <Dropdown
                                label="Loại phỏng vấn"
                                placeholder="Chọn loại phỏng vấn"
                                options={['Phỏng vấn kỹ thuật', 'Phỏng vấn hành vi', 'Phỏng vấn tổng hợp']}
                                required={true}
                            />

                            <TextArea
                                label="Mô tả về vị trí công việc"
                                placeholder="Nhập mô tả về vị trí công việc"
                                icon={true}
                                required={true}
                            />
                        </Section>
                    )}                    {/* Thông tin khác */}
                    <Section
                        icon={<svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>}
                        title="Thông tin khác"
                    >
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên buổi phỏng vấn<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.interviewName}
                                onChange={(e) => setFormData({ ...formData, interviewName: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Nhập tên buổi phỏng vấn"
                            />
                        </div>

                        <LanguageSelector />

                        <TextArea
                            label="Thông tin khác"
                            placeholder="Nhập thông tin khác về buổi phỏng vấn"
                            required={false}
                        />
                    </Section>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${isFormValid()
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!isFormValid()}
                    >
                        ✨ Khởi tạo cuộc phỏng vấn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateInterview;