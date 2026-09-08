import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry } from "@/types";

const rankStyles: Record<number, { badge: string; medal: string }> = {
  1: {
    badge: "bg-orange-light text-orange",
    medal: "#ff6417",
  },
  2: {
    badge: "bg-blue/10 text-blue",
    medal: "#2563eb",
  },
  3: {
    badge: "bg-purple/10 text-purple",
    medal: "#8b5cf6",
  },
};

export function LeaderboardItem({
  entry,
  highlighted,
}: {
  entry: LeaderboardEntry;
  highlighted?: boolean;
}) {
  const { rank, user, roi, profit, trades, change } = entry;
  const styles = rankStyles[rank] ?? {
    badge: "bg-background text-text-secondary",
    medal: "var(--text-muted)",
  };

  const ChangeIcon = change === 0 ? Minus : change > 0 ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[12px] px-3 py-2.5 transition-colors",
        highlighted ? "bg-primary-light/60" : "hover:bg-background"
      )}
    >
      <span
        className={cn(
          "number-tight w-8 shrink-0 rounded-md py-1 text-center text-sm font-extrabold",
          styles.badge
        )}
        style={
          rank > 3 ? { color: styles.medal } : undefined
        }
      >
        {rank}
      </span>

      <Avatar
        size="sm"
        src={user.avatarUrl}
        initials={user.initials}
        alt={user.displayName}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          {user.displayName}
          {highlighted ? (
            <span className="ml-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
              You
            </span>
          ) : null}
        </p>
        <p className="number-tight text-xs text-text-muted">{trades} trades</p>
      </div>

      <span className="hidden sm:block">
        <ChangeIcon
          className={cn(
            "h-4 w-4",
            change === 0
              ? "text-text-muted"
              : change > 0
                ? "text-success"
                : "text-danger"
          )}
        />
      </span>

      <div className="w-16 shrink-0 text-right sm:w-24">
        <p className="number-tight text-sm font-bold text-text-primary">
          {formatCurrency(profit)}
        </p>
        <p className="number-tight text-xs text-text-muted sm:hidden">
          {profit >= 0 ? "+" : ""}
          {Math.abs(profit).toLocaleString()}
        </p>
        <p className="number-tight hidden text-xs text-text-muted sm:block">
          {Math.abs(profit).toLocaleString()} profit
        </p>
      </div>

      <div className="w-12 shrink-0 text-right sm:w-20">
        <p className="number-tight text-sm font-bold text-text-primary">
          {roi}%
        </p>
        <p
          className={cn(
            "number-tight text-xs",
            change === 0
              ? "text-text-muted"
              : change > 0
                ? "text-success"
                : "text-danger"
          )}
        >
          {change === 0 ? "—" : change > 0 ? `▲${change}` : `▼${Math.abs(change)}`}
        </p>
      </div>
    </div>
  );
}