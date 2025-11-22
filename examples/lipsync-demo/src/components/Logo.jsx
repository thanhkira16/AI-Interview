import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ to = "/dashboard", className = "", textColor = "text-gray-900" }) => {
    return (
        <Link to={to} className={`flex items-center space-x-3 hover:opacity-80 transition-opacity ${className}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T1</span>
            </div>
            <span className={`text-xl font-semibold ${textColor}`}>Career Compass</span>
        </Link>
    );
};

export default Logo;