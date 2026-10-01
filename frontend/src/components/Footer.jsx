import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-[#0a0710] py-6 border-t border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div>
          &copy; {currentYear} NeuroVision AI. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          Built with PyTorch, FastAPI & React
        </div>
      </div>
    </footer>
  );
};

export default Footer;
