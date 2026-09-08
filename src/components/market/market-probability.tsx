"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useWatchlistStore } from "@/store/watchlist-store";
import type { MarketCategory, MarketStatus } from "@/types";

export function MarketCategoryChip({ category }: { category: MarketCategory }) {
  return (
    <Badge variant="outline" className="text-[11px] font-semibold">
      {category}
    </Badge>
  );
}

export function MarketStatusBadge({ status }: { status: MarketStatus }) {
  const map: Record<
    MarketStatus,
    { label: string; variant: "success" | "default" | "blue" }
  > = {
    OPEN: { label: "Open", variant: "success" },
    CLOSED: { label: "Closed", variant: "blue" },
    RESOLVED: { label: "Resolved", variant: "default" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function ProbabilityBar({
  probability,
  showLabels = true,
  className,
}: {
  probability: number;
  showLabels?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {showLabels && (
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 font-bold text-success">
            YES <span className="number-tight">{probability}%</span>
          </span>
          <span className="flex items-center gap-1 font-bold text-text-secondary">
            <span className="number-tight">{100 - probability}%</span> NO
          </span>
        </div>
      )}
      <div className="relative flex h-2 w-full overflow-hidden rounded-full bg-success-light">
        <div
          className="h-full rounded-full bg-success"
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
}

export function FavoriteStar({
  marketId,
  size = "sm",
}: {
  marketId: string;
  size?: "sm" | "md";
}) {
  const ids = useWatchlistStore((s) => s.ids);
  const toggle = useWatchlistStore((s) => s.toggle);
  const isStarred = ids.includes(marketId);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(marketId);
      }}
      aria-label={isStarred ? "Remove from watchlist" : "Add to watchlist"}
      aria-pressed={isStarred}
      className={cn(
        "rounded-lg p-1 transition-colors hover:bg-background",
        isStarred ? "text-orange" : "text-text-muted hover:text-text-primary"
      )}
    >
      <Star
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        fill={isStarred ? "currentColor" : "none"}
      />
    </button>
  );
}

export function MarketTimeLeft({ closesAt }: { closesAt?: string }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!closesAt) return;
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, [closesAt]);

  if (!closesAt) return null;
  const days = Math.ceil(
    (new Date(closesAt).getTime() - now) / (1000 * 60 * 60 * 24)
  );
  return (
    <span className="text-xs text-text-muted">
      {days <= 0
        ? "Ended"
        : days === 1
          ? "1d left"
          : days < 7
            ? `${days}d left`
            : `${Math.floor(days / 7)}w left`}
    </span>
  );
}

export function MarketVolumeTraders({
  volume,
  traders,
}: {
  volume: number;
  traders: number;
}) {
  return (
    <div className="flex items-center gap-4 text-xs text-text-secondary">
      <span>
        Volume{" "}
        <strong className="number-tight text-text-primary">
          {formatCompactNumber(volume)}
        </strong>
      </span>
      <span className="flex items-center gap-1">
        <svg
          className="h-3.5 w-3.5 text-text-muted"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <strong className="number-tight text-text-primary">
          {new Intl.NumberFormat("en-US").format(traders)}
        </strong>
      </span>
    </div>
  );
}