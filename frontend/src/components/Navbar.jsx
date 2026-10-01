import React from 'react';

const Navbar = ({ onOpenSpecs }) => {
  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0f0b1a]/70 border-b border-indigo-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-cyan-400 to-teal-300">
                NeuroVision AI
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                v1.0
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSpecs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-800/50 hover:border-cyan-500/50 transition-all cursor-pointer shadow-sm"
              title="View EfficientNet-B0 architecture details and benchmark metrics"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Specs & Benchmarks</span>
            </button>
            
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
              Research Prototype
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
