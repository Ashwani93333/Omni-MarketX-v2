"use client";

import { Activity as ActivityIcon, Flame, TrendingUp, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { marketService } from "@/services/market.service";
import { cn } from "@/lib/utils";

export function TrendingNowRail() {
  const { data, isLoading } = useQuery({
    queryKey: ["trending-markets"],
    queryFn: marketService.getTrendingMarkets,
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Flame className="h-4 w-4 text-orange" />
          Trending Now
        </CardTitle>
        <TrendingUp className="h-4 w-4 text-text-muted" />
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-[10px]" />
            ))}
          </div>
        ) : (
          <ol className="space-y-2.5">
            {data?.slice(0, 5).map((m, i) => (
              <li key={m.id}>
                <a
                  href={`/markets/${m.id}`}
                  className="flex items-center justify-between gap-2 rounded-[10px] px-2 py-1.5 transition-colors hover:bg-background"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "number-tight w-5 shrink-0 text-sm font-extrabold",
                        i === 0
                          ? "text-orange"
                          : i === 1
                            ? "text-text-secondary"
                            : "text-text-muted"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="line-clamp-1 text-sm font-medium text-text-primary">
                      {m.title}
                    </span>
                  </span>
                  <span className="number-tight shrink-0 font-bold text-success">
                    {m.probability}%
                  </span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export function LiveMarketPulse({
  volatility = 24,
}: {
  volatility?: number;
}) {
  const label =
    volatility < 30
      ? "LOW VOLATILITY"
      : volatility < 60
        ? "MODERATE VOLATILITY"
        : "HIGH VOLATILITY";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <ActivityIcon className="h-4 w-4 text-blue" />
          Live Market Pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-[12px] bg-background p-4 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue">
            {label}
          </p>
          <p className="number-tight mt-2 text-3xl font-extrabold text-text-primary">
            {volatility}
            <span className="text-base font-semibold text-text-muted"> / 100</span>
          </p>
          <ProgressBar value={volatility} tone="blue" className="mt-3" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TopVolumeMovers() {
  const { data, isLoading } = useQuery({
    queryKey: ["top-volume-movers"],
    queryFn: marketService.getTopVolumeMovers,
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Zap className="h-4 w-4 text-orange" />
          Top Volume Movers
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-[10px]" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {data?.map((mover) => (
              <li key={mover.marketId}>
                <a
                  href={`/markets/${mover.marketId}`}
                  className="flex items-center justify-between rounded-[10px] px-2 py-2 transition-colors hover:bg-background"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-success" />
                    <span className="truncate text-sm font-medium text-text-primary">
                      {mover.title}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-3 text-xs">
                    <span className="font-bold text-success">
                      +{mover.change}%
                    </span>
                    <span className="number-tight font-semibold text-text-secondary">
                      {mover.probability}%
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}