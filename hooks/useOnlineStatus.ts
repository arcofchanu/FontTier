import { useState, useEffect } from 'react';

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Also check periodically by trying to fetch a small resource
    const checkConnection = async () => {
      try {
        // Try to fetch a small image from a reliable source
        const response = await fetch('https://www.google.com/favicon.ico', {
          method: 'HEAD',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    // Check connection every 30 seconds when offline
    const intervalId = setInterval(() => {
      if (!isOnline) {
        checkConnection();
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  return isOnline;
};