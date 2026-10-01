import React, { useState } from 'react';
import ProbabilityChart from './ProbabilityChart';
import ClinicalReportModal from './ClinicalReportModal';
import { CLASS_DISPLAY_NAMES } from '../utils/constants';

const CLASS_DESCRIPTIONS = {
  glioma: 'A category of brain tumor originating from glial cells. Gliomas can vary in aggressiveness and location within the brain.',
  meningioma: 'A tumor arising from the meninges, the protective membranes surrounding the brain and spinal cord. Often slow-growing.',
  notumor: 'No tumor detected. The model did not identify tumor-like features in the analyzed MRI image.',
  pituitary: 'A tumor involving the pituitary gland, located at the base of the brain. These tumors can affect hormone production.',
};

const PredictionResult = ({ result, previewUrl, onReset }) => {
  const { prediction, confidence, probabilities, class_descriptions, gradcam_heatmap, inference_time_ms } = result || {};
  const [viewMode, setViewMode] = useState('overlay'); // 'overlay' | 'sideBySide'
  const [isReportOpen, setIsReportOpen] = useState(false);
  
  // Format prediction
  const displayClass = CLASS_DISPLAY_NAMES[prediction] || prediction;
  const confidencePercent = (confidence * 100).toFixed(1);
  const description = (class_descriptions && class_descriptions[prediction]) || CLASS_DESCRIPTIONS[prediction] || '';
  
  // Determine color based on confidence
  let confColor = 'text-emerald-400';
  if (confidence < 0.5) confColor = 'text-red-400';
  else if (confidence < 0.8) confColor = 'text-amber-400';

  return (
    <div className="w-full bg-[#1e1b4b]/60 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500"></div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="bg-cyan-900/50 p-2 rounded-full text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Analysis Result</h2>
          {inference_time_ms && (
            <p className="text-xs text-slate-400">Inference completed in {inference_time_ms} ms</p>
          )}
        </div>
        
        <div className="ml-auto bg-[#0f0b1a]/50 px-3 py-1 rounded-full text-xs text-indigo-300 border border-indigo-800">
          EfficientNet-B0 &middot; 256&times;256
        </div>
      </div>

      {/* Top summary row: Prediction & Probabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
          <p className="text-gray-400 mb-2 uppercase tracking-wider text-xs font-semibold">Model Prediction</p>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{displayClass}</h3>
          
          <div className="mt-2">
            <p className="text-gray-400 text-xs mb-1">Model Confidence</p>
            <p className={`text-3xl font-mono font-bold ${confColor}`}>
              {confidencePercent}%
            </p>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <p className="text-gray-400 mb-4 uppercase tracking-wider text-xs font-semibold">Class Probabilities</p>
          <ProbabilityChart probabilities={probabilities} predictedClass={prediction} />
        </div>
      </div>

      {/* Grad-CAM Explainability Section */}
      {gradcam_heatmap && (
        <div className="bg-black/30 rounded-xl p-6 border border-cyan-500/20 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-950 rounded-lg text-cyan-400 border border-cyan-800/40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </span>
              <div>
                <h4 className="text-sm font-semibold text-white">Visual Attention Map (Grad-CAM)</h4>
                <p className="text-xs text-slate-400">Model interpretability and spatial feature attribution</p>
              </div>
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('overlay')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'overlay'
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Heatmap Overlay
              </button>
              <button
                onClick={() => setViewMode('sideBySide')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  viewMode === 'sideBySide'
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Side-by-Side
              </button>
            </div>
          </div>

          {/* Visualizer */}
          {viewMode === 'overlay' ? (
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg bg-black">
                <img
                  src={gradcam_heatmap}
                  alt="Grad-CAM Overlay"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center max-w-md">
                Warmer colors (red/yellow) indicate the anatomical regions that most heavily influenced the model's <span className="text-cyan-300 font-medium">{displayClass}</span> classification.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-400 mb-1.5 font-medium">Original MRI</span>
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden border border-slate-800 bg-black">
                  <img
                    src={previewUrl || gradcam_heatmap}
                    alt="Original MRI"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-cyan-300 mb-1.5 font-medium">Grad-CAM Heatmap</span>
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl overflow-hidden border border-cyan-500/40 bg-black">
                  <img
                    src={gradcam_heatmap}
                    alt="Grad-CAM Overlay"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Class description */}
      {description && (
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2">About This Classification</p>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setIsReportOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Diagnostic Report (PDF)
        </button>

        <button 
          onClick={onReset}
          className="px-6 py-3 bg-[#0f0b1a] hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-indigo-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          Analyze Another Scan
        </button>
      </div>

      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        result={result}
        previewUrl={previewUrl}
      />
    </div>
  );
};

export default PredictionResult;
