import React from 'react';

interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ id, label, checked, onChange, disabled = false }) => {
  return (
    <div className="flex items-center">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary disabled:opacity-50"
      />
      <label
        htmlFor={id}
        className={`ml-2 block text-sm transition-colors ${
          disabled ? 'text-text-muted/50' : 'text-text-main'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;