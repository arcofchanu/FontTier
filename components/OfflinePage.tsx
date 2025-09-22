import React from 'react';
import LiveBackground from './LiveBackground';

interface OfflinePageProps {
  onRetry: () => void;
}

const OfflinePage: React.FC<OfflinePageProps> = ({ onRetry }) => {
  return (
    <div className="h-screen flex items-center justify-center p-8 relative overflow-hidden">
      <LiveBackground />
      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        {/* Glassmorphism Icon */}
        <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/30">
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636L5.636 18.364m0 0L5.636 5.636m0 12.728L18.364 18.364M8.1 8.1a9 9 0 0112.728 0M12 18h.01"
            />
          </svg>
        </div>

        {/* Clean Typography */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-black drop-shadow-2xl" style={{ textShadow: '2px 2px 4px rgba(255,255,255,0.8), 0 0 10px rgba(255,255,255,0.5)' }}>
            No Internet Connection
          </h1>
          <p className="text-black text-base leading-relaxed drop-shadow-xl" style={{ textShadow: '1px 1px 3px rgba(255,255,255,0.8), 0 0 8px rgba(255,255,255,0.4)' }}>
            You're offline
          </p>
        </div>

        {/* Glassmorphism Action Section */}
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full bg-white/25 backdrop-blur-lg text-black px-4 py-3 rounded-md font-bold hover:bg-white/35 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-transparent border border-white/40 text-base shadow-xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.3)', textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}
          >
            Try Again
          </button>
          
          <p className="text-sm text-black font-medium" style={{ textShadow: '1px 1px 2px rgba(255,255,255,0.8)' }}>
            Continuen offline or check your connection
          </p>
        </div>

        {/* Simple Status Indicator */}
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-1 h-1 bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;