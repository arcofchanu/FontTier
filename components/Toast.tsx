import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Trigger fade in animation shortly after mount
    const fadeInTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade out animation to finish before calling onClose
      setTimeout(onClose, 300); 
    }, duration);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  if (!isMounted) {
    return null;
  }
  
  const toastContent = (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] px-5 py-3 bg-bg-card/90 backdrop-blur-lg rounded-full shadow-2xl border border-border-primary/50 text-text-main text-sm font-medium transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );

  return ReactDOM.createPortal(toastContent, document.body);
};

export default Toast;