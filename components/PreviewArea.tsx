import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { StyleOptions, TextBox } from '../types';
import IconButton from './IconButton';
import { SettingsIcon } from './icons/SettingsIcon';
import { prepareElementForExport } from '../utils/exportUtils';

// This tells TypeScript that htmlToImage exists globally, loaded from the CDN
declare const htmlToImage: any;

interface PreviewAreaProps {
  textBoxes: TextBox[];
  selectedTextBoxId: string;
  onTextBoxSelect: (id: string) => void;
  onStyleChange: <K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => void;
  isTransparent: boolean;
  backgroundImage: string | null;
  onOpenExportModal: () => void;
  isAdjustingTextBox?: boolean;
}

export interface PreviewAreaRef {
  generateImage: (format: 'png' | 'jpeg', options: { width: number; height: number; quality?: number }) => Promise<string | null>;
  generateSvg: (options: { width: number; height: number }) => Promise<string | null>;
}

const PreviewArea = forwardRef<PreviewAreaRef, PreviewAreaProps>(({ 
  textBoxes, 
  selectedTextBoxId, 
  onTextBoxSelect, 
  onStyleChange, 
  isTransparent, 
  backgroundImage, 
  onOpenExportModal, 
  isAdjustingTextBox 
}, ref) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTextBoxId, setHoveredTextBoxId] = useState<string | null>(null);
  const [isExportMode, setIsExportMode] = useState(false);
  const [dragData, setDragData] = useState<{
    textBoxId: string;
    startX: number;
    startY: number;
    initialPosX: number;
    initialPosY: number;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    generateImage: async (format: 'png' | 'jpeg', options: { width: number; height: number; quality?: number }) => {
      if (!previewRef.current) return null;
      
      // Clear all interactive states before export to ensure no borders show
      const originalSelectedId = selectedTextBoxId;
      const originalHoveredId = hoveredTextBoxId;
      setIsExportMode(true);
      setHoveredTextBoxId(null);
      if (onTextBoxSelect) onTextBoxSelect(''); // Clear selection
      
      // Small delay to ensure state updates are applied
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const node = previewRef.current;
      
      // Store original styles
      const originalTransform = node.style.transform;
      const originalClassName = node.className;
      const originalBgStyle = node.style.backgroundColor;
      const originalWidth = node.style.width;
      const originalHeight = node.style.height;

      try {
        // Add export mode class and remove border classes
        node.classList.add('export-mode');
        // Remove ALL border and styling classes for clean export
        node.className = node.className
          .replace(/\bborder\b[\s\w\-\/]*/g, '')  // Remove all border classes
          .replace(/\brounded\b[\s\w\-]*/g, '')   // Remove all rounded classes
          .replace(/\bp-\d+/g, '')                // Remove padding classes
          .replace(/\bsm:p-\d+/g, '')             // Remove responsive padding
          .replace(/\btransition\b[\s\w\-]*/g, '') // Remove transitions
          .trim()
          + ' export-mode';
        
        // Force remove borders via inline styles as backup
        node.style.border = 'none';
        node.style.borderRadius = '0';
        node.style.padding = '0';
        node.style.margin = '0';
        node.style.boxShadow = 'none';
        
        // Reset transform and set exact dimensions
        node.style.transform = 'none';
        node.style.width = `${options.width}px`;
        node.style.height = `${options.height}px`;
        
        // Handle background transparency
        if (isTransparent) {
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = 'transparent';
        } else if (!backgroundImage) {
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = '#F0F8FF'; // Use the vibrant bg-primary color
        } else {
          // Keep background image but make container transparent
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = 'transparent';
        }

        // Wait for any fonts to load and prepare element
        await prepareElementForExport(node);

        // Configure export options
        const exportOptions = {
          width: options.width,
          height: options.height,
          backgroundColor: (isTransparent || backgroundImage) ? null : '#F0F8FF',
          pixelRatio: 2, // Higher quality export
          skipAutoScale: true,
          useCORS: true,
          allowTaint: false,
          skipFonts: false, // Include fonts in export
          cacheBust: true, // Prevent caching issues
          ...(format === 'jpeg' && { quality: options.quality || 0.95 }),
        };

        // Generate image
        if (format === 'png') {
          return await htmlToImage.toPng(node, exportOptions);
        } else {
          return await htmlToImage.toJpeg(node, exportOptions);
        }
      } catch (error) {
        console.error('Image generation failed:', error);
        
        // Provide specific error feedback
        if (error.message.includes('CORS')) {
          console.warn('CORS error detected, trying fallback approach...');
        } else if (error.message.includes('canvas')) {
          console.warn('Canvas error detected, trying alternative method...');
        }
        
        // Fallback: Try with canvas approach and simplified options
        try {
          const fallbackOptions = {
            width: options.width,
            height: options.height,
            backgroundColor: (isTransparent || backgroundImage) ? '#FFFFFF' : '#F0F8FF',
            pixelRatio: 1, // Reduced for compatibility
            useCORS: false, // Disable CORS for fallback
          };
          
          const canvas = await htmlToImage.toCanvas(node, fallbackOptions);
          
          return format === 'png' 
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', options.quality || 0.95);
        } catch (fallbackError) {
          console.error('Fallback export also failed:', fallbackError);
          throw new Error(`Export failed: ${fallbackError.message}. Please try a different format or smaller dimensions.`);
        }
      } finally {
        // Remove export mode class
        node.classList.remove('export-mode');
        
        // Restore original styles
        node.style.transform = originalTransform;
        node.className = originalClassName;
        node.style.backgroundColor = originalBgStyle;
        node.style.width = originalWidth;
        node.style.height = originalHeight;
        
        // Clear forced inline styles
        node.style.border = '';
        node.style.borderRadius = '';
        node.style.padding = '';
        node.style.margin = '';
        node.style.boxShadow = '';
        
        // Restore interactive states
        setIsExportMode(false);
        setHoveredTextBoxId(originalHoveredId);
        if (onTextBoxSelect && originalSelectedId) onTextBoxSelect(originalSelectedId);
      }
    },

    generateSvg: async (options: { width: number; height: number }) => {
      if (!previewRef.current) return null;
      
      // Clear all interactive states before export to ensure no borders show
      const originalSelectedId = selectedTextBoxId;
      const originalHoveredId = hoveredTextBoxId;
      setIsExportMode(true);
      setHoveredTextBoxId(null);
      if (onTextBoxSelect) onTextBoxSelect(''); // Clear selection
      
      // Small delay to ensure state updates are applied
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const node = previewRef.current;
      
      // Store original styles
      const originalTransform = node.style.transform;
      const originalClassName = node.className;
      const originalBgStyle = node.style.backgroundColor;
      const originalWidth = node.style.width;
      const originalHeight = node.style.height;

      try {
        // Add export mode class and remove border classes
        node.classList.add('export-mode');
        // Remove ALL border and styling classes for clean export
        node.className = node.className
          .replace(/\bborder\b[\s\w\-\/]*/g, '')  // Remove all border classes
          .replace(/\brounded\b[\s\w\-]*/g, '')   // Remove all rounded classes
          .replace(/\bp-\d+/g, '')                // Remove padding classes
          .replace(/\bsm:p-\d+/g, '')             // Remove responsive padding
          .replace(/\btransition\b[\s\w\-]*/g, '') // Remove transitions
          .trim()
          + ' export-mode';
        
        // Force remove borders via inline styles as backup
        node.style.border = 'none';
        node.style.borderRadius = '0';
        node.style.padding = '0';
        node.style.margin = '0';
        node.style.boxShadow = 'none';
        
        // Reset transform and set exact dimensions
        node.style.transform = 'none';
        node.style.width = `${options.width}px`;
        node.style.height = `${options.height}px`;
        
        // Handle background
        if (isTransparent) {
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = 'transparent';
        } else if (!backgroundImage) {
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = '#F0F8FF';
        } else {
          // Keep background image but make container transparent
          node.className = originalClassName.replace('checkerboard', '');
          node.style.backgroundColor = 'transparent';
        }

        // Wait for fonts and images to load
        await prepareElementForExport(node);

        return await htmlToImage.toSvg(node, {
          width: options.width,
          height: options.height,
          backgroundColor: (isTransparent || backgroundImage) ? null : '#F0F8FF',
        });
      } catch (error) {
        console.error('SVG generation failed:', error);
        return null;
      } finally {
        // Remove export mode class
        node.classList.remove('export-mode');
        
        // Restore original styles
        node.style.transform = originalTransform;
        node.className = originalClassName;
        node.style.backgroundColor = originalBgStyle;
        node.style.width = originalWidth;
        node.style.height = originalHeight;
        
        // Clear forced inline styles
        node.style.border = '';
        node.style.borderRadius = '';
        node.style.padding = '';
        node.style.margin = '';
        node.style.boxShadow = '';
        
        // Restore interactive states
        setIsExportMode(false);
        setHoveredTextBoxId(originalHoveredId);
        if (onTextBoxSelect && originalSelectedId) onTextBoxSelect(originalSelectedId);
      }
    },
  }));

  useEffect(() => {
    const wrapperNode = wrapperRef.current;
    if (!wrapperNode) return;

    const calculateScale = () => {
      if (wrapperNode) {
        const wrapperWidth = wrapperNode.offsetWidth;
        const newScale = wrapperWidth / 896;
        setScale(newScale < 1 ? newScale : 1);
      }
    };

    const resizeObserver = new ResizeObserver(calculateScale);
    resizeObserver.observe(wrapperNode);
    calculateScale();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Drag handlers for moving text boxes
  const handleMouseDown = useCallback((e: React.MouseEvent, textBoxId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (!textBox) return;

    setIsDragging(true);
    setHoveredTextBoxId(null); // Clear hover state when dragging
    setDragData({
      textBoxId,
      startX: e.clientX,
      startY: e.clientY,
      initialPosX: textBox.styles.positionX,
      initialPosY: textBox.styles.positionY,
    });

    // Select the text box when starting to drag it
    onTextBoxSelect(textBoxId);
  }, [textBoxes, onTextBoxSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragData) return;

    const deltaX = (e.clientX - dragData.startX) / scale;
    const deltaY = (e.clientY - dragData.startY) / scale;

    const newPosX = dragData.initialPosX + deltaX;
    const newPosY = dragData.initialPosY + deltaY;

    // Update position for the dragged text box
    if (dragData.textBoxId === selectedTextBoxId) {
      onStyleChange('positionX', newPosX);
      onStyleChange('positionY', newPosY);
    }
  }, [isDragging, dragData, scale, selectedTextBoxId, onStyleChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragData(null);
    document.body.style.cursor = 'default';
  }, []);

  // Touch handlers for mobile drag support
  const handleTouchStart = useCallback((e: React.TouchEvent, textBoxId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const textBox = textBoxes.find(tb => tb.id === textBoxId);
    if (!textBox || e.touches.length !== 1) return;

    const touch = e.touches[0];
    setIsDragging(true);
    setDragData({
      textBoxId,
      startX: touch.clientX,
      startY: touch.clientY,
      initialPosX: textBox.styles.positionX,
      initialPosY: textBox.styles.positionY,
    });

    onTextBoxSelect(textBoxId);
  }, [textBoxes, onTextBoxSelect]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !dragData || e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = (touch.clientX - dragData.startX) / scale;
    const deltaY = (touch.clientY - dragData.startY) / scale;

    const newPosX = dragData.initialPosX + deltaX;
    const newPosY = dragData.initialPosY + deltaY;

    if (dragData.textBoxId === selectedTextBoxId) {
      onStyleChange('positionX', newPosX);
      onStyleChange('positionY', newPosY);
    }
  }, [isDragging, dragData, scale, selectedTextBoxId, onStyleChange]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setDragData(null);
  }, []);

  // Set up global mouse and touch event listeners
  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = 'grabbing';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Handle text box click for selection (when not dragging)
  const handleTextBoxClick = (textBoxId: string) => {
    if (!isDragging) {
      onTextBoxSelect(textBoxId);
    }
  };

  const handleTextBoxMouseEnter = (textBoxId: string) => {
    setHoveredTextBoxId(textBoxId);
  };

  const handleTextBoxMouseLeave = () => {
    setHoveredTextBoxId(null);
  };

  const previewContainerStyle: React.CSSProperties = {
    width: '896px',
    height: '560px',
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    position: 'relative',
  };

  if (backgroundImage) {
    previewContainerStyle.backgroundImage = `url(${backgroundImage})`;
    previewContainerStyle.backgroundSize = 'contain';
    previewContainerStyle.backgroundPosition = 'center';
    previewContainerStyle.backgroundRepeat = 'no-repeat';
  }

  const previewContainerClassName = `flex items-center justify-center p-4 sm:p-8 rounded-md border border-border-primary transition-colors ${backgroundImage ? '' : (isTransparent ? 'checkerboard' : 'bg-bg-primary')}`;

  return (
    <div className="bg-bg-card/60 backdrop-blur-xl border border-border-primary/50 p-4 sm:p-6 rounded-2xl shadow-lg">
      <div 
        ref={wrapperRef} 
        className="w-full overflow-hidden" 
        style={{ height: 560 * scale }}
      >
        <div
          ref={previewRef}
          style={previewContainerStyle}
          className={previewContainerClassName}
        >
          {textBoxes.map((textBox) => {
            const isSelected = textBox.id === selectedTextBoxId;
            const isHovered = textBox.id === hoveredTextBoxId;
            const isDraggingThis = isDragging && dragData?.textBoxId === textBox.id;
            // Never show borders during export
            const showBorder = !isExportMode && (isSelected || isHovered || isDraggingThis);
            
            const wrapperStyle: React.CSSProperties = {
              width: `${textBox.styles.textWidth}%`,
              transform: `translate(${textBox.styles.positionX}px, ${textBox.styles.positionY}px)`,
              position: 'absolute',
              cursor: isDragging && dragData?.textBoxId === textBox.id ? 'grabbing' : 'grab',
              touchAction: 'none',
              userSelect: 'none',
              perspective: textBox.styles.is3DEnabled ? `${textBox.styles.perspective}px` : 'none',
            };

            // Create 3D transform string
            const create3DTransform = () => {
              if (!textBox.styles.is3DEnabled) return 'none';
              
              const transforms = [];
              if (textBox.styles.rotateX !== 0) transforms.push(`rotateX(${textBox.styles.rotateX}deg)`);
              if (textBox.styles.rotateY !== 0) transforms.push(`rotateY(${textBox.styles.rotateY}deg)`);
              if (textBox.styles.rotateZ !== 0) transforms.push(`rotateZ(${textBox.styles.rotateZ}deg)`);
              if (textBox.styles.skewX !== 0) transforms.push(`skewX(${textBox.styles.skewX}deg)`);
              if (textBox.styles.skewY !== 0) transforms.push(`skewY(${textBox.styles.skewY}deg)`);
              if (textBox.styles.depth3D !== 0) transforms.push(`translateZ(${textBox.styles.depth3D}px)`);
              
              return transforms.length > 0 ? transforms.join(' ') : 'none';
            };

            // Create gradient background or solid color
            const getTextColor = () => {
              if (textBox.styles.gradientEnabled) {
                return 'transparent';
              }
              return textBox.styles.color;
            };

            const getTextBackground = () => {
              if (textBox.styles.gradientEnabled) {
                return `linear-gradient(45deg, ${textBox.styles.gradientColor1}, ${textBox.styles.gradientColor2})`;
              }
              return 'none';
            };

            const textStyle: React.CSSProperties = {
              fontFamily: textBox.fontFamily,
              fontSize: `${textBox.styles.fontSize}px`,
              color: getTextColor(),
              background: getTextBackground(),
              backgroundClip: textBox.styles.gradientEnabled ? 'text' : 'initial',
              WebkitBackgroundClip: textBox.styles.gradientEnabled ? 'text' : 'initial',
              letterSpacing: `${textBox.styles.letterSpacing}px`,
              lineHeight: textBox.styles.lineHeight,
              fontWeight: textBox.styles.isBold ? 'bold' : 'normal',
              fontStyle: textBox.styles.isItalic ? 'italic' : 'normal',
              textDecoration: textBox.styles.isUnderline ? 'underline' : 'none',
              textShadow: textBox.styles.shadowEnabled ? `2px 2px 4px ${textBox.styles.shadowColor}` : 'none',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              textAlign: textBox.styles.textAlign,
              width: '100%',
              cursor: 'inherit',
              transform: create3DTransform(),
              transformStyle: textBox.styles.is3DEnabled ? 'preserve-3d' : 'flat',
              transformOrigin: 'center center',
            };

            return (
              <div
                key={textBox.id}
                style={wrapperStyle}
                onMouseDown={(e) => handleMouseDown(e, textBox.id)}
                onTouchStart={(e) => handleTouchStart(e, textBox.id)}
                onClick={() => handleTextBoxClick(textBox.id)}
                onMouseEnter={() => handleTextBoxMouseEnter(textBox.id)}
                onMouseLeave={handleTextBoxMouseLeave}
                className="group"
              >
                <p style={textStyle}>
                  {textBox.text || "Your text will appear here"}
                </p>
                
                {/* Selection border - only show when selected, hovered, or dragging */}
                {showBorder && isSelected && (
                  <div className="absolute inset-0 ring-2 ring-brand-primary ring-dashed pointer-events-none export-hidden" />
                )}
                
                {/* Hover border - show when hovered but not selected */}
                {showBorder && isHovered && !isSelected && (
                  <div className="absolute inset-0 ring-2 ring-brand-secondary/60 ring-dashed pointer-events-none export-hidden" />
                )}
                
                {/* Adjustment border - show when adjusting */}
                {isSelected && isAdjustingTextBox && (
                  <div className="absolute -inset-1 ring-2 ring-brand-primary/50 ring-solid pointer-events-none export-hidden" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-6">
        <IconButton
          text="Export"
          icon={<SettingsIcon />}
          onClick={onOpenExportModal}
          fullWidth
        />
      </div>
    </div>
  );
});

export default PreviewArea;