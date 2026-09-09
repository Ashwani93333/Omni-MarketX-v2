import type { Comment, Post, Story, User } from "@/types";

export const socialUsers: User[] = [
  {
    id: "s-001",
    username: "alexriver",
    displayName: "Alex River",
    initials: "AR",
  },
  {
    id: "s-002",
    username: "miacrypto",
    displayName: "Mia Crypto",
    initials: "MC",
  },
  {
    id: "s-003",
    username: "kadanster",
    displayName: "Kaden Sterling",
    initials: "KS",
  },
  {
    id: "s-004",
    username: "novahodl",
    displayName: "Nova Hodl",
    initials: "NH",
  },
  {
    id: "s-005",
    username: "riskqueen",
    displayName: "RiskQueen",
    initials: "RQ",
  },
];

export const comments: Comment[] = [
  {
    id: "c-001",
    user: socialUsers[1],
    content:
      "I think 63% is overpriced. The last release window slipped twice.",
    time: "12m ago",
    likes: 8,
  },
  {
    id: "c-002",
    user: socialUsers[3],
    content: "Adding NO here. Tight risk/reward.",
    time: "8m ago",
    likes: 3,
  },
];

export const posts: Post[] = [
  {
    id: "post-001",
    user: socialUsers[1],
    content:
      "Gut check: BTC staying above $74K into the weekend feels strong. Who else is holding YES into the close?",
    time: "9m ago",
    likes: 34,
    comments: 12,
    shares: 5,
    liked: false,
    market: {
      id: "m-002",
      title: "Will Bitcoin close above $75,000 by the end of September?",
      category: "Crypto",
      probability: 41,
      volume: 289400,
      traderCount: 3102,
      status: "OPEN",
      createdAt: "2026-09-02T08:30:00Z",
    },
  },
  {
    id: "post-002",
    user: socialUsers[3],
    content:
      "Ran the numbers on the earnings beat series — the media is underselling subscriber growth this quarter.",
    time: "1h ago",
    likes: 21,
    comments: 4,
    shares: 2,
    liked: false,
  },
  {
    id: "post-003",
    user: socialUsers[2],
    content: "Poll for the community 👇",
    time: "2h ago",
    likes: 48,
    comments: 27,
    shares: 9,
    liked: false,
    poll: {
      question: "Which market are you most bullish on this week?",
      options: [
        { label: "Bitcoin $75K", votes: 320 },
        { label: "AI flagship announcement", votes: 214 },
        { label: "Streaming subscribers", votes: 156 },
        { label: "Blockbuster opening week", votes: 98 },
      ],
      totalVotes: 788,
    },
  },
  {
    id: "post-004",
    user: socialUsers[0],
    content:
      "Locking in a small runner on the AI flagship market. The leak timeline lines up with Q4 guidance.",
    time: "3h ago",
    likes: 19,
    comments: 6,
    shares: 1,
    liked: false,
    market: {
      id: "m-014",
      title: "Will the AI chipmaker announce a new flagship before Q4?",
      category: "Tech",
      probability: 74,
      volume: 112400,
      traderCount: 1945,
      status: "OPEN",
      createdAt: "2026-09-01T10:30:00Z",
    },
  },
  {
    id: "post-005",
    user: socialUsers[4],
    content:
      "Weekly P&L review coming up. Sticking to a 2% risk per trade has kept me in the top 50 all month.",
    time: "5h ago",
    likes: 87,
    comments: 15,
    shares: 11,
    liked: false,
  },
  {
    id: "post-006",
    user: socialUsers[3],
    content:
      "The AAA release calendar is packed — if the studio ships on schedule this quarter I\u2019m all-in on YES. Tightened my stop either way.",
    time: "6h ago",
    likes: 14,
    comments: 5,
    shares: 2,
    liked: false,
    market: {
      id: "m-001",
      title: "Will the next major AAA game launch on schedule this quarter?",
      category: "Gaming",
      probability: 63,
      volume: 124500,
      traderCount: 1284,
      status: "OPEN",
      createdAt: "2026-09-01T10:00:00Z",
    },
  },
  {
    id: "post-007",
    user: socialUsers[1],
    content:
      "Subscriber adds are the tell this earnings season. Streaming momentum looks underpriced under 60%.",
    time: "8h ago",
    likes: 9,
    comments: 2,
    shares: 1,
    liked: false,
    market: {
      id: "m-013",
      title: "Will the top streaming service add 2M net subscribers?",
      category: "Entertainment",
      probability: 61,
      volume: 38600,
      traderCount: 598,
      status: "OPEN",
      createdAt: "2026-09-03T15:00:00Z",
    },
  },
  {
    id: "post-008",
    user: socialUsers[4],
    content:
      "Position sizing saved my week. Two losers at 1.5% each, still net positive because the winners ran. Plan the trade, trade the plan.",
    time: "12h ago",
    likes: 63,
    comments: 21,
    shares: 8,
    liked: false,
  },
  {
    id: "post-009",
    user: socialUsers[2],
    content:
      "Eye-tracking leak looks credible — the supply chain threads point to a shipped sensor. Hedging with a small YES runner.",
    time: "1d ago",
    likes: 12,
    comments: 3,
    shares: 0,
    liked: false,
    market: {
      id: "m-007",
      title: "Will a consumer VR headset ship with eye tracking before launch?",
      category: "Tech",
      probability: 44,
      volume: 51200,
      traderCount: 1120,
      status: "OPEN",
      createdAt: "2026-08-25T16:00:00Z",
    },
  },
  {
    id: "post-010",
    user: socialUsers[0],
    content:
      "European squads look scary in the group stage. Grabbing a hedge position before the knockout bracket.",
    time: "1d ago",
    likes: 7,
    comments: 1,
    shares: 0,
    liked: false,
    market: {
      id: "m-015",
      title: "Will a team from Europe win the international esports final?",
      category: "Gaming",
      probability: 38,
      volume: 54200,
      traderCount: 1021,
      status: "OPEN",
      createdAt: "2026-08-29T17:00:00Z",
    },
  },
  {
    id: "post-011",
    user: socialUsers[1],
    content:
      "Quiet day on the books. Scanning rotation candidates for the weekly close — volume is telling me sentiment is shifting.",
    time: "2d ago",
    likes: 5,
    comments: 0,
    shares: 0,
    liked: false,
  },
];

export const searchUsers: User[] = [
  { id: "s-002", username: "miacrypto", displayName: "Mia Crypto", initials: "MC" },
  { id: "u-l1", username: "quantjuno", displayName: "Quant Juno", initials: "QJ" },
  { id: "s-003", username: "kadanster", displayName: "Kaden Sterling", initials: "KS" },
  { id: "s-004", username: "novahodl", displayName: "Nova Hodl", initials: "NH" },
  { id: "s-005", username: "riskqueen", displayName: "RiskQueen", initials: "RQ" },
];

export const stories: Story[] = [
  {
    id: "st-001",
    user: socialUsers[0],
    hasStory: false,
    seen: false,
    items: [],
  },
  {
    id: "st-002",
    user: socialUsers[1],
    hasStory: true,
    seen: false,
    items: [
      {
        id: "sti-001",
        type: "image",
        imageUrl: "https://picsum.photos/seed/mia-crypto1/800/1400",
        createdAt: "2026-09-09T08:30:00Z",
        viewers: ["s-003", "s-004"],
      },
      {
        id: "sti-002",
        type: "text",
        content: "BTC looking incredibly strong above $74K. Weekend close will be telling.",
        gradientFrom: "#f21f68",
        gradientTo: "#ff6b35",
        createdAt: "2026-09-09T09:00:00Z",
        viewers: ["s-003"],
      },
    ],
  },
  {
    id: "st-003",
    user: socialUsers[2],
    hasStory: true,
    seen: false,
    items: [
      {
        id: "sti-003",
        type: "text",
        content: "Just opened a new position on the AI chipmaker market. The Q4 guidance leak looks credible.",
        gradientFrom: "#6366f1",
        gradientTo: "#8b5cf6",
        createdAt: "2026-09-09T07:15:00Z",
        viewers: [],
      },
    ],
  },
  {
    id: "st-004",
    user: socialUsers[3],
    hasStory: false,
    seen: true,
    items: [],
  },
  {
    id: "st-005",
    user: socialUsers[4],
    hasStory: true,
    seen: false,
    items: [
      {
        id: "sti-004",
        type: "image",
        imageUrl: "https://picsum.photos/seed/risk-queen1/800/1400",
        createdAt: "2026-09-09T06:45:00Z",
        viewers: ["s-001", "s-002"],
      },
      {
        id: "sti-005",
        type: "image",
        imageUrl: "https://picsum.photos/seed/risk-queen2/800/1400",
        createdAt: "2026-09-09T07:00:00Z",
        viewers: ["s-001"],
      },
      {
        id: "sti-006",
        type: "text",
        content: "Weekly P&L: +12.4%. Sticking to 2% risk per trade. Patience pays.",
        gradientFrom: "#10b981",
        gradientTo: "#059669",
        createdAt: "2026-09-09T07:30:00Z",
        viewers: [],
      },
    ],
  },
];

