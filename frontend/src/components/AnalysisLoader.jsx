import React from 'react';

const AnalysisLoader = () => {
  return (
    <div className="w-full bg-[#1e1b4b]/40 backdrop-blur-md rounded-2xl border border-indigo-800/50 p-12 text-center shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-cyan-600/20 rounded-full mix-blend-screen filter blur-[50px] animate-pulse-slow"></div>
      
      <div className="relative mb-8">
        {/* Spinning rings */}
        <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin-slow w-20 h-20 -m-2 opacity-70"></div>
        <div className="absolute inset-0 rounded-full border-r-2 border-indigo-500 animate-[spin_4s_linear_infinite_reverse] w-24 h-24 -m-4 opacity-50"></div>
        
        {/* Brain icon pulse */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-cyan-200">
        Analyzing MRI...
      </h3>
      <p className="text-indigo-300/80">
        Running deep learning inference
      </p>
    </div>
  );
};

export default AnalysisLoader;
