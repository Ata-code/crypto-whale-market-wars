
import { GoogleGenAI, Type } from "@google/genai";
import { MarketEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_EVENTS: MarketEvent[] = [
  {
    name: "Whale Manipulation",
    description: "An unknown whale moved 10,000 BTC. Market is confused.",
    effect: "NEUTRAL",
    impactMultiplier: 1.0
  },
  {
    name: "Elon Tweeted a Dog",
    description: "The CEO of X posted a meme. Retail is FOMOing in.",
    effect: "BULLISH",
    impactMultiplier: 1.5
  },
  {
    name: "Exchange Hack",
    description: "A major offshore exchange 'lost' user funds. Panic everywhere.",
    effect: "BEARISH",
    impactMultiplier: 1.8
  },
  {
    name: "Fed Interest Hike",
    description: "The Fed raised rates by 50bps. Risk-off assets are bleeding.",
    effect: "BEARISH",
    impactMultiplier: 1.3
  },
  {
    name: "ETF Approval",
    description: "The SEC finally approved a Spot ETF. Institutional money is flowing.",
    effect: "BULLISH",
    impactMultiplier: 2.0
  },
  {
    name: "Mainnet Upgrade",
    description: "Successful hardfork. Scalability issues are (temporarily) solved.",
    effect: "BULLISH",
    impactMultiplier: 1.2
  },
  {
    name: "Stablecoin Depeg",
    description: "A popular algorithmic stablecoin hit $0.80. Trust is shattered.",
    effect: "BEARISH",
    impactMultiplier: 1.6
  }
];

const getRandomFallback = () => FALLBACK_EVENTS[Math.floor(Math.random() * FALLBACK_EVENTS.length)];

export const fetchMarketEvent = async (): Promise<MarketEvent> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Generate a unique and funny crypto market event. Examples: "Elon Tweeted a Dog", "Fed Rates Hike", "Exchange Hack", "ETF Approval". Respond with strictly JSON.',
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            effect: { 
              type: Type.STRING, 
              enum: ['BULLISH', 'BEARISH', 'NEUTRAL'] 
            },
            impactMultiplier: { 
              type: Type.NUMBER,
              description: 'Between 0.5 and 2.0'
            }
          },
          required: ['name', 'description', 'effect', 'impactMultiplier']
        }
      }
    });

    const text = response.text.trim();
    // Basic sanitization to handle potential Markdown wrapping
    const jsonStr = text.startsWith('```json') ? text.replace(/```json|```/g, '') : text;
    const data = JSON.parse(jsonStr);
    return data;
  } catch (error: any) {
    // Check for rate limit specifically
    if (error?.message?.includes('429') || error?.status === 429) {
      console.warn("Gemini Rate Limit (429) reached. Using high-quality local fallback.");
    } else {
      console.error("Gemini failed, using fallback event", error);
    }
    return getRandomFallback();
  }
};
