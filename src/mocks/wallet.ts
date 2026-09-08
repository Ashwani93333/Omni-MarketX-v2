import type { Position, Transaction, Trade, WalletStats } from "@/types";

export const walletStats: WalletStats = {
  balance: 9699.94,
  totalIn: 10000,
};

export const transactions: Transaction[] = [
  {
    id: "tx-001",
    date: "2026-09-08T09:30:00Z",
    market: "Will Bitcoin close above $75,000 by the end of September?",
    side: "YES",
    amount: 100,
    price: 0.41,
    status: "Filled",
    type: "Trade",
  },
  {
    id: "tx-002",
    date: "2026-09-08T08:12:00Z",
    market: "Will a market crash during the World Cup final?",
    side: "NO",
    amount: 50,
    price: 0.72,
    status: "Filled",
    type: "Trade",
  },
  {
    id: "tx-003",
    date: "2026-09-07T21:44:00Z",
    market: "Demo Funding",
    side: "YES",
    amount: 10000,
    price: 1,
    status: "Filled",
    type: "Deposit",
  },
  {
    id: "tx-004",
    date: "2026-09-07T18:00:00Z",
    market: "Will the AI chipmaker announce a new flagship before Q4?",
    side: "YES",
    amount: 80,
    price: 0.74,
    status: "Filled",
    type: "Trade",
  },
  {
    id: "tx-005",
    date: "2026-09-07T12:20:00Z",
    market: "Referral reward",
    side: "YES",
    amount: 25,
    price: 1,
    status: "Filled",
    type: "Reward",
  },
];

export const trades: Trade[] = [
  {
    id: "tr-001",
    date: "2026-09-08T09:30:00Z",
    market: "Bitcoin above $75,000 by end of September",
    marketId: "m-002",
    side: "YES",
    amount: 100,
    price: 0.41,
    shares: 244,
    status: "Filled",
  },
  {
    id: "tr-002",
    date: "2026-09-08T08:12:00Z",
    market: "Streaming service adds 2M subscribers",
    marketId: "m-013",
    side: "NO",
    amount: 50,
    price: 0.72,
    shares: 69,
    status: "Filled",
  },
  {
    id: "tr-003",
    date: "2026-09-07T18:00:00Z",
    market: "AI chipmaker announces new flagship",
    marketId: "m-014",
    side: "YES",
    amount: 80,
    price: 0.74,
    shares: 108,
    status: "Filled",
  },
  {
    id: "tr-004",
    date: "2026-09-07T15:33:00Z",
    market: "AAA game launches this quarter",
    marketId: "m-001",
    side: "NO",
    amount: 45,
    price: 0.63,
    shares: 71,
    status: "Filled",
  },
];

export const positions: Position[] = [
  {
    id: "pos-001",
    marketId: "m-002",
    marketTitle: "Bitcoin above $75,000 by end of September",
    side: "YES",
    shares: 244,
    averagePrice: 0.41,
    currentPrice: 0.41,
    pnl: 0,
  },
  {
    id: "pos-002",
    marketId: "m-013",
    marketTitle: "Streaming service adds 2M subscribers",
    side: "NO",
    shares: 169,
    averagePrice: 0.62,
    currentPrice: 0.72,
    pnl: 16.9,
  },
  {
    id: "pos-003",
    marketId: "m-014",
    marketTitle: "AI chipmaker announces new flagship",
    side: "YES",
    shares: 108,
    averagePrice: 0.74,
    currentPrice: 0.78,
    pnl: 4.32,
  },
  {
    id: "pos-004",
    marketId: "m-001",
    marketTitle: "AAA game launches this quarter",
    side: "NO",
    shares: 171,
    averagePrice: 0.57,
    currentPrice: 0.63,
    pnl: 10.26,
  },
  {
    id: "pos-005",
    marketId: "m-006",
    marketTitle: "Blockbuster film grosses over $50M opening weekend",
    side: "YES",
    shares: 88,
    averagePrice: 0.72,
    currentPrice: 0.82,
    pnl: 8.8,
  },
  {
    id: "pos-006",
    marketId: "m-003",
    marketTitle: "Federal election called before December",
    side: "NO",
    shares: 112,
    averagePrice: 0.68,
    currentPrice: 0.72,
    pnl: 4.48,
  },
];

export function getPortfolioSummary(): {
  totalValue: number;
  totalPnl: number;
  openPositions: number;
} {
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);
  const totalValue = 10482 + totalPnl;
  return { totalValue, totalPnl, openPositions: positions.length };
}