import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { StyleOptions, ExportOptions, TextBox } from './types';
import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import PreviewArea, { type PreviewAreaRef } from './components/PreviewArea';
import ExportModal from './components/ExportModal';
import Loader from './components/Loader';
import Toast from './components/Toast';
import LandingPage from './components/LandingPage';
import LiveBackground from './components/LiveBackground';
import SecondaryControls from './components/SecondaryControls';
import Auth from './components/Auth';
import OfflinePage from './components/OfflinePage';
import OfflineIndicator from './components/OfflineIndicator';
import { useOnlineStatus } from './hooks/useOnlineStatus';

const INITIAL_TEXT = `The quick brown fox jumps over the lazy dog.`;

const DEFAULT_STYLES: StyleOptions = {
  fontSize: 64,
  color: '#1E3A8A',
  letterSpacing: 0,
  lineHeight: 1.2,
  isBold: false,
  isItalic: false,
  isUnderline: false,
  shadowColor: '#7C3AED',
  shadowEnabled: false,
  textAlign: 'center',
  textWidth: 100,
  positionX: 0,
  positionY: 0,
  // 3D Effects
  is3DEnabled: false,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  skewX: 0,
  skewY: 0,
  perspective: 1000,
  depth3D: 0,
  gradientEnabled: false,
  gradientColor1: '#EC4899',
  gradientColor2: '#8B5CF6',
};

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  width: 896,
  height: 560,
  format: 'png',
  quality: 0.95,
  maintainAspectRatio: true,
};

function App() {
  const isOnline = useOnlineStatus();
  const [fontFile, setFontFile] = useState<File | null>(null);
  const [defaultFontFamily, setDefaultFontFamily] = useState<string>('Lexend');
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([
    {
      id: '1',
      text: INITIAL_TEXT,
      styles: DEFAULT_STYLES,
      fontFamily: 'Lexend',
    }
  ]);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string>('1');
  const [isTransparent, setIsTransparent] = useState<boolean>(true);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>(DEFAULT_EXPORT_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdjustingTextBox, setIsAdjustingTextBox] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const previewAreaRef = useRef<PreviewAreaRef>(null);

  // Authentication effect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        setIsAuthModalOpen(false);
        // Only auto-open editor if user just signed in and we're on landing page
        if (event === 'SIGNED_IN' && !isEditorVisible) {
          setIsEditorVisible(true);
        }
      } else if (event === 'SIGNED_OUT') {
        // Redirect to landing page when user signs out
        setIsEditorVisible(false);
        setIsAuthModalOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [isEditorVisible]);

  useEffect(() => {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap';

    const loadGoogleFonts = async () => {
      try {
        const response = await fetch(fontUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok for Google Fonts');
        }
        const cssText = await response.text();
        const style = document.createElement('style');
        style.id = 'google-fonts-style-tag';
        style.textContent = cssText;
        document.head.appendChild(style);
      } catch (error) {
        console.error('Failed to load and inject Google Fonts:', error);
      }
    };

    loadGoogleFonts();

    return () => {
      const styleTag = document.getElementById('google-fonts-style-tag');
      if (styleTag) {
        styleTag.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!fontFile) {
      setDefaultFontFamily('Lexend');
      // Update all text boxes to use the default font
      setTextBoxes(prev => prev.map(textBox => ({
        ...textBox,
        fontFamily: 'Lexend'
      })));
      return;
    }

    const newFontFamilyName = `CustomFont-${Date.now()}`;
    const reader = new FileReader();

    reader.onload = (event) => {
      const fontDataUrl = event.target?.result;
      if (typeof fontDataUrl !== 'string') return;

      const existingStyle = document.getElementById('custom-font-style-tag');
      if (existingStyle) {
        existingStyle.remove();
      }

      const newStyle = document.createElement('style');
      newStyle.id = 'custom-font-style-tag';
      newStyle.innerHTML = `
          @font-face {
              font-family: '${newFontFamilyName}';
              src: url('${fontDataUrl}');
          }
      `;
      document.head.appendChild(newStyle);
      
      setDefaultFontFamily(newFontFamilyName);
      // Update all text boxes to use the new font
      setTextBoxes(prev => prev.map(textBox => ({
        ...textBox,
        fontFamily: newFontFamilyName
      })));
    };

    reader.readAsDataURL(fontFile);

    return () => {
      const styleTag = document.getElementById('custom-font-style-tag');
      if (styleTag) {
          document.head.removeChild(styleTag);
      }
    };
  }, [fontFile]);

  // Helper functions for text box management
  const selectedTextBox = textBoxes.find(tb => tb.id === selectedTextBoxId);
  const selectedText = selectedTextBox?.text || '';
  const selectedStyles = selectedTextBox?.styles || DEFAULT_STYLES;
  const selectedFontFamily = selectedTextBox?.fontFamily || defaultFontFamily;

  const handleTextChange = useCallback((newText: string) => {
    setTextBoxes(prev => prev.map(tb => 
      tb.id === selectedTextBoxId ? { ...tb, text: newText } : tb
    ));
  }, [selectedTextBoxId]);

  const handleStyleChange = useCallback(<K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => {
    setTextBoxes(prev => prev.map(tb => 
      tb.id === selectedTextBoxId 
        ? { ...tb, styles: { ...tb.styles, [key]: value } }
        : tb
    ));
  }, [selectedTextBoxId]);

  const handleAddTextBox = useCallback(() => {
    const newId = (textBoxes.length + 1).toString();
    const newTextBox: TextBox = {
      id: newId,
      text: 'New Text',
      styles: { ...DEFAULT_STYLES, positionX: 50, positionY: 50 },
      fontFamily: defaultFontFamily,
    };
    setTextBoxes(prev => [...prev, newTextBox]);
    setSelectedTextBoxId(newId);
  }, [textBoxes.length, defaultFontFamily]);

  const handleFontChange = useCallback((file: File | null) => {
    if (!file) {
      // Reset selected text box to default font
      setTextBoxes(prev => prev.map(tb => 
        tb.id === selectedTextBoxId 
          ? { ...tb, fontFamily: 'Lexend' }
          : tb
      ));
      return;
    }

    const newFontFamilyName = `CustomFont-${selectedTextBoxId}-${Date.now()}`;
    const reader = new FileReader();

    reader.onload = (event) => {
      const fontDataUrl = event.target?.result;
      if (typeof fontDataUrl !== 'string') return;

      // Remove any existing font style for this text box
      const existingStyle = document.getElementById(`custom-font-style-${selectedTextBoxId}`);
      if (existingStyle) {
        existingStyle.remove();
      }

      const newStyle = document.createElement('style');
      newStyle.id = `custom-font-style-${selectedTextBoxId}`;
      newStyle.innerHTML = `
          @font-face {
              font-family: '${newFontFamilyName}';
              src: url('${fontDataUrl}');
          }
      `;
      document.head.appendChild(newStyle);
      
      // Update only the selected text box font
      setTextBoxes(prev => prev.map(tb => 
        tb.id === selectedTextBoxId 
          ? { ...tb, fontFamily: newFontFamilyName }
          : tb
      ));
    };

    reader.readAsDataURL(file);
  }, [selectedTextBoxId]);

  const resetStyles = useCallback(() => {
    setTextBoxes(prev => prev.map(tb => 
      tb.id === selectedTextBoxId 
        ? { ...tb, styles: DEFAULT_STYLES }
        : tb
    ));
  }, [selectedTextBoxId]);
  
  const handleAutoAlign = useCallback(() => {
    if (!selectedTextBox) return;
    
    const lineCount = selectedText.split('\n').length;
    let newAlignment: 'left' | 'center' | 'right' = 'center';

    // Heuristic 1: Content-based for readability
    // If the text is long or has multiple paragraphs, left-align is usually best.
    if (selectedText.length > 80 || lineCount > 2) {
        newAlignment = 'left';
    } else {
        // Heuristic 2: Position-based for shorter text (titles, etc.)
        const previewWidth = 896; // The base width of the preview area
        
        // The text box's center is the preview center plus the X offset
        const textBoxCenter = (previewWidth / 2) + selectedStyles.positionX;
        
        const leftThreshold = previewWidth * 0.4;
        const rightThreshold = previewWidth * 0.6;

        if (textBoxCenter < leftThreshold) {
            newAlignment = 'left';
        } else if (textBoxCenter > rightThreshold) {
            newAlignment = 'right';
        } else {
            newAlignment = 'center';
        }
    }
    handleStyleChange('textAlign', newAlignment);
  }, [selectedText, selectedStyles, selectedTextBox, handleStyleChange]);


  const handleBackgroundImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setBackgroundImage(null);
    }
  };

  const handleStartCreating = () => {
    if (session) {
      setIsEditorVisible(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleExport = async () => {
    if (!previewAreaRef.current) {
      console.error("Preview area is not available.");
      setToastMessage('Export failed: Preview not ready');
      return;
    }

    setIsLoading(true);
    setIsExportModalOpen(false);
    const startTime = Date.now();
  
    const exportTask = async () => {
      const { format, width, height, quality } = exportOptions;
      let dataUrl: string | null = null;
      let filename = 'styled-text';
    
      try {
        if (format === 'svg') {
          dataUrl = await previewAreaRef.current.generateSvg({ width, height });
          filename += '.svg';
        } else {
          dataUrl = await previewAreaRef.current.generateImage(format, { width, height, quality });
          filename += `.${format}`;
        }

        if (!dataUrl) {
          throw new Error("Failed to generate image data");
        }
  
        // Create download
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(dataUrl);
        }, 100);

      } catch (error) {
        console.error('Export task failed:', error);
        throw new Error(`Export failed: ${error.message || 'Unknown error'}`);
      }
    };

    let exportSuccess = false;
    let errorMessage = '';
    
    try {
      await exportTask();
      exportSuccess = true;
    } catch (error) {
      console.error('Export failed:', error);
      exportSuccess = false;
      errorMessage = error.message || 'Unknown error occurred';
    } finally {
      const duration = Date.now() - startTime;
      const delay = Math.max(0, 1500 - duration); // Reduced delay
      
      setTimeout(() => {
        setIsLoading(false);
        if (exportSuccess) {
          setToastMessage('Download successful!');
        } else {
          setToastMessage(`Export failed: ${errorMessage}`);
        }
      }, delay);
    }
  };
  
  const handleRetryConnection = () => {
    // Force a connection check by reloading the page or triggering a network request
    window.location.reload();
  };

  const controlsPanel = (
    <ControlsPanel
      text={selectedText}
      styles={selectedStyles}
      onTextChange={handleTextChange}
      onStyleChange={handleStyleChange}
      onFontChange={handleFontChange}
      isTransparent={isTransparent}
      onIsTransparentChange={setIsTransparent}
      backgroundImage={backgroundImage}
      onBackgroundImageChange={handleBackgroundImageChange}
      onAutoAlign={handleAutoAlign}
      onAddTextBox={handleAddTextBox}
    />
  );

  return (
    <>
      <OfflineIndicator />
      {!isOnline ? (
        <OfflinePage onRetry={handleRetryConnection} />
      ) : (
        <div className={`min-h-screen font-sans ${!isEditorVisible ? 'flex items-start lg:items-center justify-center p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-6 lg:p-8'}`}>
          <LiveBackground />
          {!isEditorVisible ? (
        <LandingPage 
          onStartCreating={handleStartCreating} 
          onLoginClick={() => setIsAuthModalOpen(true)}
        />
      ) : session ? (
        <>
          <div className="max-w-7xl mx-auto w-full">
            <Header 
              onGoHome={() => setIsEditorVisible(false)} 
              session={session}
              onLoginClick={() => setIsAuthModalOpen(true)}
            />
            <main className="mt-8 grid grid-cols-1 lg:grid-cols-12 lg:items-start gap-8">
              <div className="lg:col-span-4 order-2 lg:order-1 hidden lg:block">
                {controlsPanel}
              </div>
              <div className="lg:col-span-8 order-1 lg:order-2">
                <div className="sticky lg:static top-4 sm:top-6 z-10">
                  <PreviewArea
                    ref={previewAreaRef}
                    textBoxes={textBoxes}
                    selectedTextBoxId={selectedTextBoxId}
                    onTextBoxSelect={setSelectedTextBoxId}
                    onStyleChange={handleStyleChange}
                    isTransparent={isTransparent}
                    backgroundImage={backgroundImage}
                    onOpenExportModal={() => setIsExportModalOpen(true)}
                    isAdjustingTextBox={isAdjustingTextBox}
                  />
                </div>
                <SecondaryControls
                    styles={selectedStyles}
                    onStyleChange={handleStyleChange}
                    onResetStyles={resetStyles}
                    onInteractionStart={() => setIsAdjustingTextBox(true)}
                    onInteractionEnd={() => setIsAdjustingTextBox(false)}
                />
                <div className="block lg:hidden mt-8">
                    {controlsPanel}
                </div>
              </div>
            </main>
          </div>
          <ExportModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            options={exportOptions}
            onOptionsChange={setExportOptions}
            onExport={handleExport}
          />
          {isLoading && <Loader />}
          {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </>
      ) : (
        // If user tries to access editor without authentication, redirect to landing page
        <LandingPage 
          onStartCreating={handleStartCreating} 
          onLoginClick={() => setIsAuthModalOpen(true)}
        />
      )}
      {isAuthModalOpen && <Auth onClose={() => setIsAuthModalOpen(false)} />}
        </div>
      )}
    </>
  );
}

export default App;