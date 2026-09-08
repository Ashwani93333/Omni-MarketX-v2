"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { TrendingNowRail } from "@/components/layout/right-rail";
import { MarketCard } from "@/components/market/market-card";
import { MarketCardSkeletonGrid } from "@/components/market/market-card-skeleton";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { CATEGORY_CHIPS } from "@/constants";
import { marketService } from "@/services/market.service";
import { useAppStore } from "@/store/app-store";

export default function HomePage() {
  const tradingMode = useAppStore((s) => s.tradingMode);
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["markets", "home"],
    queryFn: () => marketService.getMarkets({ sort: "Volume" }),
  });

  const topMarkets = data?.slice(0, 9) ?? [];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="overflow-hidden rounded-[20px] border border-border bg-surface p-6 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {tradingMode === "DEMO"
              ? "Demo trading · Virtual funds"
              : "Live markets"}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-[42px]">
            The World&rsquo;s Leading
            <br />
            Social Prediction Market.&trade;
          </h1>
          <p className="mt-3 text-lg text-text-secondary">
            Trade on what you know. Compete. Discuss. Discover.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/markets"
              className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-[0.98]"
            >
              Start Trading
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/social"
              className="inline-flex h-11 items-center rounded-[10px] border border-border bg-surface px-5 text-sm font-semibold text-text-primary transition-colors hover:bg-background"
            >
              Join the community
            </Link>
          </div>
        </div>
      </section>

      {/* Category filters */}
      <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORY_CHIPS.map((cat) => (
          <Chip
            key={cat}
            active={cat === "All"}
            onClick={() => {
              router.push(cat === "All" ? "/markets" : `/markets?category=${encodeURIComponent(cat)}`);
            }}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              Top Markets
            </h2>
            <Link
              href="/markets"
              className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <MarketCardSkeletonGrid count={6} />
          ) : topMarkets.length === 0 ? (
            <EmptyState
              title="No markets found"
              description="Try another search or category."
              actionLabel="Clear Filters"
            />
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {topMarkets.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6 xl:pt-10">
          <TrendingNowRail />
        </aside>
      </div>
    </div>
  );
}