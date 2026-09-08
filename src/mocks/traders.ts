import { MOCK_CURRENT_USER } from "@/constants";
import type { TraderPosition, TraderProfile, User } from "@/types";

import { activityUsers } from "./activity";
import { leaderboardRows } from "./leaderboard";
import { createRng, hashString } from "./market-activity";
import { markets } from "./markets";
import { socialUsers } from "./social";

const currentUser: User = {
  id: MOCK_CURRENT_USER.id,
  username: MOCK_CURRENT_USER.username,
  displayName: MOCK_CURRENT_USER.displayName,
  initials: MOCK_CURRENT_USER.initials,
};

const baseUsers: User[] = [
  currentUser,
  ...socialUsers,
  ...activityUsers,
  ...leaderboardRows.map((e) => e.user),
];

const bios = [
  "Markets are my second language. I trade momentum, not noise.",
  "Quant-trained, gut-checked. Long volatility, short FOMO.",
  "Copy-trader friendly: I share my thesis on every position.",
  "Risk first, profits later. Slow and steady wins the quarter.",
  "Crypto, sports, politics — I trade whatever the oracle can settle.",
  "Twelve years in markets. I've seen every bubble burst.",
  "Data over drama. My edge is patience.",
  "Chasing alpha with a strict stop-loss and zero tolerance for hype.",
  "Turbo collector for esports and entertainment markets.",
  "Macro nerd. Inflation, rates, and election years are my playground.",
  "Started with $500 and a spreadsheet. Never looked back.",
  "I lose slowly, win quickly, and journal every trade.",
  "Amateur by day, sharp trader by night. YOLO responsibly.",
  "Don't copy me. Or do — my ROI is public anyway.",
];

const memberSincePool = [
  "2024-03-12",
  "2024-08-02",
  "2025-01-19",
  "2025-06-30",
  "2026-01-12",
];

function buildPositions(userId: string): TraderPosition[] {
  const rng = createRng(hashString(`${userId}::positions`));
  const chosen = new Set<number>();

  return Array.from({ length: 3 }, () => {
    let idx = Math.floor(rng() * markets.length);
    while (chosen.has(idx)) idx = (idx + 1) % markets.length;
    chosen.add(idx);
    const market = markets[idx];
    const side = rng() < 0.5 ? ("YES" as const) : ("NO" as const);
    const price =
      Math.max(0.02, market.probability / 100 + (rng() - 0.5) * 0.12);
    const shares = Math.round(20 + rng() * 400);
    const winPct = 0.45 + rng() * 0.35;
    const pnl =
      (rng() < winPct ? 1 : -1) * Math.round((rng() * 300 + 15) * 100) / 100;
    return {
      id: `${userId}-pos-${idx}`,
      marketId: market.id,
      marketTitle: market.title,
      side,
      price: Math.round(price * 1000) / 1000,
      shares,
      pnl,
    };
  });
}

function buildProfile(user: User): TraderProfile {
  const rng = createRng(hashString(`${user.id}::profile`));
  const lbEntry = leaderboardRows.find((e) => e.user.id === user.id);

  const roi = lbEntry?.roi ?? Math.round((8 + rng() * 180) * 10) / 10;
  const profit = lbEntry?.profit ?? Math.round((200 + rng() * 600) * 100) / 100;
  const trades = lbEntry?.trades ?? Math.round(20 + rng() * 220);

  return {
    id: user.id,
    user,
    bio: bios[Math.floor(rng() * bios.length)],
    memberSince:
      user.id === MOCK_CURRENT_USER.id
        ? MOCK_CURRENT_USER.memberSince
        : memberSincePool[Math.floor(rng() * memberSincePool.length)],
    stats: {
      roi,
      profit,
      trades,
      winRate: Math.round(48 + rng() * 22),
      followers: Math.round(25 + rng() * 500),
      following: Math.round(20 + rng() * 160),
    },
    reputation: {
      score: Math.round(600 + rng() * 400),
      streak: Math.round(3 + rng() * 38),
      weeksProfitable: Math.round(14 + rng() * 38),
    },
    recentPositions: buildPositions(user.id),
  };
}

export const traderProfiles: TraderProfile[] = baseUsers.map(buildProfile);

export function getTraderProfileById(
  userId: string
): TraderProfile | undefined {
  return traderProfiles.find((p) => p.id === userId);
}