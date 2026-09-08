import type {
  MarketDiscussionComment,
  OrderBookLevel,
  RecentTrade,
} from "@/types";

import { socialUsers } from "./social";

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function createRng(seed: number) {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clampPrice(p: number): number {
  return Number(Math.max(0.001, Math.min(0.999, p)).toFixed(3));
}

export function buildOrderBook(
  marketId: string,
  lastPrice: number
): OrderBookLevel[] {
  const rng = createRng(hashString(`${marketId}::book`));
  const levels: OrderBookLevel[] = [];

  let askPrice = lastPrice + (0.2 + rng() * 0.5) / 100;
  let askTotal = 0;
  for (let i = 0; i < 7; i++) {
    const shares = Math.round((900 + rng() * 2800) * (1 - i / 12));
    askTotal += shares;
    levels.push({
      id: `${marketId}-ask-${i + 1}`,
      side: "SELL",
      price: clampPrice(askPrice),
      shares,
      total: askTotal,
    });
    askPrice += (0.3 + rng() * 1.1) / 100;
  }

  let bidPrice = lastPrice - (0.2 + rng() * 0.5) / 100;
  let bidTotal = 0;
  for (let i = 0; i < 7; i++) {
    const shares = Math.round((900 + rng() * 2800) * (1 - i / 12));
    bidTotal += shares;
    levels.push({
      id: `${marketId}-bid-${i + 1}`,
      side: "BUY",
      price: clampPrice(bidPrice),
      shares,
      total: bidTotal,
    });
    bidPrice -= (0.3 + rng() * 1.1) / 100;
  }

  return levels;
}

export function buildRecentTrades(
  marketId: string,
  lastPrice: number
): RecentTrade[] {
  const rng = createRng(hashString(`${marketId}::trades`));
  const users = [...socialUsers].sort(() => rng() - 0.5);
  const now = Date.now();
  const trades: RecentTrade[] = [];

  for (let i = 0; i < 12; i++) {
    const side = rng() < 0.5 ? ("YES" as const) : ("NO" as const);
    const drift = (rng() - 0.5) * 0.06;
    const price = clampPrice(lastPrice + drift);
    const shares = Math.round(5 + rng() * 400);
    const minsAgo = (rng() * 45 + 2) * (i * 0.4 + 1);
    trades.push({
      id: `${marketId}-t-${i + 1}`,
      marketId,
      trader: users[i % users.length],
      side,
      price,
      shares,
      time: new Date(now - minsAgo * 60 * 1000).toISOString(),
    });
  }

  return trades;
}

const commentTemplates = [
  "I'm long YES here — the fundamentals keep improving.",
  "NO feels like the value side at this price.",
  "Watching the volume pick up on this one.",
  "Adding a small position, liquidity looks good.",
  "Am I crazy for thinking this resolves NO?",
  "Tight spreads make this easy to scale in and out.",
  "Taking profit on part of my YES position today.",
  "Holding until the close. Patience pays in markets like this.",
  "Hmm, recent news could flip this quickly. Be careful.",
  "Filled a buy at the ask, smooth execution.",
  "Price action matches what I've been tracking on-chain.",
  "Classic overreaction — the NO side is mispriced right now.",
];

export function buildDiscussion(marketId: string): MarketDiscussionComment[] {
  const rng = createRng(hashString(`${marketId}::discussion`));
  const users = [...socialUsers].sort(() => rng() - 0.5);
  const count = 4 + Math.floor(rng() * 3);
  const now = Date.now();

  return Array.from({ length: count }, (_, i) => {
    const template = commentTemplates[Math.floor(rng() * commentTemplates.length)];
    return {
      id: `${marketId}-c-${i + 1}`,
      marketId,
      author: users[i % users.length],
      content: template,
      time: new Date(
        now - (i + 1) * (20 + rng() * 120) * 60 * 1000
      ).toISOString(),
      likes: Math.floor(rng() * 24),
    };
  });
}