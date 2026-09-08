import {
  buildAnalyticsKpis,
  buildPnLSeries,
  achievementCatalog,
} from "@/mocks/analytics";
import { mockRequest } from "@/services/client";
import type { Achievement, TradingAnalytics } from "@/types";

export const analyticsService = {
  async getTradingAnalytics(userId: string): Promise<TradingAnalytics> {
    return mockRequest(
      {
        series: buildPnLSeries(userId),
        kpis: buildAnalyticsKpis(userId),
      },
      400
    );
  },

  async getAchievements(): Promise<Achievement[]> {
    return mockRequest([...achievementCatalog], 350);
  },
};