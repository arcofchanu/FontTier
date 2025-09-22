import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { StyleOptions } from '../types';

interface PreviewPopupProps {
  isVisible: boolean;
  text: string;
  styles: StyleOptions;
  fontFamily: string;
  isTransparent: boolean;
  backgroundImage: string | null;
}

const POPUP_WIDTH_PX = 192; // Corresponds to Tailwind's w-48
const PREVIEW_BASE_WIDTH = 896;
const PREVIEW_BASE_HEIGHT = 560;

const scaleFactor = POPUP_WIDTH_PX / PREVIEW_BASE_WIDTH;

const PreviewPopup: React.FC<PreviewPopupProps> = ({
  isVisible,
  text,
  styles,
  fontFamily,
  isTransparent,
  backgroundImage,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const textStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${styles.fontSize}px`,
    color: styles.color,
    letterSpacing: `${styles.letterSpacing}px`,
    lineHeight: styles.lineHeight,
    fontWeight: styles.isBold ? 'bold' : 'normal',
    fontStyle: styles.isItalic ? 'italic' : 'normal',
    textDecoration: styles.isUnderline ? 'underline' : 'none',
    textShadow: styles.shadowEnabled ? `2px 2px 4px ${styles.shadowColor}` : 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: styles.textAlign,
    width: `${styles.textWidth}%`,
    transform: `translate(${styles.positionX}px, ${styles.positionY}px)`,
  };

  const previewContainerStyle: React.CSSProperties = {
    transform: `scale(${scaleFactor})`,
    transformOrigin: 'top left',
    width: `${PREVIEW_BASE_WIDTH}px`,
    height: `${PREVIEW_BASE_HEIGHT}px`,
  };
  
  if (backgroundImage) {
    previewContainerStyle.backgroundImage = `url(${backgroundImage})`;
    previewContainerStyle.backgroundSize = 'contain';
    previewContainerStyle.backgroundPosition = 'center';
    previewContainerStyle.backgroundRepeat = 'no-repeat';
  }

  const previewContainerClassName = `flex items-center justify-center rounded-md transition-colors ${
    !backgroundImage && (isTransparent ? 'checkerboard' : 'bg-bg-primary')
  }`;
  
  const popupContent = (
    <div
      className={`fixed bottom-4 left-4 z-50 w-48 bg-bg-card/80 backdrop-blur-lg rounded-xl shadow-2xl border border-border-primary/50 transition-all duration-300 pointer-events-none overflow-hidden aspect-[896/560] ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-hidden={!isVisible}
    >
      <div
        style={previewContainerStyle}
        className={previewContainerClassName}
      >
        <p style={textStyle}>
          {text || "Your text will appear here"}
        </p>
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return ReactDOM.createPortal(popupContent, document.body);
};

export default PreviewPopup;