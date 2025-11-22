import React, { useState } from 'react';
import Header from './dashboard/Header';
import WelcomeSection from './dashboard/WelcomeSection';
import InterviewSection from './dashboard/InterviewSection';
import StatsSection from './dashboard/StatsSection';
import CreateInterview from './dashboard/CreateInterview';

const Dashboard = () => {
    const [isCreateInterviewOpen, setIsCreateInterviewOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <WelcomeSection />

                {/* Interview Practice Section */}
                <InterviewSection onCreateInterviewClick={() => setIsCreateInterviewOpen(true)} />

                {/* Stats and Journey Section */}
                <StatsSection />
            </main>

            {/* Create Interview Modal */}
            {isCreateInterviewOpen && (
                <CreateInterview
                    isOpen={isCreateInterviewOpen}
                    onClose={() => setIsCreateInterviewOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;