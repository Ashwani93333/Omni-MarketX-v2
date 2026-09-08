"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BillingCycle, SubscriptionPlan } from "@/constants/pricing";

interface ProfileInput {
  displayName: string;
  username: string;
  email: string;
}

interface OnboardingState {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  displayName: string;
  username: string;
  email: string;
  interests: string[];
  completed: boolean;
  setPlan: (plan: SubscriptionPlan) => void;
  setBillingCycle: (cycle: BillingCycle) => void;
  setProfile: (profile: ProfileInput) => void;
  toggleInterest: (category: string) => void;
  complete: () => void;
  reset: () => void;
}

const initialState = {
  plan: "FREE" as SubscriptionPlan,
  billingCycle: "MONTHLY" as BillingCycle,
  displayName: "",
  username: "",
  email: "",
  interests: [],
  completed: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setPlan: (plan) => set({ plan }),
      setBillingCycle: (billingCycle) => set({ billingCycle }),
      setProfile: (profile) => set(profile),
      toggleInterest: (category) =>
        set((state) => ({
          interests: state.interests.includes(category)
            ? state.interests.filter((item) => item !== category)
            : [...state.interests, category],
        })),
      complete: () => set({ completed: true }),
      reset: () => set(initialState),
    }),
    {
      name: "omx-onboarding",
    }
  )
);