import React from 'react';
import { Sparkles, Layers, ShieldCheck, Palette, Compass, RefreshCw, Cpu } from 'lucide-react';
import { BrandPreset } from '../types';

interface HeaderProps {
  currentTab: 'mediums' | 'inspector' | 'dna';
  onTabChange: (tab: 'mediums' | 'inspector' | 'dna') => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  presets: BrandPreset[];
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onOpenNewBrand: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedModel,
  onModelChange,
  presets,
  activePresetId,
  onSelectPreset,
  onOpenNewBrand,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black text-lg">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">Brand Builder</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Nano-Banana
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Multi-Medium Product Visualizer · Billboard · Newspaper · Social
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            onClick={() => onTabChange('mediums')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'mediums'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mediums</span>
          </button>
          <button
            onClick={() => onTabChange('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'inspector'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Consistency Lock</span>
          </button>
          <button
            onClick={() => onTabChange('dna')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentTab === 'dna'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Brand DNA</span>
          </button>
        </div>

        {/* Right Controls: Model Selector & Presets */}
        <div className="flex items-center gap-2.5">
          {/* No People Guarantee Indicator */}
          <div className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-[11px]">Depopulated Shots</span>
          </div>

          {/* Model Selector */}
          <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs">
            <Cpu className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            <select
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              aria-label="Select AI Model"
              className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer pr-2 font-mono"
            >
              <option value="gemini-3.1-flash-lite-image" className="bg-neutral-900 text-white">
                Nano-Banana (Flash)
              </option>
              <option value="gemini-nano-banana-2.1" className="bg-neutral-900 text-white">
                Nano-Banana 2.1 (HQ)
              </option>
            </select>
          </div>

          {/* Preset Selector */}
          <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1 text-xs">
            <span className="text-neutral-500 mr-1.5 hidden sm:inline">Preset:</span>
            <select
              value={activePresetId}
              onChange={(e) => onSelectPreset(e.target.value)}
              aria-label="Select Brand Preset"
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-neutral-900 text-white">
                  {preset.name} ({preset.category})
                </option>
              ))}
              <option value="custom" className="bg-neutral-900 text-amber-400">
                + Custom Product
              </option>
            </select>
          </div>

          {/* New Product Button */}
          <button
            onClick={onOpenNewBrand}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Describe Product</span>
          </button>
        </div>
      </div>
    </header>
  );
};
