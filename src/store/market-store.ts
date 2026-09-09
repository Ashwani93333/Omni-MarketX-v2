"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Market, MarketCategory } from "@/types";

export interface CreateMarketInput {
  title: string;
  category: MarketCategory;
  description: string;
  resolutionCriteria: string;
  closesAt: string;
  probability: number;
  marketType?: "BINARY" | "MULTI";
  outcomeLabels?: string[];
  image?: string;
  tags?: string[];
  sourceUrl?: string;
  earlyResolution?: boolean;
  timezone?: string;
}

interface MarketState {
  created: Market[];
  createMarket: (input: CreateMarketInput) => Market;
}

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      created: [],
      createMarket: (input) => {
        const isMulti =
          input.marketType === "MULTI" &&
          (input.outcomeLabels?.filter((l) => l.trim()).length ?? 0) >= 2;

        let probability = input.probability;
        let outcomes: Market["outcomes"];

        if (isMulti) {
          const labels = input.outcomeLabels
            ?.filter((l) => l.trim())
            .slice(0, 5) ?? [];
          const share = Math.floor(100 / labels.length);
          outcomes = labels.map((label, index) => {
            const p =
              index === labels.length - 1
                ? 100 - share * (labels.length - 1)
                : share;
            return { id: `out-${index}`, label, probability: p, price: p / 100 };
          });
          probability = outcomes[0]?.probability ?? 50;
        } else {
          probability = input.probability;
          outcomes = [
            {
              id: "out-yes",
              label: "YES",
              probability,
              price: probability / 100,
            },
            {
              id: "out-no",
              label: "NO",
              probability: 100 - probability,
              price: (100 - probability) / 100,
            },
          ];
        }

        const market: Market = {
          id: `m-${Date.now()}`,
          title: input.title,
          category: input.category,
          probability,
          volume: 0,
          traderCount: 1,
          status: "OPEN",
          createdAt: new Date().toISOString(),
          closesAt: input.closesAt,
          description: input.description,
          resolutionCriteria: input.resolutionCriteria,
          featured: false,
          trend: [],
          priceChange24h: 0,
          source: "community",
          creator: "user-me",
          image: input.image,
          tags: input.tags?.length ? input.tags : undefined,
          sourceUrl: input.sourceUrl,
          earlyResolution: input.earlyResolution,
          timezone: input.timezone,
          outcomes,
        };
        set((s) => ({ created: [market, ...s.created] }));
        return market;
      },
    }),
    {
      name: "omx-markets",
      partialize: (s) => ({ created: s.created }),
    }
  )
);