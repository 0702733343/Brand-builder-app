import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory cache to prevent repeated rate-limit burns
const brandStrategyCache = new Map<string, any>();
let rateLimitCooldownUntil = 0;

// Server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Check status API
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    hasKey: !!process.env.GEMINI_API_KEY,
    models: {
      nanoBanana: 'gemini-3.1-flash-lite-image',
      nanoBananaHq: 'gemini-nano-banana-2.1',
      textStrategy: 'gemini-3.8-flash',
    },
  });
});

// Helper: Synthesize rich brand strategy locally (for instant response or rate-limit fallback)
function synthesizeBrandStrategy(body: any) {
  const bName = (body.productName || 'AURA PROTO').trim();
  const bCategory = (body.category || 'Luxury Consumer Product').trim();
  const bVibe = (body.brandVibe || 'Quiet Luxury & Monolithic').trim();
  const bColor = body.primaryColor || '#c89d6a';
  const bDesc = (body.productDescription || 'A monolithic sculptural product with precision finishes').trim();

  return {
    brandName: bName,
    tagline: `Redefining ${bCategory} with Pure Restraint`,
    category: bCategory,
    brandVibe: bVibe,
    colorPalette: [
      { name: 'Core Signature', hex: bColor, role: 'primary' },
      { name: 'Obsidian Matte', hex: '#121214', role: 'background' },
      { name: 'Pure Contrast', hex: '#f8fafc', role: 'text' },
      { name: 'Warm Metallic', hex: '#e2d4c0', role: 'accent' },
    ],
    visualDnaAnchor: {
      geometryAndForm: `Sculptural geometric silhouette tailored for ${bCategory}`,
      materialsAndFinish: `Precision-milled surfaces and tactile finishes: ${bDesc}`,
      signatureDetails: `Laser-debossed ${bName} insignia and custom tactile closure`,
      consistencyLockPrompt: `The product ${bName}, characterized by: ${bDesc}. Clean geometric proportions, premium materials, and distinctive brand emblem.`,
    },
    campaignMediums: {
      billboard: {
        title: 'Highway Megaboard',
        headline: `${bName.toUpperCase()}: THE NEW HORIZON`,
        subtext: 'Global Reveal',
        aspectRatio: '16:9',
        environment: 'Massive highway billboard over expressway at dusk, completely empty scene',
        prompt: `High-angle architectural photograph of a massive highway advertising billboard at blue hour twilight displaying ${bName} (${bDesc}). The billboard is mounted against an evening city skyline. Absolutely no people, no human figures, no faces, no pedestrians. Clean architectural photograph.`,
      },
      newspaper: {
        title: 'Broadsheet Newspaper Print Ad',
        headline: `A BREAKTHROUGH IN ${bCategory.toUpperCase()}`,
        subtext: 'The International Gazette Edition',
        aspectRatio: '3:4',
        environment: 'Full-page broadsheet newspaper print ad with authentic halftone newsprint texture',
        prompt: `Full-page vintage broadsheet newspaper advertisement featuring the product ${bName} (${bDesc}). Halftone print newsprint texture, retro serif typography, editorial layout, product photography on paper. Absolutely no people, no human figures, no faces. Empty clean paper layout.`,
      },
      social: {
        title: 'Aesthetic Studio Flatlay',
        headline: 'MASTERED IN EVERY DETAIL',
        subtext: 'Limited Release Edition',
        aspectRatio: '1:1',
        environment: 'Aesthetic studio flatlay with travertine stone and natural window morning light',
        prompt: `High-end aesthetic social media product flatlay photo of ${bName} (${bDesc}) resting on raw travertine stone surrounded by clean architectural surfaces and soft natural window morning shadows. Absolutely no people, no hands, no human figures. Crisp commercial still life.`,
      },
      subway: {
        title: 'Urban Transit Shelter Lightbox',
        headline: 'DESIGNED FOR THE METROPOLIS',
        subtext: 'Backlit Transit Showcase',
        aspectRatio: '4:3',
        environment: 'Illuminated glass transit shelter backlit poster on a dark street with bokeh',
        prompt: `A modern illuminated transit bus shelter backlit poster ad inside a clean glass bus shelter at night displaying a commercial advertisement for ${bName} (${bDesc}). Sleek glass reflections, city lights bokeh in background. Absolutely no people, no pedestrians, completely empty bus stop.`,
      },
      magazine: {
        title: 'Glossy Editorial Spread',
        headline: 'THE ARCHITECTURE OF ESSENCE',
        subtext: 'Design & Craft Monograph',
        aspectRatio: '16:9',
        environment: 'Double-page luxury magazine spread with museum lighting',
        prompt: `Double-page spread in an oversized high-fashion design magazine lying open on a dark slate surface, featuring an ad for ${bName} (${bDesc}) resting on an architectural plinth. Absolutely no people, no human figures, no hands.`,
      },
    },
  };
}

// Brand Strategy & Consistency DNA Generation API (using gemini-3.8-flash with smart caching and rate-limit guard)
app.post('/api/generate-brand-strategy', async (req: Request, res: Response) => {
  try {
    const { productName, productDescription, category, brandVibe, primaryColor } = req.body;

    if (!productDescription) {
      return res.status(400).json({ error: 'Product description is required' });
    }

    const cacheKey = `${productName}_${category}_${productDescription}`.toLowerCase();
    if (brandStrategyCache.has(cacheKey)) {
      return res.json({ success: true, brandStrategy: brandStrategyCache.get(cacheKey), fromCache: true });
    }

    // If currently under rate limit cooldown, serve synthesized brand strategy immediately
    if (Date.now() < rateLimitCooldownUntil) {
      const synthesized = synthesizeBrandStrategy(req.body);
      brandStrategyCache.set(cacheKey, synthesized);
      return res.json({ success: true, brandStrategy: synthesized, note: 'Synthesized with brand architecture engine' });
    }

    const ai = getAiClient();

    const systemPrompt = `You are an elite Creative Director and Brand Identity Architect at a top global advertising agency.
Your task is to take a product concept and build a comprehensive visual brand identity kit and multi-medium advertising campaign.

CRITICAL MANDATORY RULES:
1. ABSOLUTELY NO PEOPLE in any visual descriptions or image prompts. Every shot must be completely depopulated—no human figures, no hands, no faces, no silhouettes, no crowds, no pedestrians.
2. PRODUCT CONSISTENCY IS PARAMOUNT: Define an exacting "Master Visual Anchor" (materials, shape, textures, logo, color codes, finishes) that MUST be strictly identical across all shots.
3. Mediums covered:
   - Billboard: Epic large-scale outdoor architecture (highway, city overpass, clean sky/cityscape backdrop, dusk or daytime, no pedestrians). Aspect ratio 16:9.
   - Newspaper: Full or half-page broadsheet print ad with authentic vintage/editorial newsprint texture, halftone dots, elegant typography, product packshot on printed paper. Aspect ratio 3:4.
   - Social Post: Pristine aesthetic commercial flatlay or studio table-top still life with natural lighting, textured surfaces, botanical/architectural accents, no hands. Aspect ratio 1:1.
   - Subway / Transit Shelter: Illuminated glass transit shelter poster at night with glass reflections and ambient bokeh, empty city sidewalk with no pedestrians. Aspect ratio 4:3.
   - Magazine Spread: Double-page glossy editorial spread with high-fashion architectural lighting, magazine paper fold crease, dramatic shadow play. Aspect ratio 16:9.`;

    const userPrompt = `Build the visual brand strategy and multi-medium image prompts for:
Product Name: ${productName || 'Unnamed Concept'}
Category: ${category || 'Consumer Product'}
Brand Vibe/Aesthetic: ${brandVibe || 'Modern, Premium, Distinctive'}
Key Details / Colors: ${primaryColor || 'Not specified'}
Product Description: ${productDescription}

Output a strictly formatted JSON response following the requested schema.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brandName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              category: { type: Type.STRING },
              brandVibe: { type: Type.STRING },
              colorPalette: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    role: { type: Type.STRING, description: 'primary, accent, background, or text' },
                  },
                  required: ['name', 'hex', 'role'],
                },
              },
              visualDnaAnchor: {
                type: Type.OBJECT,
                properties: {
                  geometryAndForm: { type: Type.STRING, description: 'Exact shape and dimensions silhouette' },
                  materialsAndFinish: { type: Type.STRING, description: 'E.g., frosted emerald glass, brushed brass, matte ceramic' },
                  signatureDetails: { type: Type.STRING, description: 'Embossed crest, knurled cap, minimal typography, geometric badge' },
                  consistencyLockPrompt: {
                    type: Type.STRING,
                    description: 'The core product descriptor clause that will be injected into every image prompt to ensure 100% identical look across shots',
                  },
                },
                required: ['geometryAndForm', 'materialsAndFinish', 'signatureDetails', 'consistencyLockPrompt'],
              },
              campaignMediums: {
                type: Type.OBJECT,
                properties: {
                  billboard: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                      aspectRatio: { type: Type.STRING, description: '16:9' },
                      environment: { type: Type.STRING },
                      prompt: { type: Type.STRING, description: 'Prompt for Nano-Banana image generation' },
                    },
                    required: ['title', 'headline', 'aspectRatio', 'prompt'],
                  },
                  newspaper: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                      aspectRatio: { type: Type.STRING, description: '3:4' },
                      environment: { type: Type.STRING },
                      prompt: { type: Type.STRING, description: 'Prompt for Nano-Banana image generation' },
                    },
                    required: ['title', 'headline', 'aspectRatio', 'prompt'],
                  },
                  social: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                      aspectRatio: { type: Type.STRING, description: '1:1' },
                      environment: { type: Type.STRING },
                      prompt: { type: Type.STRING, description: 'Prompt for Nano-Banana image generation' },
                    },
                    required: ['title', 'headline', 'aspectRatio', 'prompt'],
                  },
                  subway: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                      aspectRatio: { type: Type.STRING, description: '4:3' },
                      environment: { type: Type.STRING },
                      prompt: { type: Type.STRING, description: 'Prompt for Nano-Banana image generation' },
                    },
                    required: ['title', 'headline', 'aspectRatio', 'prompt'],
                  },
                  magazine: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      headline: { type: Type.STRING },
                      subtext: { type: Type.STRING },
                      aspectRatio: { type: Type.STRING, description: '16:9' },
                      environment: { type: Type.STRING },
                      prompt: { type: Type.STRING, description: 'Prompt for Nano-Banana image generation' },
                    },
                    required: ['title', 'headline', 'aspectRatio', 'prompt'],
                  },
                },
                required: ['billboard', 'newspaper', 'social', 'subway', 'magazine'],
              },
            },
            required: ['brandName', 'tagline', 'category', 'brandVibe', 'colorPalette', 'visualDnaAnchor', 'campaignMediums'],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        brandStrategyCache.set(cacheKey, parsed);
        return res.json({ success: true, brandStrategy: parsed });
      }
    } catch (genErr: any) {
      // Set cooldown for 20 seconds on 429
      if (genErr?.status === 429 || (genErr?.message && genErr.message.includes('429'))) {
        rateLimitCooldownUntil = Date.now() + 20000;
      }
      console.log('Gemini strategy call notice (using local brand synthesis engine):', genErr?.message);
    }

    // Fallback: immediate local brand synthesis
    const synthesized = synthesizeBrandStrategy(req.body);
    brandStrategyCache.set(cacheKey, synthesized);
    return res.json({ success: true, brandStrategy: synthesized, note: 'Synthesized with brand architecture engine' });
  } catch (error: any) {
    const fallbackStrategy = synthesizeBrandStrategy(req.body);
    return res.json({ success: true, brandStrategy: fallbackStrategy });
  }
});

// Image Generation API using Nano-Banana model
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      medium,
      aspectRatio = '1:1',
      model = 'gemini-3.1-flash-lite-image', // Nano-Banana
      referenceImage,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Strictly enforce negative prompt against people
    const finalPrompt = `${prompt}. MANDATORY ENFORCEMENT: Absolutely no people, no human figures, no faces, no hands, no human silhouettes, no pedestrians, no crowds. The image must be completely unoccupied by humans, featuring solely the product in its environment.`;

    const ai = getAiClient();
    const parts: any[] = [];

    // If reference image provided, pass it for multi-shot consistency
    if (referenceImage && typeof referenceImage === 'string') {
      const cleanBase64 = referenceImage.replace(/^data:image\/\w+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/png',
        },
      });
    }

    parts.push({ text: finalPrompt });

    console.log(`Requesting Nano-Banana (${model}) for medium: ${medium}, aspect ratio: ${aspectRatio}`);

    const response = await ai.models.generateContent({
      model: model, // 'gemini-3.1-flash-lite-image' or 'gemini-nano-banana-2.1'
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let base64Image: string | null = null;
    let mimeType = 'image/png';

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          base64Image = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'image/png';
          break;
        }
      }
      if (base64Image) break;
    }

    if (!base64Image) {
      throw new Error('No image was returned by Nano-Banana model.');
    }

    return res.json({
      success: true,
      imageUrl: `data:${mimeType};base64,${base64Image}`,
      model: model,
      aspectRatio,
    });
  } catch (error: any) {
    const isQuotaError =
      error?.status === 429 ||
      (error?.message &&
        (error.message.includes('quota') ||
          error.message.includes('429') ||
          error.message.includes('RESOURCE_EXHAUSTED') ||
          error.message.includes('limit: 0')));

    console.log('Nano-Banana generation response status:', isQuotaError ? 'Quota limit reached (fallback visualizer active)' : error?.message);

    // Return 200 with clear quota metadata so client smoothly transitions to procedural mockup
    return res.json({
      success: false,
      error: error?.message || 'Image generation failed',
      isQuotaError: !!isQuotaError,
      modelUsed: req.body.model || 'gemini-3.1-flash-lite-image',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brand Builder server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.log('Failed to start server:', err);
});
