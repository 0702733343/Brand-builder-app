import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Maximize2,
  Cpu,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import { MediumType, MediumConfig, ColorSwatch, VisualDnaAnchor } from '../types';
import { ProceduralMockup } from './ProceduralMockup';

interface MediumCardProps {
  mediumKey: MediumType;
  config: MediumConfig;
  brandName: string;
  category: string;
  colors: ColorSwatch[];
  visualDna: VisualDnaAnchor;
  selectedModel: string;
  onGenerate: (mediumKey: MediumType) => Promise<void>;
  onOpenZoom: (config: MediumConfig, mediumKey: MediumType) => void;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  mediumKey,
  config,
  brandName,
  category,
  colors,
  visualDna,
  selectedModel,
  onGenerate,
  onOpenZoom,
}) => {
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(config.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getMediumIcon = (key: MediumType) => {
    switch (key) {
      case 'billboard':
        return '🛣️';
      case 'newspaper':
        return '📰';
      case 'social':
        return '📱';
      case 'subway':
        return '🚏';
      case 'magazine':
        return '📖';
    }
  };

  const getAspectClass = (ratio: string) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-video';
      case '3:4':
        return 'aspect-[3/4]';
      case '1:1':
        return 'aspect-square';
      case '4:3':
        return 'aspect-[4/3]';
      default:
        return 'aspect-video';
    }
  };

  return (
    <div className="flex flex-col bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl hover:border-neutral-700 transition-all duration-300">
      {/* Card Header */}
      <div className="p-4 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-950/40">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{getMediumIcon(mediumKey)}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">{config.title}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                {config.aspectRatio}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 line-clamp-1">{config.environment}</p>
          </div>
        </div>

        {/* Generate / Action Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onGenerate(mediumKey)}
            disabled={config.isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate shot with Nano-Banana"
          >
            {config.isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>{config.imageUrl ? 'Re-roll' : 'Generate'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Canvas Area */}
      <div className="relative p-3 bg-neutral-950/70 flex items-center justify-center flex-1">
        <div className={`w-full max-w-full ${getAspectClass(config.aspectRatio)} flex items-center justify-center`}>
          <ProceduralMockup
            medium={mediumKey}
            brandName={brandName}
            headline={config.headline}
            subtext={config.subtext}
            category={category}
            colors={colors}
            visualDna={visualDna}
            aspectRatio={config.aspectRatio}
            imageUrl={config.imageUrl}
            onOpenZoom={() => onOpenZoom(config, mediumKey)}
          />
        </div>

        {/* Loading Spinner Overlay */}
        {config.isGenerating && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 z-20">
            <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-xs font-bold text-white">Nano-Banana Generating...</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">Enforcing product consistency & 0 people</p>
            </div>
          </div>
        )}
      </div>

      {/* Headline & Copy Bar */}
      <div className="p-4 border-t border-neutral-800/80 bg-neutral-900/60">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400/90 tracking-wider">
              Medium Headline Copy
            </span>
            <p className="font-bold text-sm text-neutral-100 mt-0.5 leading-snug">{config.headline}</p>
            {config.subtext && (
              <p className="text-xs text-neutral-400 mt-0.5">{config.subtext}</p>
            )}
          </div>

          <button
            onClick={() => onOpenZoom(config, mediumKey)}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors shrink-0"
            title="Inspect in Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Status / Model Info Tag */}
        <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[10px] truncate max-w-[150px]">
              {config.generatedWithModel || selectedModel}
            </span>
          </div>

          <button
            onClick={() => setShowPromptDetails(!showPromptDetails)}
            className="flex items-center gap-1 text-neutral-400 hover:text-amber-400 transition-colors font-medium text-[11px]"
          >
            <span>Consistency Prompt</span>
            {showPromptDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Nano-Banana Prompt & Constraints Inspector */}
        {showPromptDetails && (
          <div className="mt-2.5 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-neutral-400 uppercase">
                Injected Nano-Banana Prompt:
              </span>
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white transition-colors"
              >
                {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-300 font-mono bg-neutral-900/80 p-2 rounded-lg leading-relaxed max-h-24 overflow-y-auto">
              {config.prompt}
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Negative Prompt Locked: NO HUMANS, NO FACES, NO HANDS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
