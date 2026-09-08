"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { MOCK_CURRENT_USER } from "@/constants";

export interface UserProfile {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  initials: string;
}

interface UserState extends UserProfile {
  setProfile: (profile: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

export function getInitials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const initialProfile: UserProfile = {
  displayName: MOCK_CURRENT_USER.displayName,
  username: MOCK_CURRENT_USER.username,
  email: MOCK_CURRENT_USER.email,
  bio: "",
  initials: MOCK_CURRENT_USER.initials,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialProfile,
      setProfile: (profile) =>
        set((state) => {
          const displayName = profile.displayName ?? state.displayName;
          return {
            ...state,
            ...profile,
            displayName,
            username: profile.username ?? state.username,
            email: profile.email ?? state.email,
            bio: profile.bio ?? state.bio,
            initials: getInitials(displayName),
          };
        }),
      resetProfile: () => set(initialProfile),
    }),
    {
      name: "omx-user",
    }
  )
);