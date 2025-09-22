import React from 'react';

interface IconButtonProps {
  text: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ text, icon, onClick, disabled = false, fullWidth = false }) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 font-semibold rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-card";
  const colorClasses = disabled
    ? "bg-border-primary text-text-muted cursor-not-allowed"
    : "bg-brand-primary text-brand-text hover:bg-brand-hover focus:ring-brand-primary";
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${colorClasses} ${widthClass}`}
    >
      <span className="w-5 h-5 mr-2">{icon}</span>
      {text}
    </button>
  );
};

export default IconButton;