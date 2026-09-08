import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CopyAllocation } from "@/types";

export interface CopiedTrader {
  userId: string;
  displayName: string;
  initials: string;
  allocation: CopyAllocation;
  startedAt: string;
  pnl: number;
}

interface CopyState {
  copied: CopiedTrader[];
  freeAllocation: CopyAllocation;
  setFreeAllocation: (a: CopyAllocation) => void;
  startCopy: (t: Omit<CopiedTrader, "startedAt" | "pnl">) => void;
  stopCopy: (userId: string) => void;
}

export const useCopyStore = create<CopyState>()(
  persist(
    (set) => ({
      copied: [],
      freeAllocation: "5",
      setFreeAllocation: (a) => set({ freeAllocation: a }),
      startCopy: (t) =>
        set((s) => {
          if (s.copied.some((c) => c.userId === t.userId)) return s;
          return {
            copied: [
              ...s.copied,
              { ...t, startedAt: new Date().toISOString(), pnl: 0 },
            ],
          };
        }),
      stopCopy: (userId) =>
        set((s) => ({
          copied: s.copied.filter((c) => c.userId !== userId),
        })),
    }),
    { name: "omx-copy-trading" }
  )
);