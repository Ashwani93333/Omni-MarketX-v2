"use client";

import {
  Flame,
  LineChart,
  Medal,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  UsersRound,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Achievement, AchievementTier } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Target,
  Zap,
  LineChart,
  TrendingUp,
  Flame,
  Medal,
  UsersRound,
  Rocket,
  Star,
  ShieldCheck,
};

const TIER_STYLES: Record<
  AchievementTier,
  { badge: string; icon: string; bar: string }
> = {
  bronze: {
    badge: "bg-orange-light text-orange ring-orange/30",
    icon: "text-orange",
    bar: "bg-orange",
  },
  silver: {
    badge: "bg-blue/10 text-blue ring-blue/30",
    icon: "text-blue",
    bar: "bg-blue",
  },
  gold: {
    badge: "bg-primary-light/70 text-primary ring-primary/30",
    icon: "text-primary",
    bar: "bg-primary",
  },
  platinum: {
    badge: "bg-purple/10 text-purple ring-purple/30",
    icon: "text-purple",
    bar: "bg-purple",
  },
};

export function AchievementCard({
  achievement,
}: {
  achievement: Achievement;
}) {
  const Icon = ICONS[achievement.icon] ?? Medal;
  const tier = TIER_STYLES[achievement.tier];
  const pct = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[16px] border border-border p-5 transition-all",
        achievement.unlocked
          ? "bg-surface shadow-[var(--shadow-sm)]"
          : "bg-surface/60 opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[12px] ring-1",
            achievement.unlocked ? tier.badge : "bg-background text-text-muted"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
            achievement.unlocked
              ? "bg-success-light text-success"
              : "bg-background text-text-muted"
          )}
        >
          {achievement.unlocked ? "Earned" : `${pct}%`}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-bold text-text-primary">
          {achievement.title}
        </h3>
        <p className="text-xs leading-relaxed text-text-secondary">
          {achievement.description}
        </p>
      </div>

      <div className="mt-auto space-y-1.5 pt-1">
        {achievement.unlocked ? (
          <p className="text-[11px] font-semibold text-success">
            +{achievement.points} pts · Earned{" "}
            {achievement.unlockDate ? formatDate(achievement.unlockDate) : ""}
          </p>
        ) : (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
              <div
                className={cn("h-full rounded-full", tier.bar)}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-text-muted">
              <span className="number-tight font-semibold text-text-primary">
                {achievement.progress}
              </span>{" "}
              / {achievement.target} · +{achievement.points} pts
            </p>
          </>
        )}
      </div>
    </div>
  );
}