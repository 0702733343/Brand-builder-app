import React from 'react';
import { X, Download, ShieldCheck, Cpu, Copy, Check } from 'lucide-react';
import { MediumConfig, MediumType } from '../types';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MediumConfig | null;
  mediumKey: MediumType | null;
  brandName: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  config,
  mediumKey,
  brandName,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !config) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(config.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!config.imageUrl) return;
    const link = document.createElement('a');
    link.href = config.imageUrl;
    link.download = `${brandName.toLowerCase()}_${mediumKey}_shot.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{config.title}</h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {config.aspectRatio}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{brandName} · {config.headline}</p>
          </div>

          <div className="flex items-center gap-2">
            {config.imageUrl && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Image</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex flex-col lg:flex-row gap-6 items-center flex-1">
          {/* Main Visual Display */}
          <div className="w-full lg:w-3/5 flex items-center justify-center bg-black/60 rounded-xl overflow-hidden border border-neutral-800 p-2">
            {config.imageUrl ? (
              <img
                src={config.imageUrl}
                alt={config.title}
                referrerPolicy="no-referrer"
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <div className="p-12 text-center text-neutral-400 text-xs">
                Procedural Preview Mode
              </div>
            )}
          </div>

          {/* Details & Prompt Inspector Sidebar */}
          <div className="w-full lg:w-2/5 space-y-4">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                Environment Staging
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                {config.environment}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  Nano-Banana Locked Prompt
                </span>
                <button
                  onClick={handleCopyPrompt}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-neutral-300 font-mono bg-neutral-900/90 p-3 rounded-lg leading-relaxed max-h-48 overflow-y-auto">
                {config.prompt}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-emerald-300">Depopulated Shot Guaranteed</p>
                <p className="text-neutral-400 text-[11px]">Strict negative prompts prevent any people or hands.</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 font-mono">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                {config.generatedWithModel || 'gemini-3.1-flash-lite-image'}
              </span>
              <span>Aspect: {config.aspectRatio}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
