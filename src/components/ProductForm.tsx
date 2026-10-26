import React, { useState } from 'react';
import { Sparkles, X, ShieldAlert, Sliders, CheckCircle2, Wand2, ArrowRight } from 'lucide-react';
import { CampaignData } from '../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: CampaignData) => void;
  isGeneratingStrategy: boolean;
  selectedModel: string;
}

const CATEGORY_SUGGESTIONS = [
  'Luxury Fragrance',
  'Craft Botanical Elixir',
  'Aerospace Spatial Audio',
  'Mechanical Diver Watch',
  'Restorative Skincare Serum',
  'Architectural Ceramic Vessel',
  'Cyberpunk Commuter Helmet',
];

const VIBE_SUGGESTIONS = [
  'Quiet Luxury & Monolithic',
  'Nordic Earthy & Organic',
  'Cyberpunk & High-Tech Titanium',
  'Vintage 1960s Heritage Craft',
  'Minimalist Japanese Brutalism',
];

export const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isGeneratingStrategy,
  selectedModel,
}) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Luxury Fragrance');
  const [productDescription, setProductDescription] = useState('');
  const [brandVibe, setBrandVibe] = useState('Quiet Luxury & Monolithic');
  const [primaryColor, setPrimaryColor] = useState('#c89d6a');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickFill = (presetName: string) => {
    if (presetName === 'fragrance') {
      setProductName('SOLIS AURA');
      setCategory('Luxury Fragrance');
      setProductDescription('A monolithic flacon sculpted from heavy smoked glass with a machined brushed gold pedestal base and magnetic gold cap. Embossed minimalist gold seal.');
      setBrandVibe('Quiet Luxury & Monolithic');
      setPrimaryColor('#d4af37');
    } else if (presetName === 'audio') {
      setProductName('KINETIC ONE');
      setCategory('Aerospace Spatial Audio');
      setProductDescription('Seamless grade-5 titanium wireless open-ear headset with matte ceramic driver pods, micro-perforated acoustic grills, and magnetic dock.');
      setBrandVibe('Cyberpunk & High-Tech Titanium');
      setPrimaryColor('#3b82f6');
    } else if (presetName === 'beverage') {
      setProductName('AETHER COLD BREW');
      setCategory('Craft Botanical Elixir');
      setProductDescription('Slender vertically fluted emerald green apothecary glass bottle with natural Portuguese cork stopper and raw brass neck collar seal.');
      setBrandVibe('Nordic Earthy & Organic');
      setPrimaryColor('#1b4332');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productDescription.trim()) {
      setError('Please provide a product description to imagine across mediums.');
      return;
    }
    setError(null);

    try {
      const response = await fetch('/api/generate-brand-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: productName || 'Unnamed Product',
          productDescription,
          category,
          brandVibe,
          primaryColor,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate campaign strategy');
      }

      const strategy = result.brandStrategy;
      const formattedCampaign: CampaignData = {
        brandName: strategy.brandName || productName || 'NEW BRAND',
        tagline: strategy.tagline || 'Excellence in every medium',
        category: strategy.category || category,
        brandVibe: strategy.brandVibe || brandVibe,
        colorPalette: strategy.colorPalette || [
          { name: 'Primary', hex: primaryColor, role: 'primary' },
          { name: 'Accent', hex: '#ffffff', role: 'accent' },
          { name: 'Dark', hex: '#111827', role: 'background' },
          { name: 'Light', hex: '#f3f4f6', role: 'text' },
        ],
        visualDnaAnchor: strategy.visualDnaAnchor || {
          geometryAndForm: 'Custom product silhouette',
          materialsAndFinish: 'Custom materials and textures',
          signatureDetails: 'Distinctive brand emblem and finish',
          consistencyLockPrompt: productDescription,
        },
        mediums: {
          billboard: {
            title: 'Highway Megaboard',
            headline: strategy.campaignMediums?.billboard?.headline || 'IMAGINE THE SCALE',
            subtext: strategy.campaignMediums?.billboard?.subtext,
            aspectRatio: '16:9',
            environment: strategy.campaignMediums?.billboard?.environment || 'Metropolitan highway billboard at twilight, no people',
            prompt: strategy.campaignMediums?.billboard?.prompt || `Architectural photograph of a massive highway advertising billboard at dusk featuring ${productName}. Absolutely no people, no human figures, no pedestrians.`,
            generatedWithModel: selectedModel,
          },
          newspaper: {
            title: 'Broadsheet Newspaper Print Ad',
            headline: strategy.campaignMediums?.newspaper?.headline || 'A NEW CHAPTER IN DESIGN',
            subtext: strategy.campaignMediums?.newspaper?.subtext,
            aspectRatio: '3:4',
            environment: strategy.campaignMediums?.newspaper?.environment || 'Broadsheet newsprint page with halftone print texture and typography',
            prompt: strategy.campaignMediums?.newspaper?.prompt || `Full-page broadsheet newspaper print ad featuring ${productName} with halftone dot grain texture. Strictly no humans, no people, clean paper layout.`,
            generatedWithModel: selectedModel,
          },
          social: {
            title: 'Aesthetic Studio Flatlay',
            headline: strategy.campaignMediums?.social?.headline || 'DESIGNED FOR STILLNESS',
            subtext: strategy.campaignMediums?.social?.subtext,
            aspectRatio: '1:1',
            environment: strategy.campaignMediums?.social?.environment || 'Travertine stone slab with natural morning window lighting and botanical accents',
            prompt: strategy.campaignMediums?.social?.prompt || `Crisp aesthetic commercial flatlay photo of ${productName} on travertine stone with natural shadows. Absolutely no people, no hands.`,
            generatedWithModel: selectedModel,
          },
          subway: {
            title: 'Urban Transit Shelter Lightbox',
            headline: strategy.campaignMediums?.subway?.headline || 'ILLUMINATE THE NIGHT',
            subtext: strategy.campaignMediums?.subway?.subtext,
            aspectRatio: '4:3',
            environment: strategy.campaignMediums?.subway?.environment || 'Backlit glass bus shelter on a night street with city reflections',
            prompt: strategy.campaignMediums?.subway?.prompt || `Modern illuminated transit bus shelter backlit poster ad at night displaying ${productName}. No people, no pedestrians, empty city sidewalk.`,
            generatedWithModel: selectedModel,
          },
          magazine: {
            title: 'Glossy Editorial Spread',
            headline: strategy.campaignMediums?.magazine?.headline || 'THE ESSENCE OF FORM',
            subtext: strategy.campaignMediums?.magazine?.subtext,
            aspectRatio: '16:9',
            environment: strategy.campaignMediums?.magazine?.environment || 'Double-page luxury magazine spread with museum lighting',
            prompt: strategy.campaignMediums?.magazine?.prompt || `Double-page spread in an oversized high-fashion design magazine showing ${productName} on an architectural pedestal. No people.`,
            generatedWithModel: selectedModel,
          },
        },
      };

      onSubmit(formattedCampaign);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error formulating campaign. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Describe Your Product</h2>
              <p className="text-xs text-neutral-400">
                AI architects your Brand DNA & generates consistent shots across Billboard, Newspaper & Social
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Ideas Bar */}
          <div>
            <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider">
              Quick Inspiration Starters:
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('fragrance')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition-colors"
              >
                ✨ Luxury Fragrance
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('audio')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition-colors"
              >
                🎧 Titanium Audio
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('beverage')}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 border border-neutral-700 transition-colors"
              >
                🍃 Fluted Elixir
              </button>
            </div>
          </div>

          {/* Product Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Product / Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. AURA ONE, SOLIS, KINETIC"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Product Category
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Product Visual Details / DNA */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-neutral-300">
                Product Description & Visual Details <span className="text-amber-400">*</span>
              </label>
              <span className="text-[11px] text-neutral-500">
                Geometry, materials, cap/closures, logos
              </span>
            </div>
            <textarea
              rows={4}
              required
              placeholder="Describe your product in detail: What is the shape? What materials (frosted glass, brushed bronze, titanium, matte ceramic)? What are the distinct finishes, caps, badges, or textures? This exact visual description will be locked across all mediums..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Aesthetic Vibe & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Brand Aesthetic & Mood
              </label>
              <input
                type="text"
                list="vibe-suggestions"
                value={brandVibe}
                onChange={(e) => setBrandVibe(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
              />
              <datalist id="vibe-suggestions">
                {VIBE_SUGGESTIONS.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Signature Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-neutral-950 border border-neutral-800 p-1"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Strict Consistency & No-People Guarantee Callout */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-semibold text-emerald-300">
                Consistency Anchor & Strict No-People Enforced
              </p>
              <p className="text-neutral-400 mt-0.5 leading-relaxed">
                The visual identity anchor locks the geometry, materials, and branding across Billboard, Newspaper, and Social shots. Every generation prompt strictly prohibits people, crowds, or hands.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGeneratingStrategy}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingStrategy ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Formulating Brand Consistency...</span>
                </>
              ) : (
                <>
                  <span>Imagine Across Mediums</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
