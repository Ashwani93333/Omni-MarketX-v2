"use client";

import { useQuery } from "@tanstack/react-query";

import { PageHeader } from "@/components/layout/page-header";
import { LiveMarketPulse, TopVolumeMovers } from "@/components/layout/right-rail";
import { MarketCard } from "@/components/market/market-card";
import { MarketCardSkeletonGrid } from "@/components/market/market-card-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { marketService } from "@/services/market.service";

export default function TrendingPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["trending-markets"],
    queryFn: marketService.getTrendingMarkets,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Discover"
        title="Trending"
        description="What the community is trading right now."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {isLoading ? (
            <MarketCardSkeletonGrid count={6} />
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
              {data?.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <LiveMarketPulse />
          <TopVolumeMovers />
        </aside>
      </div>
    </div>
  );
}