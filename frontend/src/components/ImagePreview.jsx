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
    <div className="w-full bg-[#1e1b4b]/40 backdrop-blur-md rounded-2xl border border-indigo-800/50 overflow-hidden flex flex-col md:flex-row shadow-2xl">
      <div className="relative md:w-1/2 p-6 flex items-center justify-center bg-black/20">
        <button 
          onClick={onRemove}
          className="absolute top-4 right-4 bg-gray-900/80 hover:bg-red-500 text-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Remove image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={previewUrl} 
          alt="MRI Preview" 
          className="max-h-80 object-contain rounded-lg shadow-lg"
        />
      </div>
      
      <div className="md:w-1/2 p-8 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-white mb-2 truncate" title={file.name}>
          {file.name}
        </h3>
        <p className="text-gray-400 mb-8">
          {formatFileSize(file.size)}
        </p>
        
        <button 
          onClick={onAnalyze}
          className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex justify-center items-center gap-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Analyze MRI
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
