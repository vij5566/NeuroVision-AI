import React from 'react';

const Disclaimer = () => {
  return (
    <div className="w-full bg-amber-900/20 border-t border-amber-700/30 py-4 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex gap-3 items-start sm:items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-sm text-amber-200/80 leading-relaxed max-w-4xl">
          <strong className="text-amber-400 font-semibold">Research & Educational Use Only:</strong> This application is a machine-learning demonstration and is not a medical diagnostic device. Predictions should not be used for medical decisions. Always consult a qualified healthcare professional for medical evaluation.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
