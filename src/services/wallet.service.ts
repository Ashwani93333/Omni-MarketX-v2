import { getPortfolioSummary, positions, trades } from "@/mocks/wallet";
import { mockRequest } from "@/services/client";
import type { Position, Trade } from "@/types";

export const walletService = {
  async getBalance(): Promise<{ balance: number; totalIn: number }> {
    return mockRequest({ balance: 9699.94, totalIn: 10000 }, 300);
  },

  async getTrades(): Promise<Trade[]> {
    return mockRequest(trades, 350);
  },

  async placeTrade(input: {
    marketId: string;
    side: "YES" | "NO";
    amount: number;
    price: number;
  }): Promise<{ success: boolean; tradeId: string }> {
    await mockRequest({ success: true, tradeId: `tr-${Date.now()}` }, 900);
    return { success: true, tradeId: `tr-${Date.now()}` };
  },

  async resetDemoAccount(): Promise<{ balance: number }> {
    return mockRequest({ balance: 10000 }, 1200);
  },
};

export const portfolioService = {
  async getPositions(): Promise<Position[]> {
    return mockRequest(positions, 350);
  },

  async getSummary() {
    return mockRequest(getPortfolioSummary(), 300);
  },

  async getRecentTrades(): Promise<Trade[]> {
    return mockRequest(trades.slice(0, 3), 250);
  },
};