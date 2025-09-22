import React, { useState, useRef, useEffect } from 'react';
import { MenuIcon } from './icons/MenuIcon';

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

interface DropdownMenuProps {
  items: MenuItem[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-text-muted hover:bg-border-primary hover:text-text-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-card focus:ring-brand-primary transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Open menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 origin-top-right bg-bg-card border border-border-primary/50 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full px-4 py-3 text-sm text-text-main hover:bg-border-primary transition-colors"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <span className="w-5 h-5 mr-3 text-text-muted">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;