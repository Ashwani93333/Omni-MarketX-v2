import { createRng, hashString } from "@/mocks/market-activity";
import type { Market, MarketNewsArticle } from "@/types";

const SOURCES = [
  "Reuters",
  "Bloomberg Lens",
  "The Block",
  "MarketPulse",
  "CryptoWire",
  "Axios Economy",
];

const HEADLINE_TEMPLATES = [
  "Analysts split on {topic} — here's the bull case",
  "New data point puts {topic} back in focus",
  "Funds rotate as {topic} odds shift",
  "What the tape says about {topic} this week",
  "Option desks lean cautious on {topic}",
  "Traders position ahead of the {topic} catalyst",
  "One chart explains the move in {topic}",
  "Institutional flow picks up around {topic}",
];

const EXCERPTS = [
  "A fresh batch of filings and commentary has traders repricing probability, with several large orders hitting the book this morning.",
  "Economists and strategists are debating the base case, and the market is starting to move in sympathy with the revised outlook.",
  "Volume has climbed roughly a third versus the weekly average as breakout traders take interest in the outcome.",
  "Sentiment surveys point to a shift, though the tape suggests the sharpest flows may already have run their course.",
  "Commentary from key voices could set today's tone, with several catalysts scheduled before the market closes.",
  "Market makers widened spreads overnight, a classic tell that unresolved headlines are driving two-way risk.",
];

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length) % arr.length];
}

const NOUN_POOL = [
  "crypto markets",
  "rate policy",
  "the semiconductor cycle",
  "token prices",
  "earnings season",
  "regulatory outlook",
];

const topicFor = (market: Market): string => {
  const m = market.title.toLowerCase();
  if (/\b(bitcoin|btc|ethereum|eth|crypto|token|coin)\b/.test(m))
    return "crypto markets";
  if (/\b(rate|fed|inflation|cpi)\b/.test(m)) return "rate policy";
  if (/\b(ai|chip|nvidia|semiconductor)\b/.test(m)) return "the semiconductor cycle";
  if (/\b(earnings|revenue|eps)\b/.test(m)) return "earnings season";
  if (/\b(regulat|sec|law|ban)\b/.test(m)) return "the regulatory outlook";
  return pick(createRng(hashString(market.id)), NOUN_POOL);
};

export const newsService = {
  getMarketNews(market: Market, limit = 4): MarketNewsArticle[] {
    const rng = createRng(hashString(`${market.id}:news`));
    const topic = topicFor(market);
    const impactPool: MarketNewsArticle["impact"][] = ["HIGH", "MEDIUM", "MEDIUM", "LOW"];

    return Array.from({ length: limit }, (_, i): MarketNewsArticle => {
      const sentiment = rng();
      return {
        id: `${market.id}-news-${i}`,
        marketId: market.id,
        source: pick(rng, SOURCES),
        headline: pick(rng, HEADLINE_TEMPLATES).replaceAll("{topic}", topic),
        excerpt: pick(rng, EXCERPTS),
        impact: pick(rng, impactPool),
        sentiment:
          sentiment < 0.35 ? "negative" : sentiment < 0.7 ? "neutral" : "positive",
        minutesAgo: Math.round(20 + rng() * 2000),
        likes: Math.round(rng() * 240),
        comments: Math.round(rng() * 60),
      };
    }).sort((a, b) => a.minutesAgo - b.minutesAgo);
  },
};