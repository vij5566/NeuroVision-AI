import React from 'react';

const HeroSection = () => {
  return (
    <div className="text-center py-12 md:py-20 relative">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
        Brain MRI Analysis<br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
          Powered by AI
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
        An EfficientNet-B0 based research application for multiclass brain MRI image classification.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-indigo-900/50 px-4 py-2 rounded-full text-sm text-indigo-200">
          4-Class Classification
        </div>
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-indigo-900/50 px-4 py-2 rounded-full text-sm text-indigo-200">
          EfficientNet-B0
        </div>
        <div className="bg-[#1e1b4b]/40 backdrop-blur-sm border border-indigo-900/50 px-4 py-2 rounded-full text-sm text-indigo-200">
          Real-Time Analysis
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
