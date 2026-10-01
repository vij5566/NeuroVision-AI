import React from "react";

const SAMPLES = [
  {
    id: "glioma",
    title: "Glioma Sample",
    subtitle: "Infiltrative Glial Tumor",
    path: "/samples/sample_glioma.jpg",
    badge: "Glioma",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/40",
  },
  {
    id: "meningioma",
    title: "Meningioma Sample",
    subtitle: "Dural-based Extra-axial Lesion",
    path: "/samples/sample_meningioma.jpg",
    badge: "Meningioma",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  },
  {
    id: "notumor",
    title: "Healthy Brain",
    subtitle: "Normal Control / No Tumor",
    path: "/samples/sample_notumor.jpg",
    badge: "No Tumor",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
  {
    id: "pituitary",
    title: "Pituitary Region",
    subtitle: "Sellar Region Tumor",
    path: "/samples/sample_pituitary.jpg",
    badge: "Pituitary",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
];

export default function SampleGallery({ onSelectSample, disabled }) {
  const handleSampleClick = async (sample) => {
    if (disabled) return;
    try {
      const response = await fetch(sample.path);
      const blob = await response.blob();
      const file = new File([blob], `${sample.id}_sample.jpg`, { type: "image/jpeg" });
      onSelectSample(file);
    } catch (err) {
      console.error("Failed to load sample scan:", err);
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-cyan-400/90 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-md">
          Quick Demo
        </span>
        <span className="text-xs text-slate-400">
          Click any verified MRI below to run instant inference without uploading
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SAMPLES.map((sample) => (
          <button
            key={sample.id}
            onClick={() => handleSampleClick(sample)}
            disabled={disabled}
            className="group relative flex flex-col p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-200 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            {/* Thumbnail */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black/60 mb-2 border border-slate-800/80">
              <img
                src={sample.path}
                alt={sample.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span
                className={`absolute top-1.5 left-1.5 text-[10px] font-medium px-1.5 py-0.5 rounded border backdrop-blur-md ${sample.badgeColor}`}
              >
                {sample.badge}
              </span>
            </div>

            {/* Info */}
            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
              {sample.title}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              {sample.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
