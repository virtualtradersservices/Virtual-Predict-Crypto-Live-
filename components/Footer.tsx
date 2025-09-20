
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-4 text-center text-brand-muted text-sm">
        &copy; {new Date().getFullYear()} Virtual Traders. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
