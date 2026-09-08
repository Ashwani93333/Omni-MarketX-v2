import type { Group } from "@/types";

export const groups: Group[] = [
  {
    id: "g-001",
    name: "Crypto Traders Daily",
    description:
      "Daily crypto market analysis, roundups and YES/NO debates on digital assets.",
    memberCount: 12480,
    category: "Crypto",
    initials: "CT",
  },
  {
    id: "g-002",
    name: "Sports Markets Club",
    description:
      "Game-day predictions, prop markets and friendly banter for the sports crowd.",
    memberCount: 8932,
    category: "Sports",
    initials: "SM",
  },
  {
    id: "g-003",
    name: "The Political Pundits",
    description:
      "Election odds, policy markets and respectful (mostly) political forecasting.",
    memberCount: 6715,
    category: "Politics",
    initials: "PP",
  },
  {
    id: "g-004",
    name: "Gaming Odds HQ",
    description:
      "Release dates, esports brackets and gaming chatter for prediction fans.",
    memberCount: 4521,
    category: "Gaming",
    initials: "GO",
  },
  {
    id: "g-005",
    name: "Frontier Tech Watch",
    description:
      "AI, semiconductors and the next big thing. We trade the timeline.",
    memberCount: 3984,
    category: "Technology",
    initials: "FT",
  },
  {
    id: "g-006",
    name: "Economy & Rates",
    description:
      "GDP, CPI and central bank watchers. Slow moving, high conviction.",
    memberCount: 2870,
    category: "Economy",
    initials: "ER",
  },
  {
    id: "g-007",
    name: "New Traders Lounge",
    description:
      "A friendly place to learn the ropes of prediction markets.",
    memberCount: 15230,
    category: "Education",
    initials: "NT",
  },
  {
    id: "g-008",
    name: "Science & Space Futures",
    description:
      "Launches, missions and scientific milestones priced to perfection.",
    memberCount: 1990,
    category: "Science",
    initials: "SS",
  },
];

export const featuredGroups = [groups[0], groups[3], groups[4]];

export const popularGroups = [groups[6], groups[0], groups[1], groups[5]];

export const myGroups = [groups[0], groups[4], groups[6]];