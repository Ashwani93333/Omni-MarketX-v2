export type MarketCategory =
  | "Gaming"
  | "Crypto"
  | "Politics"
  | "Sports"
  | "Economy"
  | "Entertainment"
  | "Tech"
  | "Science";

export type MarketStatus = "OPEN" | "CLOSED" | "RESOLVED";

export interface MarketOutcome {
  id: string;
  label: string;
  probability: number;
  price: number;
}

export interface Market {
  id: string;
  title: string;
  category: MarketCategory;
  probability: number;
  volume: number;
  traderCount: number;
  status: MarketStatus;
  outcomes?: MarketOutcome[];
  createdAt: string;
  closesAt?: string;
  description?: string;
  resolutionCriteria?: string;
  featured?: boolean;
  trend?: number[];
  priceChange24h?: number;
}

export interface Position {
  id: string;
  marketId: string;
  marketTitle: string;
  side: "YES" | "NO";
  shares: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  initials: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  avatarUrl?: string;
  initials: string;
}

export interface Transaction {
  id: string;
  date: string;
  market: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  status: "Filled" | "Pending" | "Failed";
  type: "Trade" | "Deposit" | "Withdrawal" | "Reward" | "Payout";
}

export interface Trade {
  id: string;
  date: string;
  market: string;
  marketId: string;
  side: "YES" | "NO";
  amount: number;
  price: number;
  shares: number;
  status: "Filled" | "Pending" | "Failed";
}

export interface ActivityPost {
  id: string;
  user: User;
  action: string;
  market?: string;
  marketId?: string;
  time: string;
  type: "trade" | "market" | "social" | "alert" | "achievement";
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  user: User;
  roi: number;
  profit: number;
  trades: number;
  change: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  time: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  market?: Market;
  poll?: Poll;
  image?: boolean;
}

export interface Poll {
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  time: string;
  likes: number;
}

export interface WalletStats {
  balance: number;
  totalIn: number;
}

export interface NotificationItem {
  id: string;
  type:
    | "trade"
    | "market"
    | "follow"
    | "comment"
    | "mention"
    | "group"
    | "reward"
    | "system";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export interface SearchResultGroup {
  label: string;
  items: { id: string; title: string; sub?: string; icon?: string }[];
}

export type OrderSide = "BUY" | "SELL";

export interface OrderBookLevel {
  id: string;
  side: OrderSide;
  price: number;
  shares: number;
  total: number;
}

export interface RecentTrade {
  id: string;
  marketId: string;
  trader: User;
  side: "YES" | "NO";
  price: number;
  shares: number;
  time: string;
}

export interface MarketDiscussionComment {
  id: string;
  marketId: string;
  author: User;
  content: string;
  time: string;
  likes: number;
}

export type AlertDirection = "ABOVE" | "BELOW";

export interface MarketAlert {
  id: string;
  marketId: string;
  marketTitle: string;
  direction: AlertDirection;
  threshold: number;
  createdAt: string;
}

export interface TraderPosition {
  id: string;
  marketId: string;
  marketTitle: string;
  side: "YES" | "NO";
  price: number;
  shares: number;
  pnl: number;
}

export interface TraderProfile {
  id: string;
  user: User;
  bio: string;
  memberSince: string;
  stats: {
    roi: number;
    profit: number;
    trades: number;
    winRate: number;
    followers: number;
    following: number;
  };
  recentPositions: TraderPosition[];
}

export interface PnLPoint {
  time: string;
  value: number;
}

export interface TradingAnalytics {
  series: PnLPoint[];
  kpis: {
    winRate: number;
    avgWin: number;
    avgLoss: number;
    profitFactor: number;
    bestDay: number;
    worstDay: number;
    trades: number;
    netPnl: number;
  };
}

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: AchievementTier;
  progress: number;
  target: number;
  unlocked: boolean;
  points: number;
  unlockDate?: string;
}