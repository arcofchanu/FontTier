import React from 'react';
import type { StyleOptions } from '../types';
import CustomSlider from './CustomSlider';
import { UploadIcon } from './icons/UploadIcon';
import { AlignLeftIcon } from './icons/AlignLeftIcon';
import { AlignCenterIcon } from './icons/AlignCenterIcon';
import { AlignRightIcon } from './icons/AlignRightIcon';
import { ImageIcon } from './icons/ImageIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { AutoAlignIcon } from './icons/AutoAlignIcon';
import Checkbox from './Checkbox';

interface ControlsPanelProps {
  text: string;
  styles: StyleOptions;
  onTextChange: (text: string) => void;
  onStyleChange: <K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => void;
  onFontChange: (file: File | null) => void;
  isTransparent: boolean;
  onIsTransparentChange: (value: boolean) => void;
  backgroundImage: string | null;
  onBackgroundImageChange: (file: File | null) => void;
  onAutoAlign: () => void;
  onAddTextBox: () => void;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  text,
  styles,
  onTextChange,
  onStyleChange,
  onFontChange,
  isTransparent,
  onIsTransparentChange,
  backgroundImage,
  onBackgroundImageChange,
  onAutoAlign,
  onAddTextBox,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFontChange(file);
    }
  };

  const handleBgFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onBackgroundImageChange(file || null);
    // Reset file input so the same file can be re-uploaded
    e.target.value = '';
  };

  const alignmentOptions = [
    { value: 'left', icon: <AlignLeftIcon className="w-5 h-5" />, label: 'Align left' },
    { value: 'center', icon: <AlignCenterIcon className="w-5 h-5" />, label: 'Align center' },
    { value: 'right', icon: <AlignRightIcon className="w-5 h-5" />, label: 'Align right' },
  ] as const;

  return (
    <div className="bg-bg-card/60 backdrop-blur-xl border border-border-primary/50 p-4 sm:p-6 rounded-2xl shadow-lg space-y-6">
      <div>
        <label htmlFor="font-upload" className="block text-sm font-medium text-text-muted mb-2">Upload Font (.ttf, .otf)</label>
        <label
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-border-primary rounded-md cursor-pointer hover:border-brand-primary transition-colors"
        >
          <UploadIcon className="w-6 h-6 mr-3 text-text-muted"/>
          <span className="text-text-main font-medium">Choose a font file</span>
          <input id="font-upload" type="file" accept=".ttf,.otf" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

       <div>
        <label className="block text-sm font-medium text-text-muted mb-2">Background Image</label>
        <div className="flex items-center gap-2">
          <label
            className="flex-grow flex items-center justify-center px-4 py-3 border-2 border-dashed border-border-primary rounded-md cursor-pointer hover:border-brand-primary transition-colors"
          >
            <ImageIcon className="w-6 h-6 mr-3 text-text-muted"/>
            <span className="text-text-main font-medium">{backgroundImage ? "Change" : "Choose an image"}</span>
            <input id="bg-upload" type="file" accept="image/*" className="hidden" onChange={handleBgFileChange} />
          </label>
          {backgroundImage && (
            <button 
              onClick={() => onBackgroundImageChange(null)}
              className="p-3 border-2 border-border-primary rounded-md text-text-muted hover:border-red-500 hover:text-red-500 transition-colors"
              title="Remove background image"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="text-input" className="text-sm font-medium text-text-muted">Your Text</label>
          <button
            onClick={onAddTextBox}
            className="px-3 py-1.5 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors text-sm font-medium"
            title="Add another text box"
          >
            + Add Text
          </button>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          rows={4}
          className="w-full bg-bg-primary/50 border border-border-primary rounded-md p-3 focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
          placeholder="Type something..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <CustomSlider
          label="Font Size (px)"
          value={styles.fontSize}
          min={8}
          max={200}
          step={1}
          onChange={(e) => onStyleChange('fontSize', parseInt(e.target.value, 10))}
        />
        <CustomSlider
          label="Letter Spacing (px)"
          value={styles.letterSpacing}
          min={-10}
          max={50}
          step={0.5}
          onChange={(e) => onStyleChange('letterSpacing', parseFloat(e.target.value))}
        />
        <CustomSlider
          label="Line Height"
          value={styles.lineHeight}
          min={0.5}
          max={3}
          step={0.1}
          onChange={(e) => onStyleChange('lineHeight', parseFloat(e.target.value))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div>
          <label htmlFor="color-picker" className="block text-sm font-medium text-text-muted mb-2">Text Color</label>
          <input
            id="color-picker"
            type="color"
            value={styles.color}
            onChange={(e) => onStyleChange('color', e.target.value)}
            className="w-full h-10 p-1 bg-bg-primary/50 border border-border-primary rounded-md cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">Alignment</label>
          <div className="grid grid-cols-4 gap-2 bg-bg-primary/50 p-1 rounded-md border border-border-primary">
            <button
              onClick={onAutoAlign}
              className="flex justify-center items-center p-2 rounded-md transition-colors text-text-muted hover:bg-border-primary hover:text-text-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary"
              title="Auto-align text"
            >
              <AutoAlignIcon className="w-5 h-5" />
            </button>
            {alignmentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onStyleChange('textAlign', option.value)}
                className={`flex justify-center items-center p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary ${
                  styles.textAlign === option.value
                    ? 'bg-brand-primary text-brand-text'
                    : 'text-text-muted hover:bg-border-primary hover:text-text-main'
                }`}
                aria-pressed={styles.textAlign === option.value}
                title={option.label}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Effects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-text-muted">3D Effects</label>
          <Checkbox 
            id="enable-3d" 
            label="Enable 3D" 
            checked={styles.is3DEnabled} 
            onChange={(e) => onStyleChange('is3DEnabled', e.target.checked)} 
          />
        </div>
        
        {styles.is3DEnabled && (
          <div className="space-y-4 p-4 bg-bg-primary/30 rounded-lg border border-border-primary/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <CustomSlider
                label="Rotate X (deg)"
                value={styles.rotateX}
                min={-180}
                max={180}
                step={1}
                onChange={(e) => onStyleChange('rotateX', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Rotate Y (deg)"
                value={styles.rotateY}
                min={-180}
                max={180}
                step={1}
                onChange={(e) => onStyleChange('rotateY', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Rotate Z (deg)"
                value={styles.rotateZ}
                min={-180}
                max={180}
                step={1}
                onChange={(e) => onStyleChange('rotateZ', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Perspective"
                value={styles.perspective}
                min={100}
                max={2000}
                step={50}
                onChange={(e) => onStyleChange('perspective', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Skew X (deg)"
                value={styles.skewX}
                min={-45}
                max={45}
                step={1}
                onChange={(e) => onStyleChange('skewX', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Skew Y (deg)"
                value={styles.skewY}
                min={-45}
                max={45}
                step={1}
                onChange={(e) => onStyleChange('skewY', parseInt(e.target.value, 10))}
              />
              <CustomSlider
                label="Depth (px)"
                value={styles.depth3D}
                min={-200}
                max={200}
                step={5}
                onChange={(e) => onStyleChange('depth3D', parseInt(e.target.value, 10))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-text-muted">Gradient Colors</label>
                  <Checkbox 
                    id="enable-gradient" 
                    label="Enable" 
                    checked={styles.gradientEnabled} 
                    onChange={(e) => onStyleChange('gradientEnabled', e.target.checked)} 
                  />
                </div>
                {styles.gradientEnabled && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="gradient-color1" className="block text-xs text-text-muted mb-1">Color 1</label>
                      <input
                        id="gradient-color1"
                        type="color"
                        value={styles.gradientColor1}
                        onChange={(e) => onStyleChange('gradientColor1', e.target.value)}
                        className="w-full h-8 p-1 bg-bg-primary/50 border border-border-primary rounded-md cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="gradient-color2" className="block text-xs text-text-muted mb-1">Color 2</label>
                      <input
                        id="gradient-color2"
                        type="color"
                        value={styles.gradientColor2}
                        onChange={(e) => onStyleChange('gradientColor2', e.target.value)}
                        className="w-full h-8 p-1 bg-bg-primary/50 border border-border-primary rounded-md cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        <Checkbox id="bold" label="Bold" checked={styles.isBold} onChange={(e) => onStyleChange('isBold', e.target.checked)} />
        <Checkbox id="italic" label="Italic" checked={styles.isItalic} onChange={(e) => onStyleChange('isItalic', e.target.checked)} />
        <Checkbox id="underline" label="Underline" checked={styles.isUnderline} onChange={(e) => onStyleChange('isUnderline', e.target.checked)} />
        <Checkbox 
            id="transparent-bg" 
            label="Transparent BG" 
            checked={isTransparent} 
            onChange={(e) => onIsTransparentChange(e.target.checked)} 
            disabled={!!backgroundImage}
        />
      </div>

    </div>
  );
};

export default ControlsPanel;