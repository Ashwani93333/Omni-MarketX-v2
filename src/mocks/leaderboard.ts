import type { LeaderboardEntry, User } from "@/types";

const lbUsers: User[] = [
  {
    id: "u-l1",
    username: "quantjuno",
    displayName: "Quant Juno",
    initials: "QJ",
  },
  {
    id: "u-l2",
    username: "degensage",
    displayName: "Degen Sage",
    initials: "DS",
  },
  {
    id: "u-l3",
    username: "mirandapicks",
    displayName: "Miranda Picks",
    initials: "MP",
  },
  {
    id: "u-l4",
    username: "thefactory",
    displayName: "The Factory",
    initials: "TF",
  },
  {
    id: "u-l5",
    username: "cryptovega",
    displayName: "Crypto Vega",
    initials: "CV",
  },
  {
    id: "u-l6",
    username: "streetsmarts",
    displayName: "StreetSmarts",
    initials: "SS",
  },
  {
    id: "u-l7",
    username: "hawke",
    displayName: "Hawke",
    initials: "HW",
  },
  {
    id: "u-l8",
    username: "lotusdata",
    displayName: "Lotus Data",
    initials: "LD",
  },
];

export const leaderboardRows: LeaderboardEntry[] = [
  {
    id: "lb-001",
    rank: 1,
    user: lbUsers[0],
    roi: 284.6,
    profit: 12482.4,
    trades: 342,
    change: 0,
  },
  {
    id: "lb-002",
    rank: 2,
    user: lbUsers[1],
    roi: 219.3,
    profit: 9865.12,
    trades: 221,
    change: 2,
  },
  {
    id: "lb-003",
    rank: 3,
    user: lbUsers[2],
    roi: 187.9,
    profit: 8754.33,
    trades: 410,
    change: -1,
  },
  {
    id: "lb-004",
    rank: 4,
    user: lbUsers[3],
    roi: 154.2,
    profit: 7421.58,
    trades: 298,
    change: 3,
  },
  {
    id: "lb-005",
    rank: 5,
    user: lbUsers[4],
    roi: 132.7,
    profit: 6874.2,
    trades: 176,
    change: -2,
  },
  {
    id: "lb-006",
    rank: 6,
    user: lbUsers[5],
    roi: 118.4,
    profit: 5231.77,
    trades: 364,
    change: 1,
  },
  {
    id: "lb-007",
    rank: 7,
    user: lbUsers[6],
    roi: 96.8,
    profit: 4412.9,
    trades: 142,
    change: 4,
  },
  {
    id: "lb-008",
    rank: 8,
    user: lbUsers[7],
    roi: 84.5,
    profit: 3890.44,
    trades: 201,
    change: -3,
  },
];

export const risingTraders = [lbUsers[4], lbUsers[6], lbUsers[3]];

export const trendingTraders = [lbUsers[0], lbUsers[1], lbUsers[2]];