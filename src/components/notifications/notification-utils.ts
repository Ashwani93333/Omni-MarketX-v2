import {
  AtSign,
  Gift,
  Info,
  Megaphone,
  MessageCircle,
  ShoppingBag,
  TrendingDown,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import type {
  NotificationCategory,
  NotificationItem,
} from "@/types";

export const NOTIFICATION_CATEGORY_TABS: NotificationCategory[] = [
  "TRADE",
  "SOCIAL",
  "REWARD",
  "ANNOUNCEMENT",
  "SYSTEM",
];

export const NOTIFICATION_CATEGORY_LABELS: Record<
  NotificationCategory,
  string
> = {
  TRADE: "Trades",
  SOCIAL: "Social",
  REWARD: "Rewards",
  ANNOUNCEMENT: "Announcements",
  SYSTEM: "System",
};

export const NOTIFICATION_TYPE_ICONS: Record<
  NotificationItem["type"],
  LucideIcon
> = {
  trade: ShoppingBag,
  market: TrendingDown,
  follow: UserPlus,
  comment: MessageCircle,
  mention: AtSign,
  group: Users,
  reward: Gift,
  announcement: Megaphone,
  system: Info,
};

export function getNotificationCategory(
  type: NotificationItem["type"]
): NotificationCategory {
  switch (type) {
    case "trade":
    case "market":
      return "TRADE";
    case "follow":
    case "comment":
    case "mention":
    case "group":
      return "SOCIAL";
    case "reward":
      return "REWARD";
    case "announcement":
      return "ANNOUNCEMENT";
    case "system":
      return "SYSTEM";
  }
}

export function getNotificationRoute(n: NotificationItem): string {
  switch (n.category ?? getNotificationCategory(n.type)) {
    case "TRADE":
      return "/markets";
    case "REWARD":
      return "/leaderboard";
    case "SYSTEM":
    case "ANNOUNCEMENT":
      return "/settings";
    case "SOCIAL":
    default:
      return "/social";
  }
}