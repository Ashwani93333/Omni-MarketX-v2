import type { Conversation, Message, User } from "@/types";

export const messageUsers: User[] = [
  {
    id: "c-anant",
    username: "anantsingh",
    displayName: "Anant Singh",
    initials: "AS",
  },
  {
    id: "c-ayush",
    username: "ayushcha",
    displayName: "Ayush Chaursaiya",
    initials: "AC",
  },
  {
    id: "c-bala",
    username: "balabhuvan",
    displayName: "Bala Bhuvan",
    initials: "BB",
  },
  {
    id: "c-kaden",
    username: "kadensterling",
    displayName: "Kaden Sterling",
    initials: "KS",
  },
  {
    id: "c-mia",
    username: "miacrypto",
    displayName: "Mia Crypto",
    initials: "MC",
  },
];

export const conversations: Conversation[] = [
  {
    id: "cv-004",
    participant: messageUsers[3],
    lastMessage: "That market is cooking, ngl 🔥",
    timestamp: "2026-09-09T08:12:00.000Z",
    unreadCount: 1,
    type: "MESSAGE",
  },
  {
    id: "cv-003",
    participant: messageUsers[2],
    lastMessage: "👏 Reacted to your story",
    timestamp: "2026-09-04T18:40:00.000Z",
    unreadCount: 1,
    type: "STORY_REACTION",
  },
  {
    id: "cv-002",
    participant: messageUsers[1],
    lastMessage: "😂 Reacted to your story",
    timestamp: "2026-09-04T18:22:00.000Z",
    unreadCount: 0,
    type: "STORY_REACTION",
  },
  {
    id: "cv-001",
    participant: messageUsers[0],
    lastMessage: "😂 Reacted to your story",
    timestamp: "2026-09-04T17:58:00.000Z",
    unreadCount: 1,
    type: "STORY_REACTION",
  },
  {
    id: "cv-005",
    participant: messageUsers[4],
    lastMessage: "Let me look at the leaderboard first",
    timestamp: "2026-09-08T11:05:00.000Z",
    unreadCount: 0,
    type: "MESSAGE",
  },
];

export const messagesByConversation: Record<string, Message[]> = {
  "cv-001": [
    {
      id: "m-anant-1",
      conversationId: "cv-001",
      senderId: "c-anant",
      content: "Hey! Saw your story. Big day on $BTC 👀",
      timestamp: "2026-09-04T17:50:00.000Z",
    },
    {
      id: "m-anant-2",
      conversationId: "cv-001",
      senderId: "user-me",
      content: "Haha thanks! Loading up before the FOMC call.",
      timestamp: "2026-09-04T17:54:00.000Z",
    },
    {
      id: "m-anant-3",
      conversationId: "cv-001",
      senderId: "c-anant",
      content: "😂 Reacted to your story",
      timestamp: "2026-09-04T17:58:00.000Z",
    },
    {
      id: "m-anant-4",
      conversationId: "cv-001",
      senderId: "c-anant",
      content: "How's the $150K price target looking today?",
      timestamp: "2026-09-04T17:59:00.000Z",
    },
  ],
  "cv-002": [
    {
      id: "m-ayush-1",
      conversationId: "cv-002",
      senderId: "c-ayush",
      content: "😂 Reacted to your story",
      timestamp: "2026-09-04T18:22:00.000Z",
    },
  ],
  "cv-003": [
    {
      id: "m-bala-1",
      conversationId: "cv-003",
      senderId: "c-bala",
      content: "👏 Reacted to your story",
      timestamp: "2026-09-04T18:40:00.000Z",
    },
    {
      id: "m-bala-2",
      conversationId: "cv-003",
      senderId: "c-bala",
      content: "That heatmap post was clean. What's your next pick?",
      timestamp: "2026-09-05T09:12:00.000Z",
    },
  ],
  "cv-004": [
    {
      id: "m-kaden-1",
      conversationId: "cv-004",
      senderId: "c-kaden",
      content: "Have you seen the ETH staking market?",
      timestamp: "2026-09-09T07:55:00.000Z",
    },
    {
      id: "m-kaden-2",
      conversationId: "cv-004",
      senderId: "c-kaden",
      content: "That market is cooking, ngl 🔥",
      timestamp: "2026-09-09T08:12:00.000Z",
    },
  ],
  "cv-005": [
    {
      id: "m-mia-1",
      conversationId: "cv-005",
      senderId: "c-mia",
      content: "Your ROI has been insane this month.",
      timestamp: "2026-09-08T10:58:00.000Z",
    },
    {
      id: "m-mia-2",
      conversationId: "cv-005",
      senderId: "user-me",
      content: "Thanks! Copy trading helps 🙂",
      timestamp: "2026-09-08T11:02:00.000Z",
    },
    {
      id: "m-mia-3",
      conversationId: "cv-005",
      senderId: "c-mia",
      content: "Let me look at the leaderboard first",
      timestamp: "2026-09-08T11:05:00.000Z",
    },
  ],
};