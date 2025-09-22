import React, { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showNotification, setShowNotification] = useState(false);
  const [hasBeenOffline, setHasBeenOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setHasBeenOffline(true);
      setShowNotification(true);
    } else if (hasBeenOffline && isOnline) {
      // Show "back online" message briefly
      setShowNotification(true);
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, hasBeenOffline]);

  if (!showNotification) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 shadow-xl backdrop-blur-lg border ${
        isOnline
          ? 'bg-white/30 text-black border-white/50'
          : 'bg-white/25 text-black border-white/40'
      }`}
      style={{ 
        backgroundColor: isOnline ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.3)',
        textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
      }}
    >
      {isOnline ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-600 rounded-full shadow-lg"></div>
          <span>Connected</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gray-600 rounded-full shadow-lg"></div>
          <span>Offline</span>
        </div>
      )}
    </div>
  );
};

export default OfflineIndicator;