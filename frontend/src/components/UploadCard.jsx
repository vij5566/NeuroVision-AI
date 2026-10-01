import React, { useRef, useState } from 'react';

const UploadCard = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`w-full bg-[#1e1b4b]/40 backdrop-blur-md rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ease-in-out cursor-pointer hover:bg-[#1e1b4b]/60 ${
        isDragging ? 'border-cyan-400 bg-[#1e1b4b]/80' : 'border-indigo-800/50'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".jpg,.jpeg,.png,.webp"
      />
      
      <div className="flex justify-center mb-4 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 transition-colors duration-300 ${isDragging ? 'text-cyan-400' : 'text-indigo-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <h3 className="text-xl font-medium text-white mb-2 pointer-events-none">
        Drag & drop your MRI scan here
      </h3>
      
      <div className="flex items-center justify-center gap-4 my-4 pointer-events-none">
        <div className="h-px w-12 bg-gray-600"></div>
        <span className="text-gray-400 text-sm">or</span>
        <div className="h-px w-12 bg-gray-600"></div>
      </div>
      
      <button 
        type="button"
        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-900/20 transition-all mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
      >
        Browse Files
      </button>
      
      <p className="text-xs text-gray-500 pointer-events-none">
        Supports JPG, JPEG, PNG, WEBP &middot; Max 10MB
      </p>
    </div>
  );
};

export default UploadCard;
