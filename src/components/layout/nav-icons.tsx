import {
  Activity,
  Briefcase,
  ChartLine,
  Gift,
  Home,
  LayoutGrid,
  Settings,
  Star,
  TrendingUp,
  Trophy,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { NAV_ITEMS } from "@/constants";

const iconMap: Record<string, LucideIcon> = {
  Home,
  Wallet,
  ChartLine,
  LayoutGrid,
  TrendingUp,
  Activity,
  Trophy,
  Users,
  UsersRound,
  Briefcase,
  Star,
  Settings,
  Gift,
};

type NavIconKey = (typeof NAV_ITEMS)[number]["icon"] | "Gift";

export const navIconByKey: Record<NavIconKey, LucideIcon> = {
  ...(NAV_ITEMS.reduce(
    (acc, item) => {
      acc[item.icon as NavIconKey] = iconMap[item.icon];
      return acc;
    },
    {} as Record<NavIconKey, LucideIcon>
  )),
  Gift,
};

export { iconMap };