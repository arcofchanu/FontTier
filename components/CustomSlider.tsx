import React, { useState, useEffect } from 'react';

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onMouseUp?: (e: React.MouseEvent<HTMLInputElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLInputElement>) => void;
  onTouchEnd?: (e: React.TouchEvent<HTMLInputElement>) => void;
}

const CustomSlider: React.FC<CustomSliderProps> = ({ label, value, min, max, step, onChange, onMouseDown, onMouseUp, onTouchStart, onTouchEnd }) => {
  const [inputValue, setInputValue] = useState(String(value));
  const uniqueId = `slider-input-${label.replace(/\s+/g, '-')}`;

  useEffect(() => {
    // Sync from parent if value changes, e.g., from a reset button.
    // We check if the input is focused to avoid overwriting user input as they type.
    if (document.activeElement?.id !== uniqueId) {
        setInputValue(String(value));
    }
  }, [value, uniqueId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentInputValue = e.target.value;
    setInputValue(currentInputValue);

    const numericValue = parseFloat(currentInputValue);
    // If the typed value is valid and within range, propagate it up.
    // This makes the slider move in real-time as the user types.
    if (!isNaN(numericValue) && numericValue >= min && numericValue <= max) {
      onChange(e);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    let numericValue = parseFloat(e.target.value);

    // On blur, clamp the value to be within the min/max range.
    if (isNaN(numericValue) || numericValue < min) {
      numericValue = min;
    } else if (numericValue > max) {
      numericValue = max;
    }

    const finalValue = String(numericValue);
    setInputValue(finalValue);

    // If the final clamped value is different from the parent's state, propagate the change.
    if (numericValue !== value) {
      const syntheticEvent = { target: { value: finalValue } } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <label htmlFor={uniqueId} className="text-sm font-medium text-text-muted">{label}</label>
        <input
          id={uniqueId}
          type="number"
          value={inputValue}
          min={min}
          max={max}
          step={step}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-20 text-sm text-right font-mono text-text-main bg-bg-primary/50 px-2 py-1 rounded border border-border-primary focus:outline-none focus:ring-1 focus:ring-brand-primary/80 focus:border-brand-primary"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleRangeChange}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="w-full h-2 bg-border-primary rounded-lg appearance-none cursor-pointer range-lg accent-brand-primary"
      />
    </div>
  );
};

export default CustomSlider;
