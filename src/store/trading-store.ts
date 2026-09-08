"use client";

import { create } from "zustand";

import { positions as initialPositions, trades as initialTrades } from "@/mocks/wallet";
import type { Position, Trade } from "@/types";

interface TradingState {
  balance: number;
  totalIn: number;
  trades: Trade[];
  positions: Position[];
  placeTrade: (input: {
    marketId: string;
    marketTitle: string;
    side: "YES" | "NO";
    amount: number;
    price: number;
  }) => Promise<{ success: boolean }>;
  sellPosition: (input: {
    marketId: string;
    marketTitle: string;
    side: "YES" | "NO";
    amount: number;
    price: number;
  }) => Promise<{ success: boolean }>;
  deposit: (amount: number) => void;
  resetDemo: () => void;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  balance: 9699.94,
  totalIn: 10000,
  trades: initialTrades,
  positions: initialPositions,

  async placeTrade({ marketId, marketTitle, side, amount, price }) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const safePrice = Math.min(0.99, Math.max(0.01, price));
    const shares = Math.round(amount / safePrice);

    const trade: Trade = {
      id: `tr-${Date.now()}`,
      date: new Date().toISOString(),
      market: marketTitle,
      marketId,
      side,
      amount,
      price,
      shares,
      status: "Filled",
    };

    const existing = get().positions.find(
      (p) => p.marketId === marketId && p.side === side
    );

    let positions: Position[];
    if (existing) {
      const totalShares = existing.shares + shares;
      const avg =
        (existing.averagePrice * existing.shares + price * shares) /
        totalShares;
      positions = get().positions.map((p) =>
        p.marketId === marketId && p.side === side
          ? {
              ...p,
              shares: totalShares,
              averagePrice: avg,
              currentPrice: price,
              pnl: Math.round((price - avg) * totalShares * 100) / 100,
            }
          : p
      );
    } else {
      positions = [
        ...get().positions,
        {
          id: `pos-${Date.now()}`,
          marketId,
          marketTitle,
          side,
          shares,
          averagePrice: price,
          currentPrice: price,
          pnl: 0,
        },
      ];
    }

    set({
      balance: Math.round((get().balance - amount) * 100) / 100,
      trades: [trade, ...get().trades],
      positions,
    });
    return { success: true };
  },

  async sellPosition({ marketId, marketTitle, side, amount, price }) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const safePrice = Math.min(0.99, Math.max(0.01, price));
    const shares = Math.round(amount / safePrice);
    const existing = get().positions.find(
      (p) => p.marketId === marketId && p.side === side
    );

    if (!existing || existing.shares < shares) {
      throw new Error("Insufficient shares to sell");
    }

    let positions: Position[];
    const remaining = existing.shares - shares;
    if (remaining <= 0) {
      positions = get().positions.filter(
        (p) => !(p.marketId === marketId && p.side === side)
      );
    } else {
      positions = get().positions.map((p) =>
        p.marketId === marketId && p.side === side
          ? {
              ...p,
              shares: remaining,
              currentPrice: price,
              pnl: Math.round((price - p.averagePrice) * remaining * 100) / 100,
            }
          : p
      );
    }

    const trade: Trade = {
      id: `tr-${Date.now()}`,
      date: new Date().toISOString(),
      market: marketTitle,
      marketId,
      side,
      amount,
      price,
      shares,
      status: "Filled",
    };

    set({
      balance: Math.round((get().balance + amount) * 100) / 100,
      trades: [trade, ...get().trades],
      positions,
    });
    return { success: true };
  },

  deposit(amount) {
    const value = Math.round(amount * 100) / 100;
    set({
      balance: Math.round((get().balance + value) * 100) / 100,
      totalIn: Math.round((get().totalIn + value) * 100) / 100,
    });
  },

  resetDemo() {
    set({
      balance: 10000,
      totalIn: 10000,
      trades: initialTrades,
      positions: initialPositions,
    });
  },
}));