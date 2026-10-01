import React from 'react';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImagePreview = ({ file, previewUrl, onRemove, onAnalyze }) => {
  return (
    <div className="w-full flex flex-col gap-3 animate-in fade-in duration-300">
      {/* Top back navigation button */}
      <div>
        <button 
          onClick={onRemove}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>&larr; Back to Image Selection</span>
        </button>
      </div>

      <div className="w-full bg-[#1e1b4b]/40 backdrop-blur-md rounded-2xl border border-indigo-800/50 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        <div className="relative md:w-1/2 p-6 flex items-center justify-center bg-black/30">
          <button 
            onClick={onRemove}
            className="absolute top-4 right-4 bg-gray-900/80 hover:bg-red-500 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={previewUrl} 
            alt="MRI Preview" 
            className="max-h-80 object-contain rounded-lg shadow-lg border border-slate-800"
          />
        </div>
        
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-400 mb-1">
            Selected Brain MRI Scan
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 truncate" title={file.name}>
            {file.name}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            File Size: {formatFileSize(file.size)}
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={onAnalyze}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex justify-center items-center gap-3 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              Run AI Analysis
            </button>

            <button 
              onClick={onRemove}
              className="w-full py-2.5 px-4 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              &larr; Choose a Different Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
