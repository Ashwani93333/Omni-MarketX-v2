import type { Achievement } from "@/types";

import { createRng, hashString } from "./market-activity";

export function buildPnLSeries(userId: string) {
  const rng = createRng(hashString(`${userId}::pnl`));
  const points = 30;
  const now = Date.now();
  const final = 884.12;
  const data: { time: string; value: number }[] = [];

  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const target = final * progress;
    const noise = (rng() - 0.5) * 150;
    const value = Math.round((target + noise) * 100) / 100;
    const t = now - (points - 1 - i) * 24 * 60 * 60 * 1000;
    data.push({ time: new Date(t).toISOString(), value });
  }
  data[data.length - 1] = { ...data[data.length - 1], value: final };

  return data;
}

export function buildAnalyticsKpis(userId: string) {
  const rng = createRng(hashString(`${userId}::kpis`));
  return {
    winRate: Math.round(54 + rng() * 14),
    avgWin: Math.round((40 + rng() * 60) * 100) / 100,
    avgLoss: Math.round((20 + rng() * 30) * 100) / 100,
    profitFactor: Math.round((1.3 + rng() * 1.2) * 100) / 100,
    bestDay: Math.round((120 + rng() * 180) * 100) / 100,
    worstDay: Math.round((40 + rng() * 90) * 100) / 100,
    trades: 96,
    netPnl: 884.12,
  };
}

export const achievementCatalog: Achievement[] = [
  {
    id: "ach-001",
    title: "First Trade",
    description: "Place your very first position on any market.",
    icon: "Target",
    tier: "bronze",
    progress: 1,
    target: 1,
    unlocked: true,
    points: 50,
    unlockDate: "2026-01-14",
  },
  {
    id: "ach-002",
    title: "Getting Started",
    description: "Complete 10 trades across any markets.",
    icon: "Zap",
    tier: "bronze",
    progress: 10,
    target: 10,
    unlocked: true,
    points: 75,
    unlockDate: "2026-02-03",
  },
  {
    id: "ach-003",
    title: "First Profit",
    description: "Close a position with positive P&L.",
    icon: "LineChart",
    tier: "bronze",
    progress: 1,
    target: 1,
    unlocked: true,
    points: 100,
    unlockDate: "2026-01-19",
  },
  {
    id: "ach-004",
    title: "Frequent Trader",
    description: "Reach 50 total trades.",
    icon: "TrendingUp",
    tier: "silver",
    progress: 96,
    target: 50,
    unlocked: true,
    points: 150,
    unlockDate: "2026-04-22",
  },
  {
    id: "ach-005",
    title: "Sharp Shooter",
    description: "Hit a 60% win rate over at least 20 trades.",
    icon: "Flame",
    tier: "silver",
    progress: 96,
    target: 20,
    unlocked: true,
    points: 150,
    unlockDate: "2026-06-08",
  },
  {
    id: "ach-006",
    title: "Century Club",
    description: "Complete your 100th trade.",
    icon: "Medal",
    tier: "gold",
    progress: 96,
    target: 100,
    unlocked: false,
    points: 250,
  },
  {
    id: "ach-007",
    title: "Market Maker",
    description: "Trade in at least 5 distinct categories.",
    icon: "UsersRound",
    tier: "silver",
    progress: 4,
    target: 5,
    unlocked: false,
    points: 150,
  },
  {
    id: "ach-008",
    title: "Momentum Hunter",
    description: "Buy YES when probability is trending up 5 days straight.",
    icon: "Rocket",
    tier: "gold",
    progress: 2,
    target: 5,
    unlocked: false,
    points: 250,
  },
  {
    id: "ach-009",
    title: "Community Star",
    description: "Reach 500 followers.",
    icon: "Star",
    tier: "platinum",
    progress: 214,
    target: 500,
    unlocked: false,
    points: 500,
  },
  {
    id: "ach-010",
    title: "Flawless Week",
    description: "Finish a full week with zero losing trades.",
    icon: "ShieldCheck",
    tier: "platinum",
    progress: 0,
    target: 1,
    unlocked: false,
    points: 500,
  },
];