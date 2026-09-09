import {
  buildDiscussion,
  buildOrderBook,
  buildRecentTrades,
} from "@/mocks/market-activity";
import {
  getMarketById,
  markets,
  topVolumeMovers,
  trendingMarkets,
} from "@/mocks/markets";
import { mockRequest } from "@/services/client";
import { useMarketStore, type CreateMarketInput } from "@/store/market-store";
import type {
  Market,
  MarketDiscussionComment,
  OrderBookLevel,
  RecentTrade,
} from "@/types";

export interface MarketFilters {
  category?: string;
  search?: string;
  sort?: string;
}

function allMarkets(): Market[] {
  return [...useMarketStore.getState().created, ...markets];
}

export const marketService = {
  async getMarkets(filters?: MarketFilters): Promise<Market[]> {
    let result = allMarkets();
    const category = filters?.category;
    const search = filters?.search;
    const sort = filters?.sort;

    if (category && category !== "All") {
      result = result.filter((m) => m.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q) ||
          (m.description ?? "").toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "Volume":
        result.sort((a, b) => b.volume - a.volume);
        break;
      case "Newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Probability":
        result.sort((a, b) => b.probability - a.probability);
        break;
      case "Trending":
      default:
        result.sort(
          (a, b) => (b.priceChange24h ?? 0) - (a.priceChange24h ?? 0)
        );
        break;
    }

    return mockRequest(result, 400);
  },

  async getMarket(id: string): Promise<Market> {
    const created = useMarketStore
      .getState()
      .created.find((m) => m.id === id);
    const market = created ?? getMarketById(id);
    if (!market) {
      throw new Error("Market not found");
    }
    return mockRequest(market, 300);
  },

  async getTrendingMarkets(): Promise<Market[]> {
    const result = trendingMarkets
      .map((id) => getMarketById(id))
      .filter((m): m is Market => Boolean(m));
    return mockRequest(result, 300);
  },

  async getTopVolumeMovers(): Promise<
    {
      marketId: string;
      title: string;
      change: number;
      probability: number;
    }[]
  > {
    return mockRequest(topVolumeMovers, 250);
  },

  async searchMarkets(query: string): Promise<Market[]> {
    const q = query.toLowerCase();
    return mockRequest(
      allMarkets()
        .filter(
          (m) =>
            m.title.toLowerCase().includes(q) ||
            m.category.toLowerCase().includes(q) ||
            (m.description ?? "").toLowerCase().includes(q)
        )
        .slice(0, 5),
      200
    );
  },

  async createMarket(input: CreateMarketInput): Promise<Market> {
    const market = useMarketStore.getState().createMarket(input);
    return mockRequest(market, 600);
  },

  async getOrderBook(
    marketId: string,
    lastPrice: number
  ): Promise<OrderBookLevel[]> {
    return mockRequest(buildOrderBook(marketId, lastPrice), 350);
  },

  async getRecentTrades(
    marketId: string,
    lastPrice: number
  ): Promise<RecentTrade[]> {
    return mockRequest(buildRecentTrades(marketId, lastPrice), 300);
  },

  async getMarketDiscussion(
    marketId: string
  ): Promise<MarketDiscussionComment[]> {
    return mockRequest(buildDiscussion(marketId), 350);
  },
};