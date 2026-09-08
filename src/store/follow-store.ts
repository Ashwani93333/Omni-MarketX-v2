import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FollowState {
  followedIds: string[];
  toggle: (id: string) => void;
  clear: () => void;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set) => ({
      followedIds: [],
      toggle: (id) =>
        set((s) => ({
          followedIds: s.followedIds.includes(id)
            ? s.followedIds.filter((x) => x !== id)
            : [...s.followedIds, id],
        })),
      clear: () => set({ followedIds: [] }),
    }),
    { name: "omx-follows" }
  )
);