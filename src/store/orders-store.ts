import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { OpenOrder } from "@/types";

const seedOrders: OpenOrder[] = [
  {
    id: "o-001",
    marketId: "m-002",
    marketTitle: "Will Bitcoin close above $75,000 by the end of September?",
    side: "YES",
    type: "LIMIT",
    price: 0.44,
    shares: 120,
    placedAt: new Date().toISOString(),
  },
  {
    id: "o-002",
    marketId: "m-014",
    marketTitle: "Will the AI chipmaker announce a new flagship before Q4?",
    side: "NO",
    type: "LIMIT",
    price: 0.28,
    shares: 80,
    placedAt: new Date().toISOString(),
  },
];

interface OrdersState {
  openOrders: OpenOrder[];
  cancel: (id: string) => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      openOrders: seedOrders,
      cancel: (id) =>
        set((s) => ({
          openOrders: s.openOrders.filter((o) => o.id !== id),
        })),
    }),
    { name: "omx-open-orders" }
  )
);