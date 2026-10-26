import React from 'react';
import { MediumType, ColorSwatch, VisualDnaAnchor } from '../types';
import { ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface ProceduralMockupProps {
  medium: MediumType;
  brandName: string;
  headline: string;
  subtext?: string;
  category: string;
  colors: ColorSwatch[];
  visualDna: VisualDnaAnchor;
  aspectRatio: string;
  imageUrl?: string;
  onOpenZoom?: () => void;
}

export const ProceduralMockup: React.FC<ProceduralMockupProps> = ({
  medium,
  brandName,
  headline,
  subtext,
  category,
  colors,
  visualDna,
  aspectRatio,
  imageUrl,
  onOpenZoom,
}) => {
  const primaryColor = colors[0]?.hex || '#1a1a1a';
  const accentColor = colors[1]?.hex || '#c89d6a';
  const bgColor = colors[2]?.hex || '#0f172a';
  const textColor = colors[3]?.hex || '#f8fafc';

  // If actual generated image is provided, display it with luxury frame styling
  if (imageUrl) {
    return (
      <div className="relative w-full h-full group overflow-hidden rounded-xl bg-neutral-950 flex items-center justify-center cursor-pointer" onClick={onOpenZoom}>
        <img
          src={imageUrl}
          alt={`${brandName} in ${medium}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Subtle glass overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-emerald-400 backdrop-blur-md border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> No People · Verified
            </span>
            <span className="p-2 rounded-lg bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm drop-shadow-md">{headline}</p>
            <p className="text-white/70 text-xs truncate drop-shadow">{visualDna.geometryAndForm}</p>
          </div>
        </div>
      </div>
    );
  }

  // Realistic Procedural Graphic Renderers based on Medium
  if (medium === 'billboard') {
    return (
      <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-slate-950 flex flex-col justify-end p-4 border border-slate-800 shadow-2xl group cursor-pointer" onClick={onOpenZoom}>
        {/* Sky / City Backdrop at Dusk */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1128] via-[#1c1936] to-[#2d1b4e] opacity-90" />
        
        {/* City silhouette at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-16 flex items-end opacity-25">
          <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
            <rect x="10" y="20" width="15" height="40" fill="#cbd5e1" />
            <rect x="30" y="10" width="22" height="50" fill="#cbd5e1" />
            <rect x="60" y="30" width="18" height="30" fill="#cbd5e1" />
            <rect x="85" y="15" width="25" height="45" fill="#cbd5e1" />
            <rect x="120" y="5" width="20" height="55" fill="#cbd5e1" />
            <rect x="150" y="25" width="30" height="35" fill="#cbd5e1" />
            <rect x="190" y="12" width="26" height="48" fill="#cbd5e1" />
            <rect x="230" y="28" width="18" height="32" fill="#cbd5e1" />
            <rect x="260" y="8" width="24" height="52" fill="#cbd5e1" />
            <rect x="300" y="20" width="20" height="40" fill="#cbd5e1" />
            <rect x="330" y="15" width="28" height="45" fill="#cbd5e1" />
            <rect x="370" y="25" width="20" height="35" fill="#cbd5e1" />
          </svg>
        </div>

        {/* Billboard Frame & Canvas */}
        <div className="relative z-10 w-full h-[85%] rounded-lg border-4 border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col justify-between p-6"
             style={{ backgroundColor: primaryColor }}>
          {/* Spotlight floodlight wash */}
          <div className="absolute -top-10 left-1/4 w-1/2 h-32 bg-white/10 blur-2xl rounded-full pointer-events-none" />

          {/* Billboard Content */}
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-black/40 text-neutral-300">
                {category}
              </span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-1 drop-shadow-md">
                {brandName}
              </h2>
            </div>
            <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          </div>

          {/* Centered Monolithic Product Silhouette */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Product Glow */}
              <div className="absolute w-24 h-24 rounded-full blur-xl opacity-40" style={{ backgroundColor: accentColor }} />
              {/* SVG Product Silhouette */}
              <svg width="70" height="110" viewBox="0 0 70 110" fill="none" className="relative z-10 drop-shadow-2xl">
                {/* Cap */}
                <rect x="25" y="8" width="20" height="16" rx="2" fill={accentColor} />
                <rect x="23" y="24" width="24" height="4" fill={accentColor} opacity="0.8" />
                {/* Bottle / Body */}
                <rect x="15" y="28" width="40" height="74" rx="6" fill="#18181b" stroke={accentColor} strokeWidth="1.5" />
                {/* Inner label / highlight */}
                <rect x="20" y="44" width="30" height="34" rx="2" fill={accentColor} opacity="0.15" />
                <text x="35" y="62" fill={textColor} fontSize="7" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                  {brandName}
                </text>
                <text x="35" y="70" fill={accentColor} fontSize="4" textAnchor="middle">
                  EDP 100ML
                </text>
              </svg>
            </div>
          </div>

          {/* Billboard Headline & CTA */}
          <div className="relative z-10 text-center">
            <p className="text-xs md:text-sm font-bold tracking-wide text-white uppercase drop-shadow">
              {headline}
            </p>
            <p className="text-[10px] text-neutral-300 font-mono mt-0.5">
              NO PEOPLE · PURE ARCHITECTURAL HIGHWAY DISPLAY
            </p>
          </div>
        </div>

        {/* Billboard Steel Support Column */}
        <div className="relative z-0 mx-auto w-8 h-4 bg-gradient-to-r from-neutral-700 via-neutral-600 to-neutral-800" />
      </div>
    );
  }

  if (medium === 'newspaper') {
    return (
      <div className="relative w-full h-full min-h-[260px] rounded-xl overflow-hidden bg-[#e8e2d5] text-[#222] p-5 shadow-inner border border-[#d3cbbe] flex flex-col justify-between font-serif group cursor-pointer" onClick={onOpenZoom}>
        {/* Halftone newsprint grain texture simulation */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:4px_4px]" />

        {/* Newspaper Masthead */}
        <div className="relative z-10 border-b-2 border-black pb-2 text-center">
          <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-mono text-neutral-700 mb-1 border-b border-black/30 pb-1">
            <span>THE MORNING CHRONICLE</span>
            <span>EDITION 4,892</span>
            <span>PRINT ARCHIVE</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-neutral-900 font-serif">
            {headline}
          </h1>
          <p className="text-[10px] italic text-neutral-700 mt-0.5">
            Introducing {brandName} · A new milestone in {category}
          </p>
        </div>

        {/* Newspaper Columns & Product Cutout */}
        <div className="relative z-10 grid grid-cols-3 gap-3 my-3 flex-1 items-center">
          {/* Left Column Text */}
          <div className="text-[8px] leading-relaxed text-neutral-800 text-justify">
            <p className="font-bold mb-1">CRAFT & PRECISION</p>
            <p>
              Embodying the philosophy of {visualDna.geometryAndForm}, the new collection stands as a testament to restrained mastery.
            </p>
          </div>

          {/* Center Product Engraving / Halftone Box */}
          <div className="border border-black p-2 bg-[#dfd7c8] flex flex-col items-center justify-center text-center shadow-sm">
            <div className="relative p-2 border border-dashed border-black/50 w-full flex items-center justify-center">
              <svg width="45" height="75" viewBox="0 0 70 110" fill="none" className="contrast-125 filter grayscale">
                <rect x="25" y="8" width="20" height="16" rx="2" fill="#222" />
                <rect x="15" y="28" width="40" height="74" rx="4" fill="#333" stroke="#000" strokeWidth="2" />
                <rect x="20" y="44" width="30" height="34" rx="1" fill="#eee" />
                <text x="35" y="64" fill="#000" fontSize="8" fontWeight="bold" textAnchor="middle">
                  {brandName}
                </text>
              </svg>
            </div>
            <span className="text-[8px] font-mono mt-1 font-bold tracking-widest uppercase">
              FIGURE 1.0
            </span>
          </div>

          {/* Right Column Text */}
          <div className="text-[8px] leading-relaxed text-neutral-800 text-justify">
            <p className="font-bold mb-1">AVAILABILITY</p>
            <p>
              Housed in {visualDna.materialsAndFinish}, without ornamentation or human intrusion. Pure material resonance.
            </p>
          </div>
        </div>

        {/* Newspaper Footer */}
        <div className="relative z-10 border-t border-black pt-1.5 flex justify-between items-center text-[9px] font-mono text-neutral-700">
          <span>LONDON · MILAN · TOKYO · NEW YORK</span>
          <span className="font-bold">PAGE B-12</span>
        </div>
      </div>
    );
  }

  if (medium === 'social') {
    return (
      <div className="relative w-full h-full min-h-[240px] rounded-xl overflow-hidden bg-gradient-to-br from-[#f5ede4] via-[#ebe1d3] to-[#ded2c0] p-4 flex flex-col justify-between shadow-md border border-[#dcd1be] group cursor-pointer" onClick={onOpenZoom}>
        {/* Aesthetic Travertine Stone Texture Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#8c7851_1px,transparent_1px)] [background-size:12px_12px]" />
        
        {/* Soft Diagonal Window Cast Shadow */}
        <div className="absolute -top-12 -right-12 w-48 h-64 bg-black/10 rotate-12 blur-xl pointer-events-none" />

        {/* Minimal Social Post Top Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
              {brandName.charAt(0)}
            </div>
            <div>
              <p className="text-[11px] font-bold text-neutral-900 leading-none">@{brandName.toLowerCase()}.studio</p>
              <p className="text-[9px] text-neutral-500">Commercial Still Life</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/10 text-neutral-800">
            1:1 Flatlay
          </span>
        </div>

        {/* Center Flatlay Arrangement */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
          {/* Subtle Botanical Twig Silhouette Accent */}
          <div className="absolute -left-2 top-4 w-12 h-16 opacity-30 pointer-events-none">
            <svg viewBox="0 0 50 60" fill="none" stroke="#5c4d3c" strokeWidth="1.5">
              <path d="M5 55 Q 20 30 45 5 M 20 35 Q 35 25 38 20 M 15 45 Q 30 40 33 32" />
            </svg>
          </div>

          {/* Product Hero */}
          <div className="relative flex flex-col items-center">
            {/* Cast shadow on stone */}
            <div className="absolute -bottom-2 w-16 h-3 bg-black/25 blur-sm rounded-full" />
            <svg width="65" height="100" viewBox="0 0 70 110" fill="none" className="drop-shadow-xl">
              <rect x="24" y="6" width="22" height="18" rx="2" fill={accentColor} />
              <rect x="14" y="26" width="42" height="76" rx="6" fill={primaryColor} stroke={accentColor} strokeWidth="1.2" />
              <rect x="19" y="44" width="32" height="34" rx="2" fill="#fff" opacity="0.9" />
              <text x="35" y="62" fill="#111" fontSize="7" fontWeight="bold" textAnchor="middle">
                {brandName}
              </text>
              <text x="35" y="70" fill="#666" fontSize="4.5" textAnchor="middle">
                PARFUM
              </text>
            </svg>
          </div>
        </div>

        {/* Social Feed Caption */}
        <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-lg p-2.5 border border-white/60">
          <p className="text-[10px] font-semibold text-neutral-900 leading-tight">
            {headline}
          </p>
          <p className="text-[9px] text-neutral-600 mt-0.5 line-clamp-1">
            No people, pure craft. {visualDna.signatureDetails}
          </p>
        </div>
      </div>
    );
  }

  if (medium === 'subway') {
    return (
      <div className="relative w-full h-full min-h-[240px] rounded-xl overflow-hidden bg-[#070b14] text-white p-4 flex flex-col justify-between border border-slate-800 shadow-2xl group cursor-pointer" onClick={onOpenZoom}>
        {/* Wet night street reflections bokeh */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/20 blur-2xl rounded-full" />
        <div className="absolute top-1/2 -right-10 w-36 h-36 bg-blue-500/20 blur-3xl rounded-full" />
        
        {/* Glass bus shelter structure frame */}
        <div className="absolute inset-2 border-2 border-slate-700/60 rounded-lg pointer-events-none">
          <div className="absolute top-0 right-4 w-8 h-full border-l border-slate-700/40" />
        </div>

        {/* Backlit Poster Card Inside Lightbox */}
        <div className="relative z-10 w-full h-full rounded-md p-4 flex flex-col justify-between"
             style={{ backgroundColor: `${primaryColor}cc` }}>
          {/* Transit Lightbox Header */}
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              TRANSIT LIGHTBOX 04
            </span>
            <span className="text-[9px] text-neutral-400 font-mono">NIGHT RUN</span>
          </div>

          {/* Glowing Product Display */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full blur-xl" style={{ backgroundColor: accentColor, opacity: 0.3 }} />
            <svg width="60" height="95" viewBox="0 0 70 110" fill="none" className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              <rect x="25" y="8" width="20" height="16" rx="2" fill={accentColor} />
              <rect x="15" y="28" width="40" height="74" rx="5" fill="#0d1117" stroke={accentColor} strokeWidth="1.5" />
              <rect x="20" y="46" width="30" height="32" rx="2" fill={accentColor} opacity="0.2" />
              <text x="35" y="64" fill={textColor} fontSize="7" fontWeight="bold" textAnchor="middle">
                {brandName}
              </text>
            </svg>
          </div>

          {/* Footer Copy */}
          <div className="text-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white drop-shadow">
              {headline}
            </h3>
            <p className="text-[9px] text-neutral-400 mt-0.5">
              PASSENGERS & PEDESTRIANS REMOVED · STERILE NIGHT SCENE
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default / Magazine Spread
  return (
    <div className="relative w-full h-full min-h-[220px] rounded-xl overflow-hidden bg-[#18181b] text-white p-5 flex flex-col justify-between border border-neutral-800 shadow-xl group cursor-pointer" onClick={onOpenZoom}>
      {/* Magazine Spine Crease Simulation */}
      <div className="absolute top-0 bottom-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex justify-between items-start">
        <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
          EDITORIAL SPREAD · VOL. 28
        </span>
        <span className="text-[10px] font-mono text-neutral-400">P. 84-85</span>
      </div>

      <div className="relative z-10 my-auto text-center">
        <h2 className="text-xl font-bold tracking-tight text-white mb-2">{headline}</h2>
        <div className="w-12 h-0.5 mx-auto mb-3" style={{ backgroundColor: accentColor }} />
        <p className="text-xs text-neutral-300 max-w-sm mx-auto font-light">
          {brandName} — {visualDna.geometryAndForm}
        </p>
      </div>

      <div className="relative z-10 flex justify-between items-end text-[9px] text-neutral-500 font-mono">
        <span>ARCHITECTURAL MINIMALISM</span>
        <span>NO PEOPLE · MONOGRAPHIC EDITORIAL</span>
      </div>
    </div>
  );
};
