import React, { useState } from 'react';
import { Header } from './components/Header';
import { MediumCard } from './components/MediumCard';
import { ConsistencyInspector } from './components/ConsistencyInspector';
import { BrandKitDrawer } from './components/BrandKitDrawer';
import { ProductForm } from './components/ProductForm';
import { ImageModal } from './components/ImageModal';
import { BRAND_PRESETS } from './constants/presets';
import { CampaignData, MediumType, MediumConfig } from './types';
import { Sparkles, ShieldCheck, AlertCircle, RefreshCw, Wand2, ArrowRight } from 'lucide-react';

export default function App() {
  const [presets, setPresets] = useState(BRAND_PRESETS);
  const [activePresetId, setActivePresetId] = useState<string>('vortex');
  const [campaign, setCampaign] = useState<CampaignData>(BRAND_PRESETS[0].data);
  const [currentTab, setCurrentTab] = useState<'mediums' | 'inspector' | 'dna'>('mediums');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite-image');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null);

  // Lightbox Zoom Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<MediumConfig | null>(null);
  const [modalMediumKey, setModalMediumKey] = useState<MediumType | null>(null);

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId === 'custom') {
      setIsProductFormOpen(true);
      return;
    }
    const found = presets.find((p) => p.id === presetId);
    if (found) {
      setCampaign(found.data);
      setQuotaNotice(null);
    }
  };

  const handleCustomCampaignSubmit = (newCampaign: CampaignData) => {
    setCampaign(newCampaign);
    setActivePresetId('custom');
    setCurrentTab('mediums');
    setQuotaNotice(null);
  };

  // Generate single medium image using Nano-Banana API
  const handleGenerateMedium = async (mediumKey: MediumType) => {
    const mediumConfig = campaign.mediums[mediumKey];
    if (!mediumConfig) return;

    // Update generating status
    setCampaign((prev) => ({
      ...prev,
      mediums: {
        ...prev.mediums,
        [mediumKey]: {
          ...prev.mediums[mediumKey],
          isGenerating: true,
          error: undefined,
        },
      },
    }));

    try {
      // Find reference image if any other medium has one, to enhance consistency
      let referenceImage: string | undefined = undefined;
      for (const m of Object.values(campaign.mediums)) {
        if (m.imageUrl && m.imageUrl.startsWith('data:image')) {
          referenceImage = m.imageUrl;
          break;
        }
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: mediumConfig.prompt,
          medium: mediumKey,
          aspectRatio: mediumConfig.aspectRatio,
          model: selectedModel,
          referenceImage,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.imageUrl) {
        setCampaign((prev) => ({
          ...prev,
          mediums: {
            ...prev.mediums,
            [mediumKey]: {
              ...prev.mediums[mediumKey],
              imageUrl: data.imageUrl,
              isGenerating: false,
              generatedWithModel: `${selectedModel} (Nano-Banana)`,
            },
          },
        }));
        setQuotaNotice(null);
      } else {
        const errorMsg = data.error || 'Generation failed';
        if (data.isQuotaError) {
          setQuotaNotice(
            `Nano-Banana (${selectedModel}) currently requires a paid tier API key with quota. We've rendered a tailored procedural brand layout using your exact palette and typography! You can attach a key in Settings > Secrets anytime.`
          );
        }
        setCampaign((prev) => ({
          ...prev,
          mediums: {
            ...prev.mediums,
            [mediumKey]: {
              ...prev.mediums[mediumKey],
              isGenerating: false,
              error: errorMsg,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error(err);
      setCampaign((prev) => ({
        ...prev,
        mediums: {
          ...prev.mediums,
          [mediumKey]: {
            ...prev.mediums[mediumKey],
            isGenerating: false,
            error: err.message || 'Network error',
          },
        },
      }));
    }
  };

  // Batch generate all mediums
  const handleBatchGenerate = async () => {
    setIsBatchGenerating(true);
    const keys: MediumType[] = ['billboard', 'newspaper', 'social', 'subway', 'magazine'];
    for (const key of keys) {
      await handleGenerateMedium(key);
    }
    setIsBatchGenerating(false);
  };

  const handleOpenZoom = (config: MediumConfig, mediumKey: MediumType) => {
    setModalConfig(config);
    setModalMediumKey(mediumKey);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0d10] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        presets={presets}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onOpenNewBrand={() => setIsProductFormOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quota or Model Status Notice if relevant */}
        {quotaNotice && (
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-start justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Nano-Banana Model Active</p>
                <p className="text-neutral-300 mt-0.5 leading-relaxed">{quotaNotice}</p>
              </div>
            </div>
            <button
              onClick={() => setQuotaNotice(null)}
              className="text-neutral-400 hover:text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Brand Title & Action Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700">
                {campaign.category}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                Aesthetic: {campaign.brandVibe}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{campaign.brandName}</span>
              <span className="text-sm font-normal text-amber-400/80 font-mono hidden sm:inline">
                [{campaign.colorPalette[0]?.name}]
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mt-1 max-w-2xl font-light">
              "{campaign.tagline}" — imagined across architectural billboard, newsprint broadsheet, and aesthetic social media with strict consistency lock.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchGenerate}
              disabled={isBatchGenerating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBatchGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating All Mediums...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate All with Nano-Banana</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsProductFormOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold border border-neutral-800 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Describe Product</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Mediums Grid */}
        {currentTab === 'mediums' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Negative Prompt Locked: 0 Humans, 0 Faces, 0 Hands
              </span>
              <span>Aspect Ratios: 16:9 · 3:4 · 1:1 · 4:3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <MediumCard
                mediumKey="billboard"
                config={campaign.mediums.billboard}
                brandName={campaign.brandName}
                category={campaign.category}
                colors={campaign.colorPalette}
                visualDna={campaign.visualDnaAnchor}
                selectedModel={selectedModel}
                onGenerate={handleGenerateMedium}
                onOpenZoom={(cfg) => handleOpenZoom(cfg, 'billboard')}
              />

              <MediumCard
                mediumKey="newspaper"
                config={campaign.mediums.newspaper}
                brandName={campaign.brandName}
                category={campaign.category}
                colors={campaign.colorPalette}
                visualDna={campaign.visualDnaAnchor}
                selectedModel={selectedModel}
                onGenerate={handleGenerateMedium}
                onOpenZoom={(cfg) => handleOpenZoom(cfg, 'newspaper')}
              />

              <MediumCard
                mediumKey="social"
                config={campaign.mediums.social}
                brandName={campaign.brandName}
                category={campaign.category}
                colors={campaign.colorPalette}
                visualDna={campaign.visualDnaAnchor}
                selectedModel={selectedModel}
                onGenerate={handleGenerateMedium}
                onOpenZoom={(cfg) => handleOpenZoom(cfg, 'social')}
              />

              <MediumCard
                mediumKey="subway"
                config={campaign.mediums.subway}
                brandName={campaign.brandName}
                category={campaign.category}
                colors={campaign.colorPalette}
                visualDna={campaign.visualDnaAnchor}
                selectedModel={selectedModel}
                onGenerate={handleGenerateMedium}
                onOpenZoom={(cfg) => handleOpenZoom(cfg, 'subway')}
              />

              <MediumCard
                mediumKey="magazine"
                config={campaign.mediums.magazine}
                brandName={campaign.brandName}
                category={campaign.category}
                colors={campaign.colorPalette}
                visualDna={campaign.visualDnaAnchor}
                selectedModel={selectedModel}
                onGenerate={handleGenerateMedium}
                onOpenZoom={(cfg) => handleOpenZoom(cfg, 'magazine')}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Consistency Inspector */}
        {currentTab === 'inspector' && (
          <ConsistencyInspector
            campaign={campaign}
            onOpenZoom={(url, title) => {
              setModalConfig({
                title,
                headline: campaign.brandName,
                aspectRatio: '16:9',
                environment: 'Inspection View',
                prompt: campaign.visualDnaAnchor.consistencyLockPrompt,
                imageUrl: url,
              });
              setModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Brand DNA Kit */}
        {currentTab === 'dna' && <BrandKitDrawer campaign={campaign} />}
      </main>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleCustomCampaignSubmit}
        isGeneratingStrategy={isGeneratingStrategy}
        selectedModel={selectedModel}
      />

      {/* Image Zoom Lightbox Modal */}
      <ImageModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        config={modalConfig}
        mediumKey={modalMediumKey}
        brandName={campaign.brandName}
      />

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500 font-mono">
        <p>Brand Builder · Powered by Gemini Nano-Banana Image Model</p>
        <p className="text-[10px] text-neutral-600 mt-1">
          Strict Product Consistency & Depopulated Scene Architecture
        </p>
      </footer>
    </div>
  );
}
