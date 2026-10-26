export type MediumType = 'billboard' | 'newspaper' | 'social' | 'subway' | 'magazine';

export interface ColorSwatch {
  name: string;
  hex: string;
  role: 'primary' | 'accent' | 'background' | 'text' | string;
}

export interface VisualDnaAnchor {
  geometryAndForm: string;
  materialsAndFinish: string;
  signatureDetails: string;
  consistencyLockPrompt: string;
}

export interface MediumConfig {
  title: string;
  headline: string;
  subtext?: string;
  aspectRatio: '16:9' | '3:4' | '1:1' | '4:3' | '9:16';
  environment: string;
  prompt: string;
  imageUrl?: string;
  isGenerating?: boolean;
  generatedWithModel?: string;
  error?: string;
}

export interface CampaignData {
  brandName: string;
  tagline: string;
  category: string;
  brandVibe: string;
  colorPalette: ColorSwatch[];
  visualDnaAnchor: VisualDnaAnchor;
  mediums: Record<MediumType, MediumConfig>;
}

export interface BrandPreset {
  id: string;
  name: string;
  category: string;
  vibe: string;
  description: string;
  primaryColor: string;
  data: CampaignData;
}
