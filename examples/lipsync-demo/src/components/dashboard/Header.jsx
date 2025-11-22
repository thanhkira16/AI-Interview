import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Link to="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T1</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Career Compass</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/dashboard" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                            Dashboard
                        </Link>
                        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
                            Về chúng tôi
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
                            Affiliate
                        </a>
                        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors">
                            Cách hoạt động
                        </a>
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105">
                            Nâng cấp
                        </button>
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;