"use client";

import {
  FavoriteStar,
  MarketCategoryChip,
  MarketStatusBadge,
  ProbabilityBar,
} from "@/components/market/market-probability";
import { MarketActionButtons } from "@/components/market/market-actions";
import { MarketLink } from "@/components/market/market-link";
import { formatCompactNumber } from "@/lib/format";
import type { Market } from "@/types";

export function MarketRow({ market }: { market: Market }) {
  return (
    <MarketLink
      marketId={market.id}
      className="group flex flex-col gap-4 rounded-[16px] border border-border bg-surface p-5 transition-all hover:shadow-[var(--shadow-md)] sm:flex-row sm:items-center"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <MarketCategoryChip category={market.category} />
          <MarketStatusBadge status={market.status} />
          <FavoriteStar marketId={market.id} size="sm" />
        </div>
        <p className="mt-2 text-[15px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
          {market.title}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-secondary">
          <span>
            Volume{" "}
            <strong className="number-tight text-text-primary">
              {formatCompactNumber(market.volume)}
            </strong>
          </span>
          <span>
            Traders{" "}
            <strong className="number-tight text-text-primary">
              {market.traderCount.toLocaleString()}
            </strong>
          </span>
          {market.priceChange24h !== undefined && (
            <span
              className={
                market.priceChange24h >= 0 ? "text-success" : "text-danger"
              }
            >
              {market.priceChange24h >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(market.priceChange24h)}%
            </span>
          )}
        </div>
      </div>

      <div className="shrink-0 sm:w-56">
        <ProbabilityBar probability={market.probability} />
      </div>

      <MarketActionButtons
        marketId={market.id}
        disabled={market.status !== "OPEN"}
        className="shrink-0 sm:w-40"
      />
    </MarketLink>
  );
}