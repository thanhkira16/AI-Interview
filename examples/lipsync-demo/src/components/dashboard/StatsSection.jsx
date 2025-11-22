import React from 'react';

const StatsSection = () => {
    const stats = [
        {
            id: 1,
            title: "Buổi phỏng vấn",
            value: "0",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                    <circle cx="30" cy="25" r="8" fill="#FF6B6B" />
                    <circle cx="70" cy="25" r="8" fill="#4ECDC4" />
                    <rect x="20" y="40" width="60" height="40" rx="8" fill="#45B7D1" />
                    <circle cx="25" cy="20" r="2" fill="#333" />
                    <circle cx="35" cy="20" r="2" fill="#333" />
                    <path d="M25 28 Q30 32 35 28" stroke="#333" strokeWidth="1.5" fill="none" />
                    <circle cx="65" cy="20" r="2" fill="#333" />
                    <circle cx="75" cy="20" r="2" fill="#333" />
                    <path d="M65 28 Q70 32 75 28" stroke="#333" strokeWidth="1.5" fill="none" />
                </svg>
            ),
            bgColor: "bg-red-50",
            borderColor: "border-red-200"
        },
        {
            id: 2,
            title: "Điểm cao nhất",
            value: "0/100",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                    <path d="M50 10 L60 35 L85 35 L65 55 L75 80 L50 65 L25 80 L35 55 L15 35 L40 35 Z" fill="#FFD93D" />
                    <circle cx="50" cy="45" r="15" fill="#FFA726" opacity="0.7" />
                </svg>
            ),
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200"
        },
        {
            id: 3,
            title: "Tỷ lệ phát triển",
            value: "+50%",
            icon: (
                <svg className="w-12 h-12" viewBox="0 0 100 100" fill="none">
                    <path d="M20 70 Q30 60 40 55 T60 45 T80 30" stroke="#4CAF50" strokeWidth="4" fill="none" />
                    <circle cx="20" cy="70" r="3" fill="#4CAF50" />
                    <circle cx="40" cy="55" r="3" fill="#4CAF50" />
                    <circle cx="60" cy="45" r="3" fill="#4CAF50" />
                    <circle cx="80" cy="30" r="3" fill="#4CAF50" />
                    <rect x="15" y="75" width="70" height="8" rx="4" fill="#E8F5E8" />
                    <rect x="25" y="20" width="8" height="65" rx="4" fill="#E8F5E8" />
                    <path d="M75 25 L80 30 L75 35" stroke="#4CAF50" strokeWidth="2" fill="none" />
                </svg>
            ),
            bgColor: "bg-green-50",
            borderColor: "border-green-200"
        }
    ];

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hành trình luyện tập của bạn</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className={`${stat.bgColor} rounded-xl p-6 border ${stat.borderColor} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-shrink-0">
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-gray-900 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 font-medium">
                                {stat.title}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Bắt đầu hành trình của bạn ngay hôm nay!
                        </h3>
                        <p className="text-gray-600">
                            Tìm theo tên buổi phỏng vấn để bắt đầu luyện tập
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm theo tên buổi phỏng vấn"
                                className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all transform hover:scale-105 flex items-center space-x-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Tạo buổi phỏng vấn mới</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsSection;