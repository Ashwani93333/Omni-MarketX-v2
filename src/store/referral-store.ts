import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReferralInvite {
  id: string;
  name: string;
  initials: string;
  date: string;
  reward: number;
  status: "paid" | "pending";
}

export interface RewardMilestone {
  friends: number;
  reward: number;
  label: string;
}

export const REFERRAL_BASE_REWARD = 25;

export const REWARD_MILESTONES: RewardMilestone[] = [
  { friends: 1, reward: 10, label: "First friend" },
  { friends: 3, reward: 25, label: "Three traders" },
  { friends: 5, reward: 50, label: "Fivesome" },
  { friends: 10, reward: 100, label: "Double digits" },
];

const seedInvites: ReferralInvite[] = [
  {
    id: "inv-001",
    name: "Mia Crypto",
    initials: "MC",
    date: "Sep 4, 2026",
    reward: 25,
    status: "paid",
  },
  {
    id: "inv-002",
    name: "Kaden Sterling",
    initials: "KS",
    date: "Sep 1, 2026",
    reward: 25,
    status: "paid",
  },
  {
    id: "inv-003",
    name: "Nova Hodl",
    initials: "NH",
    date: "Aug 28, 2026",
    reward: 10,
    status: "paid",
  },
  {
    id: "inv-004",
    name: "Zoe Vega",
    initials: "ZV",
    date: "Jul 15, 2026",
    reward: 25,
    status: "paid",
  },
  {
    id: "inv-005",
    name: "Jay Cross",
    initials: "JC",
    date: "Sep 6, 2026",
    reward: 25,
    status: "pending",
  },
  {
    id: "inv-006",
    name: "Sana Malik",
    initials: "SM",
    date: "Sep 8, 2026",
    reward: 25,
    status: "pending",
  },
];

interface ReferralState {
  pro: boolean;
  invites: ReferralInvite[];
  setPro: (pro: boolean) => void;
  addInvite: (invite: {
    name: string;
    initials: string;
    date: string;
  }) => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      pro: false,
      invites: seedInvites,
      setPro: (pro) => set({ pro }),
      addInvite: ({ name, initials, date }) =>
        set((s) => ({
          invites: [
            {
              id: `inv-${Date.now()}`,
              name,
              initials,
              date,
              reward: s.pro ? REFERRAL_BASE_REWARD * 2 : REFERRAL_BASE_REWARD,
              status: "pending",
            },
            ...s.invites,
          ],
        })),
    }),
    { name: "omx-referrals" }
  )
);

export function referralTotals(invites: ReferralInvite[]) {
  const paid = invites.filter((i) => i.status === "paid");
  const pending = invites.filter((i) => i.status === "pending");
  return {
    friends: invites.length,
    earned: paid.reduce((sum, i) => sum + i.reward, 0),
    pending: pending.reduce((sum, i) => sum + i.reward, 0),
  };
}