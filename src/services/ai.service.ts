import { hashString, createRng } from "@/mocks/market-activity";
import type {
  AiMessage,
  Market,
  MarketAiSummary,
  MarketSentiment,
  SentimentDriver,
} from "@/types";

const TONE_BULLISH_HEADLINES = [
  "Market leans YES — momentum favoring a resolution",
  "Positive drift on buying pressure",
  "Trader sentiment tilting to the YES side",
];

const TONE_BEARISH_HEADLINES = [
  "NO side in control according to the order flow",
  "Bearish pressure builds against the YES outcome",
  "Sentiment fading — market pricing lower odds",
];

const TONE_NEUTRAL_HEADLINES = [
  "Market balanced — no clear directional edge yet",
  "Traders split on how this resolves",
  "Two-way volume keeps odds near a coin flip",
];

const BULLISH_POINTS = [
  "Buy volume has outweighed ask-side pressure in recent sessions.",
  "The probability has held above the 30-day average.",
  "Smart traders are accumulating YES ahead of the next catalyst.",
  "Order book depth favors the YES side at current prices.",
];

const BEARISH_POINTS = [
  "Sell-side flow has been absorbing bids at this level.",
  "Resistance has formed near the recent highs.",
  "Traders who bought early are trimming into strength.",
  "The market has failed to make a higher high twice this month.",
];

const NEUTRAL_POINTS = [
  "Volume has cooled while price consolidates.",
  "Open interest is evenly split between both outcomes.",
  "The next catalyst will likely decide the direction.",
  "Liquidity is thin at current levels, so slippage can be high.",
];

const CATALYST_POOL = [
  "macro data release",
  "earnings call",
  "regulatory update",
  "protocol upgrade",
  "headline event",
  "funding round",
  "voting deadline",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

function toneFor(probability: number): MarketAiSummary["tone"] {
  if (probability >= 58) return "bullish";
  if (probability <= 42) return "bearish";
  return "neutral";
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export const aiService = {
  getAiSummary(market: Market, salt = ""): MarketAiSummary {
    const rng = createRng(hashString(`${market.id}:summary:${salt}`));
    const tone = toneFor(market.probability);
    const headline = pick(rng, {
      bullish: TONE_BULLISH_HEADLINES,
      bearish: TONE_BEARISH_HEADLINES,
      neutral: TONE_NEUTRAL_HEADLINES,
    }[tone]);
    const pointsSource = { bullish: BULLISH_POINTS, bearish: BEARISH_POINTS, neutral: NEUTRAL_POINTS }[tone];
    const points = Array.from({ length: 3 }, () => pick(rng, pointsSource));

    return {
      marketId: market.id,
      tone,
      headline,
      points,
      confidence: Math.round(70 + rng() * 25),
      generatedAt: new Date().toISOString(),
    };
  },

  getMarketSentiment(market: Market): MarketSentiment {
    const rng = createRng(hashString(`${market.id}:sentiment`));
    const drift = rng() * 12 - 6;
    const bullishPct = clamp(Math.round(market.probability + drift), 15, 85);
    const bearishPct = 100 - bullishPct;

    const drivers: SentimentDriver[] = Array.from({ length: 3 }, () => ({
      label: pick(rng, CATALYST_POOL),
      weight: Math.round(45 + rng() * 55),
    })).sort((a, b) => b.weight - a.weight);

    const direction: MarketSentiment["direction"] =
      bullishPct >= 58 ? "bullish" : bullishPct <= 42 ? "bearish" : "balanced";

    return { marketId: market.id, bullishPct, bearishPct, direction, drivers };
  },

  getAssistantReply(
    market: Market,
    prompt: string,
    history: AiMessage[]
  ): AiMessage {
    const rng = createRng(hashString(`${market.id}:reply:${prompt.trim().toLowerCase()}`));
    const p = prompt.toLowerCase();
    const prob = market.probability;
    const price = (prob / 100).toFixed(3);
    const noPrice = ((100 - prob) / 100).toFixed(3);

    let content: string;
    if (/\b(buy|yes|positive)\b/.test(p)) {
      content = `YES shares are currently priced around $${price} (${prob}% probability). Buying YES works if you think the market resolves to the YES side — you profit if final odds exceed ~${prob}%. Median trade size in this market is moderate, so consider sizing in before the next ${pick(rng, CATALYST_POOL)}.`;
    } else if (/\b(no|sell|short)\b/.test(p)) {
      content = `The NO side costs about $${noPrice} (${100 - prob}% probability). Taking NO profits if the market fails to resolve YES. It's a common hedge when odds feel stretched above ${prob}%. Keep in mind resolution criteria before committing.`;
    } else if (/\b(summary|tldr|tl;dr|overview)\b/.test(p)) {
      const s = this.getAiSummary(market);
      content = `${s.headline}. Confidence in this read: ${s.confidence}%. Bullet points: ${s.points.join(" | ")}`;
    } else if (/\b(news|catalyst|news)\b/.test(p)) {
      const s = this.getMarketSentiment(market);
      content = `Key drivers right now: ${s.drivers.map((d) => `${d.label} (weight ${d.weight})`).join(", ")}. ${history.length > 1 ? "Also worth re-checking the order book — depth can shift quickly." : ""}`;
    } else if (/\b(risk|loss|danger)\b/.test(p)) {
      content = `This is a binary market at ${prob}% YES. The main risks are (1) the market resolving against your position, and (2) thin liquidity affecting fills. If you buy YES at $${price}, your downside is roughly $${price} per share — always size to the worst case.`;
    } else {
      content = `Here's my quick read: this market trades at ${prob}% YES ($${price}), with volume of ${market.volume.toLocaleString()}. Watch whether ${pick(rng, CATALYST_POOL)} moves it next. Want me to break down the NO side or the risks?`;
    }

    return {
      id: `ai-${Date.now()}-${Math.floor(rng() * 1e4)}`,
      role: "assistant",
      content,
    };
  },
};