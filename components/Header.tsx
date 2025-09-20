
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-brand-surface/80 backdrop-blur-sm border-b border-brand-border sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <svg className="w-8 h-8 text-brand-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 12H20M12 4V20M8 8L16 16M8 16L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">VIRTUAL-PREDICT <span className="text-brand-primary">CRYPTO LIVE</span></h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
