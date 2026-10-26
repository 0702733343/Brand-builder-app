import React, { useState } from 'react';
import { Palette, Copy, Check, Download, Layers, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { CampaignData } from '../types';

interface BrandKitDrawerProps {
  campaign: CampaignData;
}

export const BrandKitDrawer: React.FC<BrandKitDrawerProps> = ({ campaign }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyMasterPrompt = () => {
    navigator.clipboard.writeText(campaign.visualDnaAnchor.consistencyLockPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(campaign, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${campaign.brandName.toLowerCase().replace(/\s+/g, '_')}_brand_kit.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Brand Identity Header Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {campaign.category}
            </span>
            <span className="text-[11px] font-mono text-neutral-400">
              {campaign.brandVibe}
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">{campaign.brandName}</h2>
          <p className="text-sm font-medium text-amber-400/90 mt-1 italic">
            "{campaign.tagline}"
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold border border-neutral-700 transition-colors self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export Brand Deck (JSON)</span>
        </button>
      </div>

      {/* Color Palette Swatches */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Brand Color System</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {campaign.colorPalette.map((color, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(color.hex)}
              className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div
                className="w-full h-16 rounded-lg shadow-inner mb-3 border border-white/10 flex items-center justify-center"
                style={{ backgroundColor: color.hex }}
              >
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedHex === color.hex ? 'COPIED!' : 'COPY HEX'}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white truncate">{color.name}</p>
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono mt-0.5">
                  <span>{color.hex}</span>
                  <span className="capitalize text-[10px] text-neutral-500">{color.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual DNA Architecture */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-white">Visual DNA Specifications</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-amber-400">01 / GEOMETRY & SILHOUETTE</span>
            <p className="text-xs text-neutral-200 mt-2 leading-relaxed">
              {campaign.visualDnaAnchor.geometryAndForm}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-amber-400">02 / MATERIALS & FINISHES</span>
            <p className="text-xs text-neutral-200 mt-2 leading-relaxed">
              {campaign.visualDnaAnchor.materialsAndFinish}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <span className="text-[10px] font-mono uppercase text-amber-400">03 / SIGNATURE DETAILS & EMBLEM</span>
            <p className="text-xs text-neutral-200 mt-2 leading-relaxed">
              {campaign.visualDnaAnchor.signatureDetails}
            </p>
          </div>
        </div>

        {/* Master Consistency Anchor Prompt */}
        <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Master Consistency Lock Prompt</span>
            </div>
            <button
              onClick={handleCopyMasterPrompt}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 transition-colors"
            >
              {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedPrompt ? 'Copied to Clipboard' : 'Copy Anchor'}</span>
            </button>
          </div>
          <p className="text-xs text-neutral-300 font-mono leading-relaxed bg-neutral-900/90 p-3.5 rounded-lg border border-neutral-800/80">
            {campaign.visualDnaAnchor.consistencyLockPrompt}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Strict Depopulation Guarantee: Every generation prompt explicitly forbids human figures, faces, or hands.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
