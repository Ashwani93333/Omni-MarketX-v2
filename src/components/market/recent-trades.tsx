"use client";

import { useQuery } from "@tanstack/react-query";

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";

export function RecentTrades({
  marketId,
  lastPrice,
}: {
  marketId: string;
  lastPrice: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recent-trades", marketId, lastPrice],
    queryFn: () => marketService.getRecentTrades(marketId, lastPrice),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-7 w-7 rounded-full" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
        Recent trades unavailable right now.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {data.map((trade) => (
        <li key={trade.id} className="flex items-center gap-3 py-2">
          <Avatar size="xs" initials={trade.trader.initials} />
          <span className="hidden min-w-0 flex-1 truncate text-xs font-semibold text-text-secondary sm:block">
            @{trade.trader.username}
          </span>
          <span
            className={cn(
              "w-12 rounded-md px-1.5 py-0.5 text-center text-[11px] font-bold",
              trade.side === "YES"
                ? "bg-success-light text-success"
                : "bg-danger-light text-danger"
            )}
          >
            {trade.side}
          </span>
          <span className="number-tight w-12 text-right text-xs font-semibold text-text-primary">
            {trade.price.toFixed(3)}
          </span>
          <span className="number-tight w-14 text-right text-xs text-text-muted">
            {trade.shares}
          </span>
          <span className="w-16 text-right text-[11px] text-text-muted">
            {formatRelativeTime(trade.time)}
          </span>
        </li>
      ))}
    </ul>
  );
}