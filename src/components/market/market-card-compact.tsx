"use client";

import {
  FavoriteStar,
  MarketCategoryChip,
  MarketStatusBadge,
  ProbabilityBar,
} from "@/components/market/market-probability";
import { MarketLink } from "@/components/market/market-link";
import { formatCompactNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Market } from "@/types";

export function MarketCardCompact({
  market,
  rank,
}: {
  market: Market;
  rank?: number;
}) {
  return (
    <MarketLink
      marketId={market.id}
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 transition-all hover:border-border hover:shadow-[var(--shadow-sm)]",
        rank !== undefined && "border-l-2",
        rank === 1 && "border-l-orange",
        rank === 2 && "border-l-text-secondary",
        rank === 3 && "border-l-[#cd7f32]"
      )}
    >
      {rank !== undefined && (
        <span
          className={cn(
            "number-tight w-6 shrink-0 text-center text-lg font-extrabold",
            rank === 1
              ? "text-orange"
              : rank === 2
                ? "text-text-secondary"
                : rank === 3
                  ? "text-[#cd7f32]"
                  : "text-text-muted"
          )}
        >
          {rank}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <MarketCategoryChip category={market.category} />
          <MarketStatusBadge status={market.status} />
          <FavoriteStar marketId={market.id} size="sm" />
        </div>
        <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-text-primary">
          {market.title}
        </p>
        <div className="mt-2">
          <ProbabilityBar probability={market.probability} showLabels={false} />
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        <span className="number-tight text-sm font-bold text-text-primary">
          {market.probability}%
        </span>
        <span className="text-xs text-text-muted">
          {formatCompactNumber(market.volume)}
        </span>
      </div>
    </MarketLink>
  );
}