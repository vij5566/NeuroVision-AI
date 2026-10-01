import React from 'react';
import { CLASS_DISPLAY_NAMES } from '../utils/constants';

export default function ClinicalReportModal({ isOpen, onClose, result, previewUrl }) {
  if (!isOpen || !result) return null;

  const { prediction, confidence, probabilities, class_descriptions, gradcam_heatmap, inference_time_ms } = result;
  const displayClass = CLASS_DISPLAY_NAMES[prediction] || prediction;
  const confidencePercent = (confidence * 100).toFixed(1);
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const reportId = `NV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] print:m-0 print:max-h-none print:w-full print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Action Bar (hidden on print) */}
        <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-slate-200 no-print">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-cyan-100 text-cyan-800 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            <span className="text-sm font-bold text-slate-800">Clinical Diagnostic Summary Report</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              &larr; Back to Results
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
              title="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-slate-800 print:p-0">
          
          {/* Document Header */}
          <div className="border-b-2 border-indigo-600 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-indigo-950 uppercase">
                  NeuroVision AI
                </h1>
                <p className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                  Automated Brain MRI Neuro-Oncology Analysis
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="font-mono font-bold text-slate-900">ID: {reportId}</p>
                <p className="text-slate-500">{reportDate}</p>
              </div>
            </div>

            {/* Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Engine</span>
                <span className="font-semibold text-slate-700">EfficientNet-B0</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Input Size</span>
                <span className="font-semibold text-slate-700">256 &times; 256 RGB</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Loss Function</span>
                <span className="font-semibold text-slate-700">Focal Loss (&gamma;=2.0)</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Latency</span>
                <span className="font-semibold text-slate-700">{inference_time_ms || 45} ms</span>
              </div>
            </div>
          </div>

          {/* Primary Finding Banner */}
          <div className="bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-xl">
            <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500">
              Primary Classification Finding
            </span>
            <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
              <h2 className="text-2xl font-black text-slate-900 capitalize">
                {displayClass}
              </h2>
              <div className="text-right">
                <span className="text-xs text-slate-500 mr-2">Calculated Confidence:</span>
                <span className="text-2xl font-bold font-mono text-indigo-600">
                  {confidencePercent}%
                </span>
              </div>
            </div>
          </div>

          {/* Imaging Evidence (Scan & Grad-CAM) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Visual Evidence &amp; Spatial Attention (Grad-CAM)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-xl p-2 bg-slate-50 text-center">
                <div className="aspect-square rounded-lg overflow-hidden bg-black mb-1">
                  <img
                    src={previewUrl || gradcam_heatmap}
                    alt="Original MRI"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-600">Original Brain MRI Scan</span>
              </div>
              
              <div className="border border-indigo-200 rounded-xl p-2 bg-indigo-50/40 text-center">
                <div className="aspect-square rounded-lg overflow-hidden bg-black mb-1">
                  <img
                    src={gradcam_heatmap || previewUrl}
                    alt="Grad-CAM Heatmap"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-[11px] font-medium text-indigo-700">Grad-CAM Attribution Map</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 italic text-center">
              *Thermal overlay marks spatial features in the convolutional feature space that most heavily triggered the classification.
            </p>
          </div>

          {/* Probability Distribution Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Multiclass Probability Distribution
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">Class</th>
                    <th className="py-2 px-3">Distribution Bar</th>
                    <th className="py-2 px-3 text-right">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {probabilities && Object.entries(probabilities).map(([cName, prob]) => {
                    const isWinner = cName.toLowerCase() === prediction.toLowerCase();
                    const percent = (prob * 100).toFixed(1);
                    return (
                      <tr key={cName} className={isWinner ? 'bg-indigo-50/60 font-semibold' : ''}>
                        <td className="py-2 px-3 capitalize text-slate-800">
                          {cName === 'notumor' ? 'No Tumor' : cName}
                          {isWinner && <span className="ml-1.5 text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded">Primary</span>}
                        </td>
                        <td className="py-2 px-3 w-1/2">
                          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isWinner ? 'bg-indigo-600' : 'bg-slate-400'}`} 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-800">
                          {percent}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pathology Reference */}
          {class_descriptions && class_descriptions[prediction] && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Pathology Guidance:</span>
              <p className="text-slate-600 leading-relaxed">
                {class_descriptions[prediction]}
              </p>
            </div>
          )}

          {/* Regulatory Disclaimer */}
          <div className="border-t border-slate-200 pt-4 text-[10px] text-slate-400 leading-relaxed">
            <p className="font-bold text-slate-500 uppercase tracking-wider mb-0.5">
              Research &amp; Educational Notice:
            </p>
            <p>
              This report is generated by an artificial intelligence research model (EfficientNet-B0 trained on public Kaggle MRI datasets) for experimental demonstration only. This system is NOT certified as a clinical medical device. All findings must be verified by a licensed radiologist or medical oncologist before clinical action.
            </p>
          </div>

        </div>

        {/* Modal Footer Controls (hidden on print) */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            &larr; Back to Results
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
