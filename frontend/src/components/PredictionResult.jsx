import React from 'react';
import ProbabilityChart from './ProbabilityChart';
import { CLASS_DISPLAY_NAMES } from '../utils/constants';

const CLASS_DESCRIPTIONS = {
  glioma: 'A category of brain tumor originating from glial cells. Gliomas can vary in aggressiveness and location within the brain.',
  meningioma: 'A tumor arising from the meninges, the protective membranes surrounding the brain and spinal cord. Often slow-growing.',
  notumor: 'No tumor detected. The model did not identify tumor-like features in the analyzed MRI image.',
  pituitary: 'A tumor involving the pituitary gland, located at the base of the brain. These tumors can affect hormone production.',
};

const PredictionResult = ({ result, onReset }) => {
  const { prediction, confidence, probabilities, class_descriptions } = result || {};
  
  // Format prediction
  const displayClass = CLASS_DISPLAY_NAMES[prediction] || prediction;
  const confidencePercent = (confidence * 100).toFixed(1);
  const description = (class_descriptions && class_descriptions[prediction]) || CLASS_DESCRIPTIONS[prediction] || '';
  
  // Determine color based on confidence
  let confColor = 'text-green-400';
  if (confidence < 0.5) confColor = 'text-red-400';
  else if (confidence < 0.8) confColor = 'text-amber-400';

  return (
    <div className="w-full bg-[#1e1b4b]/60 backdrop-blur-md rounded-2xl border border-indigo-500/30 p-8 shadow-2xl relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500"></div>
      
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="bg-cyan-900/50 p-2 rounded-full text-cyan-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">AI Analysis Result</h2>
        
        <div className="ml-auto bg-[#0f0b1a]/50 px-3 py-1 rounded-full text-xs text-indigo-300 border border-indigo-800">
          EfficientNet-B0 &middot; 224&times;224
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="bg-black/20 rounded-xl p-6 border border-white/5 flex flex-col justify-center items-center text-center">
          <p className="text-gray-400 mb-2 uppercase tracking-wider text-sm font-semibold">Model Prediction</p>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">{displayClass}</h3>
          
          <div className="mt-2">
            <p className="text-gray-400 text-sm mb-1">Model Confidence</p>
            <p className={`text-3xl font-mono font-bold ${confColor}`}>
              {confidencePercent}%
            </p>
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-6 border border-white/5">
          <p className="text-gray-400 mb-4 uppercase tracking-wider text-sm font-semibold">Class Probabilities</p>
          <ProbabilityChart probabilities={probabilities} predictedClass={prediction} />
        </div>
      </div>

      {/* Class description */}
      {description && (
        <div className="bg-black/20 rounded-xl p-5 border border-white/5 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">About This Classification</p>
          <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
        </div>
      )}
      
      <div className="flex justify-center mt-4">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-[#0f0b1a] hover:bg-gray-800 text-white font-medium rounded-xl border border-indigo-800/50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Analyze Another Image
        </button>
      </div>
    </div>
  );
};

export default PredictionResult;
