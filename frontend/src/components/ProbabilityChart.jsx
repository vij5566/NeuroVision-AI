import React from 'react';
import { CLASS_DISPLAY_NAMES, CLASS_COLORS } from '../utils/constants';

const ProbabilityChart = ({ probabilities, predictedClass }) => {
  if (!probabilities) return null;
  
  // Keep fixed order based on CLASS_DISPLAY_NAMES keys
  const classes = Object.keys(CLASS_DISPLAY_NAMES);
  
  return (
    <div className="flex flex-col gap-4">
      {classes.map((cls) => {
        const probValue = probabilities[cls] || 0;
        const percent = (probValue * 100).toFixed(1);
        const isPredicted = cls === predictedClass;
        const displayName = CLASS_DISPLAY_NAMES[cls];
        
        // Base styling for bars
        const barColor = isPredicted ? 'bg-cyan-500' : 'bg-indigo-900/60';
        const textColor = isPredicted ? 'text-white' : 'text-gray-400';
        
        return (
          <div key={cls} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className={`font-medium ${textColor}`}>{displayName}</span>
              <span className={`font-mono ${textColor}`}>{percent}%</span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-2.5 rounded-full ${barColor} shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-1000 ease-out`}
                style={{ width: `${Math.max(percent, 2)}%` }} // Give at least 2% so bar is visible
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProbabilityChart;
