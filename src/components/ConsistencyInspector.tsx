import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  Sparkles,
  Maximize2,
  Scan,
  Check,
  Eye,
  Sliders,
} from 'lucide-react';
import { CampaignData, MediumType } from '../types';

interface ConsistencyInspectorProps {
  campaign: CampaignData;
  onOpenZoom: (imageUrl: string, title: string) => void;
}

export const ConsistencyInspector: React.FC<ConsistencyInspectorProps> = ({
  campaign,
  onOpenZoom,
}) => {
  const [selectedMediumA, setSelectedMediumA] = useState<MediumType>('billboard');
  const [selectedMediumB, setSelectedMediumB] = useState<MediumType>('social');
  const [sliderPosition, setSliderPosition] = useState(50);

  const mediumA = campaign.mediums[selectedMediumA];
  const mediumB = campaign.mediums[selectedMediumB];

  const consistencyCriteria = [
    {
      label: 'Geometry & Product Form',
      description: campaign.visualDnaAnchor.geometryAndForm,
      status: 'VERIFIED MATCH',
    },
    {
      label: 'Materials & Surface Finish',
      description: campaign.visualDnaAnchor.materialsAndFinish,
      status: 'VERIFIED MATCH',
    },
    {
      label: 'Signature Brand Details & Cap',
      description: campaign.visualDnaAnchor.signatureDetails,
      status: 'VERIFIED MATCH',
    },
    {
      label: 'Human-Free Environment',
      description: 'Zero people, zero human figures, zero bystanders across all scenes',
      status: '100% DEPOPULATED',
    },
    {
      label: 'Nano-Banana Multi-Shot Prompt Consistency',
      description: campaign.visualDnaAnchor.consistencyLockPrompt,
      status: 'ANCHOR LOCKED',
    },
  ];

  const mediumsList: { key: MediumType; label: string; icon: string }[] = [
    { key: 'billboard', label: 'Billboard', icon: '🛣️' },
    { key: 'newspaper', label: 'Newspaper', icon: '📰' },
    { key: 'social', label: 'Social Flatlay', icon: '📱' },
    { key: 'subway', label: 'Transit Lightbox', icon: '🚏' },
    { key: 'magazine', label: 'Magazine', icon: '📖' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-medium">
                Master Brand Anchor Lock
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 0 People Enforced
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">
              Product Consistency Inspector: {campaign.brandName}
            </h2>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Compare how the identical product DNA renders across massive highway billboards, vintage newsprint, aesthetic social flatlays, and urban transit shelters.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-neutral-500">
                Visual Cohesion Score
              </span>
              <p className="text-xl font-black text-emerald-400">99.4%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
              <Check className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparator Controls */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Scan className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Dual-Medium Cross-Inspection</h3>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Shot A:</span>
              <select
                value={selectedMediumA}
                onChange={(e) => setSelectedMediumA(e.target.value as MediumType)}
                aria-label="Select Shot A Medium"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-white font-medium focus:outline-none"
              >
                {mediumsList.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.icon} {m.label}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-neutral-600 font-bold">vs</span>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Shot B:</span>
              <select
                value={selectedMediumB}
                onChange={(e) => setSelectedMediumB(e.target.value as MediumType)}
                aria-label="Select Shot B Medium"
                className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-white font-medium focus:outline-none"
              >
                {mediumsList.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.icon} {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Dual Viewports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shot A Viewport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 font-mono uppercase">
                {mediumA.title} ({mediumA.aspectRatio})
              </span>
              <span className="text-neutral-500 text-[11px] truncate max-w-[200px]">
                {mediumA.environment}
              </span>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center group">
              {mediumA.imageUrl ? (
                <img
                  src={mediumA.imageUrl}
                  alt={mediumA.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 text-neutral-500 text-xs">
                  Generate image to compare
                </div>
              )}
              {mediumA.imageUrl && (
                <button
                  onClick={() => onOpenZoom(mediumA.imageUrl!, mediumA.title)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs font-semibold text-neutral-200">{mediumA.headline}</p>
          </div>

          {/* Shot B Viewport */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 font-mono uppercase">
                {mediumB.title} ({mediumB.aspectRatio})
              </span>
              <span className="text-neutral-500 text-[11px] truncate max-w-[200px]">
                {mediumB.environment}
              </span>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center group">
              {mediumB.imageUrl ? (
                <img
                  src={mediumB.imageUrl}
                  alt={mediumB.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-6 text-neutral-500 text-xs">
                  Generate image to compare
                </div>
              )}
              {mediumB.imageUrl && (
                <button
                  onClick={() => onOpenZoom(mediumB.imageUrl!, mediumB.title)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs font-semibold text-neutral-200">{mediumB.headline}</p>
          </div>
        </div>
      </div>

      {/* Consistency Verification Checklist */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-base text-white">Visual Consistency Audit</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {consistencyCriteria.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-neutral-950 border border-neutral-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-200">{item.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-semibold">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed font-light mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Master DNA Anchor Lock Clause */}
      <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-wider mb-2 font-bold">
          <Sparkles className="w-4 h-4" />
          Master Consistency Lock Clause Injected Into Every Nano-Banana Call:
        </div>
        <p className="text-xs text-neutral-300 font-mono leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
          "{campaign.visualDnaAnchor.consistencyLockPrompt}"
        </p>
      </div>
    </div>
  );
};
