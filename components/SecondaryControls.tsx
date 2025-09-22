import React from 'react';
import type { StyleOptions } from '../types';
import CustomSlider from './CustomSlider';
import Checkbox from './Checkbox';
import IconButton from './IconButton';
import { ResetIcon } from './icons/ResetIcon';

interface SecondaryControlsProps {
  styles: StyleOptions;
  onStyleChange: <K extends keyof StyleOptions>(key: K, value: StyleOptions[K]) => void;
  onResetStyles: () => void;
  onInteractionStart: () => void;
  onInteractionEnd: () => void;
}

const SecondaryControls: React.FC<SecondaryControlsProps> = ({ styles, onStyleChange, onResetStyles, onInteractionStart, onInteractionEnd }) => {
  return (
    <div className="bg-bg-card/60 backdrop-blur-xl border border-border-primary/50 p-4 sm:p-6 rounded-2xl shadow-lg mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
        <CustomSlider
          label="Text Box Width (%)"
          value={styles.textWidth}
          min={10}
          max={100}
          step={1}
          onChange={(e) => onStyleChange('textWidth', parseInt(e.target.value, 10))}
          onMouseDown={onInteractionStart}
          onMouseUp={onInteractionEnd}
          onTouchStart={onInteractionStart}
          onTouchEnd={onInteractionEnd}
        />
        <CustomSlider
          label="Horizontal Offset (px)"
          value={styles.positionX}
          min={-200}
          max={200}
          step={1}
          onChange={(e) => onStyleChange('positionX', parseInt(e.target.value, 10))}
          onMouseDown={onInteractionStart}
          onMouseUp={onInteractionEnd}
          onTouchStart={onInteractionStart}
          onTouchEnd={onInteractionEnd}
        />
        <CustomSlider
          label="Vertical Offset (px)"
          value={styles.positionY}
          min={-200}
          max={200}
          step={1}
          onChange={(e) => onStyleChange('positionY', parseInt(e.target.value, 10))}
          onMouseDown={onInteractionStart}
          onMouseUp={onInteractionEnd}
          onTouchStart={onInteractionStart}
          onTouchEnd={onInteractionEnd}
        />
      </div>

      <hr className="my-6 border-border-primary/50" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 items-end">
        <div>
          <label htmlFor="shadow-color-picker" className="block text-sm font-medium text-text-muted mb-2">Shadow Color</label>
          <input
            id="shadow-color-picker"
            type="color"
            value={styles.shadowColor}
            onChange={(e) => onStyleChange('shadowColor', e.target.value)}
            className="w-full h-10 p-1 bg-bg-primary/50 border border-border-primary rounded-md cursor-pointer"
            disabled={!styles.shadowEnabled}
          />
        </div>
        <div>
            <Checkbox id="shadow" label="Enable Shadow" checked={styles.shadowEnabled} onChange={(e) => onStyleChange('shadowEnabled', e.target.checked)} />
        </div>
        <div>
            <IconButton text="Reset Styles" icon={<ResetIcon />} onClick={onResetStyles} fullWidth />
        </div>
      </div>
    </div>
  );
};

export default SecondaryControls;