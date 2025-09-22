import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import type { ExportOptions } from '../types';
import CustomSlider from './CustomSlider';
import Checkbox from './Checkbox';
import { XCircleIcon } from './icons/XCircleIcon';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: ExportOptions;
  onOptionsChange: (options: ExportOptions) => void;
  onExport: () => void;
}

const BASE_ASPECT_RATIO = 896 / 560;

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  options,
  onOptionsChange,
  onExport
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleOptionChange = <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
    const newOptions = { ...options, [key]: value };

    if (newOptions.maintainAspectRatio) {
      if (key === 'width') {
        newOptions.height = Math.round(Number(value) / BASE_ASPECT_RATIO);
      } else if (key === 'height') {
        newOptions.width = Math.round(Number(value) * BASE_ASPECT_RATIO);
      }
    }
    onOptionsChange(newOptions);
  };
  
  const formats: ExportOptions['format'][] = ['png', 'jpeg', 'svg'];

  if (!isMounted || !isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-bg-card border border-border-primary/50 rounded-2xl shadow-lg p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 id="export-modal-title" className="text-2xl font-bold text-text-main">Export Settings</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <XCircleIcon className="w-8 h-8" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Resolution (px)</label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              aria-label="Width"
              value={options.width}
              onChange={(e) => handleOptionChange('width', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            />
            <input
              type="number"
              aria-label="Height"
              value={options.height}
              onChange={(e) => handleOptionChange('height', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-2 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
            />
          </div>
          <div className="mt-3">
             <Checkbox 
                id="aspect-ratio"
                label="Lock Aspect Ratio"
                checked={options.maintainAspectRatio}
                onChange={(e) => handleOptionChange('maintainAspectRatio', e.target.checked)}
            />
          </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Format</label>
            <div className="grid grid-cols-3 gap-2 bg-bg-primary/50 p-1 rounded-md border border-border-primary">
                {formats.map(format => (
                    <button
                        key={format}
                        onClick={() => handleOptionChange('format', format)}
                        className={`px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary ${
                            options.format === format ? 'bg-brand-primary text-brand-text' : 'text-text-muted hover:bg-border-primary hover:text-text-main'
                        }`}
                    >
                        {format.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>
        
        {options.format === 'jpeg' && (
             <CustomSlider
                label="Quality"
                value={options.quality}
                min={0.1}
                max={1}
                step={0.05}
                onChange={(e) => handleOptionChange('quality', parseFloat(e.target.value))}
            />
        )}


        <div className="flex justify-end gap-4 pt-4 border-t border-border-primary/50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md font-semibold text-text-main bg-border-primary hover:bg-opacity-80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onExport}
            className="px-6 py-2 rounded-md font-semibold text-brand-text bg-brand-primary hover:bg-brand-hover transition-colors"
          >
            Download
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ExportModal;