"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import type { OrderBookLevel } from "@/types";

export function OrderBook({
  marketId,
  lastPrice,
}: {
  marketId: string;
  lastPrice: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-book", marketId, lastPrice],
    queryFn: () => marketService.getOrderBook(marketId, lastPrice),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
        Order book unavailable right now.
      </p>
    );
  }

  const asks = data.filter((l) => l.side === "SELL");
  const bids = data.filter((l) => l.side === "BUY");
  const maxTotal = Math.max(
    asks[asks.length - 1]?.total ?? 0,
    bids[bids.length - 1]?.total ?? 0,
    1
  );
  const spread =
    (asks[0]?.price ?? lastPrice) - (bids[0]?.price ?? lastPrice);

  const renderLevel = (level: OrderBookLevel) => (
    <div
      key={level.id}
      className="relative flex items-center justify-between rounded-lg px-2 py-[3px] text-xs"
    >
      <span
        className={cn(
          "absolute inset-y-0 right-0 rounded-md",
          level.side === "BUY" ? "bg-success/15" : "bg-danger/15"
        )}
        style={{ width: `${(level.total / maxTotal) * 100}%` }}
        aria-hidden="true"
      />
      <span className="number-tight relative font-semibold text-text-secondary">
        {level.price.toFixed(3)}
      </span>
      <span className="number-tight relative text-text-secondary">
        {level.shares.toLocaleString()}
      </span>
      <span className="number-tight relative text-text-muted">
        {level.total.toLocaleString()}
      </span>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between px-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-text-muted">
        <span>Price</span>
        <span>Size</span>
        <span>Total</span>
      </div>

      <div className="space-y-px">
        {asks.map(renderLevel)}
        <div className="my-1 flex items-center justify-between rounded-lg border-y border-border bg-background px-2 py-1.5">
          <span className="text-xs font-bold text-text-primary">
            Last{" "}
            <span className="number-tight">{lastPrice.toFixed(3)}</span>
          </span>
          <span className="number-tight text-[10px] text-text-muted">
            Spread {Math.max(0, spread).toFixed(3)}
          </span>
        </div>
        {bids.map(renderLevel)}
      </div>
    </div>
  );
}