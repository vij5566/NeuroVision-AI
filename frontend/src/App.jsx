import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UploadCard from './components/UploadCard';
import SampleGallery from './components/SampleGallery';
import ImagePreview from './components/ImagePreview';
import AnalysisLoader from './components/AnalysisLoader';
import PredictionResult from './components/PredictionResult';
import ModelSpecsModal from './components/ModelSpecsModal';
import Disclaimer from './components/Disclaimer';
import Footer from './components/Footer';
import { usePrediction } from './hooks/usePrediction';

function App() {
  const {
    selectedFile,
    previewUrl,
    isLoading,
    result,
    error,
    selectFile,
    removeFile,
    analyze,
    reset,
    clearError
  } = usePrediction();

  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onOpenSpecs={() => setIsSpecsOpen(true)} />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
          
          {/* State: Idle (No file, no result) */}
          {!selectedFile && !result && (
            <>
              <HeroSection />
              <UploadCard onFileSelect={selectFile} />
              <SampleGallery onSelectSample={selectFile} disabled={isLoading} />
              
              {error && (
                <div className="w-full bg-red-950/50 border border-red-500/60 text-red-200 p-5 rounded-2xl shadow-xl flex items-start justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-900/60 rounded-xl text-red-400 shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-red-300 mb-1">Image Validation Alert</h4>
                      <p className="text-sm text-red-200/90 leading-relaxed">{error}</p>
                    </div>
                  </div>
                  <button
                    onClick={clearError}
                    className="p-1.5 text-red-400 hover:text-white rounded-lg hover:bg-red-900/50 transition-colors shrink-0 cursor-pointer"
                    title="Dismiss alert"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

          {/* State: File Selected (Ready to analyze) */}
          {selectedFile && !isLoading && !result && (
            <div className="flex flex-col gap-6">
              <ImagePreview 
                file={selectedFile} 
                previewUrl={previewUrl} 
                onRemove={removeFile}
                onAnalyze={analyze}
              />
              {error && (
                <div className="w-full bg-red-950/50 border border-red-500/60 text-red-200 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-900/60 rounded-xl text-red-400 shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="text-base font-semibold text-red-300 mb-1">Validation Notice</h4>
                      <p className="text-sm text-red-200/90 leading-relaxed">{error}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={removeFile}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/70 hover:bg-red-800 text-white text-xs font-semibold rounded-xl border border-red-700/60 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      &larr; Back to Selection
                    </button>
                    <button
                      onClick={clearError}
                      className="p-1.5 text-red-400 hover:text-white rounded-lg hover:bg-red-900/50 transition-colors cursor-pointer"
                      title="Dismiss notice"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* State: Loading */}
          {isLoading && (
            <AnalysisLoader />
          )}

          {/* State: Result */}
          {result && !isLoading && (
            <PredictionResult 
              result={result} 
              previewUrl={previewUrl} 
              onReset={reset} 
            />
          )}
          
        </div>
      </main>

      <ModelSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      <Disclaimer />
      <Footer />
    </div>
  );
}

export default App;
