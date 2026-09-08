import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MarketAlert } from "@/types";

interface AlertsState {
  alerts: MarketAlert[];
  add: (alert: Omit<MarketAlert, "id" | "createdAt">) => void;
  remove: (id: string) => void;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set) => ({
      alerts: [],
      add: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            {
              ...alert,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      remove: (id) =>
        set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
    }),
    { name: "omx-alerts" }
  )
);