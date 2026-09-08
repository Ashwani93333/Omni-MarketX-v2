import { getTraderProfileById } from "@/mocks/traders";
import { mockRequest } from "@/services/client";
import type { TraderProfile } from "@/types";

export const traderService = {
  async getTraderProfile(userId: string): Promise<TraderProfile> {
    const profile = getTraderProfileById(userId);
    if (!profile) {
      throw new Error("Trader not found");
    }
    return mockRequest(profile, 350);
  },
};