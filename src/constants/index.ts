import type { MarketCategory, MarketStatus } from "@/types";

export const APP_NAME = "OmniMarketX";

export const NAV_ITEMS = [
  { label: "Home", href: "/home", icon: "Home" },
  { label: "Wallet", href: "/wallet", icon: "Wallet" },
  { label: "Markets", href: "/markets", icon: "ChartLine" },
  { label: "Heatmap", href: "/heatmap", icon: "LayoutGrid" },
  { label: "Trending", href: "/trending", icon: "TrendingUp" },
  { label: "Activity", href: "/activity", icon: "Activity" },
  { label: "Leaderboard", href: "/leaderboard", icon: "Trophy" },
  { label: "Social", href: "/social", icon: "Users" },
  { label: "Groups", href: "/groups", icon: "UsersRound" },
  { label: "Portfolio", href: "/portfolio", icon: "Briefcase" },
  { label: "Watchlist", href: "/watchlist", icon: "Star" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const CATEGORIES: MarketCategory[] = [
  "Gaming",
  "Crypto",
  "Politics",
  "Sports",
  "Economy",
  "Entertainment",
  "Tech",
  "Science",
];

export const CATEGORY_CHIPS = ["All", ...CATEGORIES];

export const MARKET_STATUSES: MarketStatus[] = ["OPEN", "CLOSED", "RESOLVED"];

export const SORT_OPTIONS = ["Volume", "Newest", "Probability", "Trending"];

export const CHART_RANGES = ["1H", "24H", "7D", "30D", "ALL"] as const;

export const MOBILE_NAV = [
  { label: "Home", href: "/home", icon: "Home" },
  { label: "Markets", href: "/markets", icon: "ChartLine" },
  { label: "Trending", href: "/trending", icon: "TrendingUp" },
  { label: "Portfolio", href: "/portfolio", icon: "Briefcase" },
  { label: "Menu", href: "#menu", icon: "Menu" },
] as const;

export const DEMO_BALANCE = 10000;

export const MOCK_CURRENT_USER: {
  id: string;
  username: string;
  displayName: string;
  email: string;
  initials: string;
  memberSince: string;
} = {
  id: "user-me",
  username: "alexriver",
  displayName: "Alex River",
  email: "alex@omnimarketx.com",
  initials: "AR",
  memberSince: "2026-01-12",
};