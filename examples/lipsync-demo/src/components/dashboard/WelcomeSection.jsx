import React from 'react';

const WelcomeSection = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center space-x-4">
               

                {/* Welcome Text */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Chào mừng trở lại
                    </h1>
                    <p className="text-gray-600">
                        Bạn đã sẵn sàng nâng cao kỹ năng phỏng vấn hôm nay chưa?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;