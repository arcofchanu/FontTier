import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { HeartIcon } from './icons/HeartIcon';
import { LinkIcon } from './icons/LinkIcon';
import { LogoutIcon } from './icons/LogoutIcon';

interface HeaderProps {
    onGoHome: () => void;
    session: Session | null;
    onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome, session, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      label: 'Coffee !',
      icon: <HeartIcon className="w-5 h-5 sm:mr-2" />,
      href: 'https://buymeacoffee.com/acrofchanu',
    },
    {
      label: "Follow-Up",
      icon: <LinkIcon className="w-5 h-5 sm:mr-2" />,
      href: 'https://forms.gle/R2Ucsx25o3kJy3MG9',
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center">
      <button onClick={onGoHome} className="text-2xl font-display text-brand-primary hover:opacity-80 transition-opacity">
        Font-Tier
      </button>
      <div className="flex items-center gap-2 sm:gap-4">
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            className="hidden sm:flex items-center p-2 sm:px-4 sm:py-2 text-sm font-semibold rounded-md transition-colors bg-bg-card/60 text-text-main hover:bg-border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary"
          >
            {item.icon}
            <span className="hidden sm:inline">{item.label}</span>
          </a>
        ))}
         <div className="relative" ref={menuRef}>
          {session ? (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 bg-brand-secondary rounded-full text-brand-text font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary"
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
            >
              {session.user.email?.charAt(0).toUpperCase()}
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-brand-primary text-brand-text hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary"
            >
              Sign In
            </button>
          )}

          {isMenuOpen && session && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-bg-card border border-border-primary/50 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-fadeIn">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <div className="px-4 py-3 border-b border-border-primary/50">
                    <p className="text-sm text-text-muted" role="none">Signed in as</p>
                    <p className="text-sm font-medium text-text-main truncate" role="none">{session.user.email}</p>
                </div>
                <div className="py-1" role="none">
                    {menuItems.map((item) => (
                        <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="sm:hidden flex items-center px-4 py-2 text-sm text-text-main hover:bg-border-primary" role="menuitem">
                            <span className="w-5 h-5 mr-2 text-text-muted">{item.icon}</span>
                            {item.label}
                        </a>
                    ))}
                    <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                    >
                        <LogoutIcon className="w-5 h-5 mr-2" />
                        Sign Out
                    </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
