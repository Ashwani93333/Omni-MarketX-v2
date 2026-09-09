"use client";

import { Flame } from "lucide-react";

import {
  FavoriteStar,
  MarketCategoryChip,
  MarketTimeLeft,
  MarketVolumeTraders,
  ProbabilityBar,
} from "@/components/market/market-probability";
import { MarketActionButtons } from "@/components/market/market-actions";
import { MarketLink } from "@/components/market/market-link";
import type { Market } from "@/types";

export function MarketCard({ market }: { market: Market }) {
  return (
    <MarketLink
      marketId={market.id}
      className="group flex h-full flex-col rounded-[16px] border border-border bg-surface p-5 shadow-[var(--shadow-sm)] transition-all duration-150 hover:-translate-y-0.5 hover:border-border hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-center justify-between gap-2">
        <MarketCategoryChip category={market.category} />
        <div className="flex items-center gap-1">
          {market.featured && (
            <span
              className="flex items-center gap-0.5 rounded-full bg-orange-light px-1.5 py-0.5 text-[10px] font-bold uppercase text-orange"
              title="Featured"
            >
              <Flame className="h-3 w-3" />
            </span>
          )}
          {market.source === "community" && (
            <span
              className="rounded-full bg-primary-light px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary"
              title="Community market"
            >
              Community
            </span>
          )}
          <FavoriteStar marketId={market.id} />
        </div>
      </div>

      <h3 className="mt-3 line-clamp-2 text-[15px] font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
        {market.title}
      </h3>

      <div className="mt-4">
        <ProbabilityBar probability={market.probability} />
      </div>

      <div className="mt-4 flex flex-1 items-end justify-between gap-2">
        <MarketVolumeTraders volume={market.volume} traders={market.traderCount} />
        {market.closesAt ? <MarketTimeLeft closesAt={market.closesAt} /> : null}
      </div>

      <div className="mt-4 border-t border-border-light pt-4">
        <MarketActionButtons
            marketId={market.id}
            disabled={market.status !== "OPEN"}
          />
      </div>
    </MarketLink>
  );
}