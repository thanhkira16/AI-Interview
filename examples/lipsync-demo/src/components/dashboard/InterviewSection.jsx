import React from 'react';

const InterviewSection = ({ onCreateInterviewClick }) => {
    return (
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Interview Practice */}
            <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl p-8 text-white relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                {/* Content */}
                <div className="relative z-10">
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                            ⭐ Nổi bật
                        </span>
                    </div>

                    <h2 className="text-3xl font-bold mb-4">
                        Phỏng vấn thực chiến
                    </h2>

                    <p className="text-green-100 mb-6 text-lg">
                        Thực hành phỏng vấn thời gian thực với AI,
                        nhận phản hồi tức thì để phát triển!
                    </p>

                    <button
                        onClick={onCreateInterviewClick}
                        className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2"
                    >
                        <span>Bắt đầu ngay</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Floating elements */}
                <div className="absolute top-8 right-8">
                    <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute top-16 right-12">
                    <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse delay-300"></div>
                </div>
                <div className="absolute top-12 right-20">
                    <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse delay-700"></div>
                </div>

                {/* Character illustration area */}
                <div className="absolute bottom-0 right-0 w-64 h-64 opacity-20">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                        <circle cx="100" cy="70" r="30" fill="currentColor" />
                        <rect x="70" y="100" width="60" height="80" rx="30" fill="currentColor" />
                        <circle cx="85" cy="60" r="3" fill="rgba(0,0,0,0.3)" />
                        <circle cx="115" cy="60" r="3" fill="rgba(0,0,0,0.3)" />
                        <path d="M90 75 Q100 85 110 75" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" />
                    </svg>
                </div>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-6">
                {/* Feature 1 */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Phản hồi thời gian thực
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Nhận ngay những nhận xét chi tiết về câu trả lời của bạn!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 2 */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Phản hồi từ AI
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Trò chuyện tự nhiên, thoải mái cùng công nghệ AI tiên tiến!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feature 3 */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                    <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Phân tích thể hiện
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Điểm số chi tiết và đề xuất cải thiện đánh riêng cho bạn!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InterviewSection;