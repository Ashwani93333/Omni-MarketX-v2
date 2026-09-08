"use client";

import { Activity as ActivityIcon, ArrowUpRight, Flame, LineChart, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { ActivityItem } from "@/components/activity/activity-item";
import { LiveMarketPulse, TrendingNowRail } from "@/components/layout/right-rail";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { activityService } from "@/services/domain.service";
import { marketService } from "@/services/market.service";
import type { ActivityPost } from "@/types";

const ACTIVITY_TABS = [
  { value: "All", label: "All" },
  { value: "Trades", label: "Trades" },
  { value: "Markets", label: "Markets" },
  { value: "Social", label: "Social" },
  { value: "Alerts", label: "Alerts" },
  { value: "Achievements", label: "Achievements" },
] as const;

const typeForTab: Record<string, ActivityPost["type"] | "all"> = {
  All: "all",
  Trades: "trade",
  Markets: "market",
  Social: "social",
  Alerts: "alert",
  Achievements: "achievement",
};

export default function ActivityPage() {
  const [tab, setTab] = useState("All");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["activity-feed"],
    queryFn: activityService.getActivityFeed,
  });

  const { data: trendingMarkets } = useQuery({
    queryKey: ["activity-trending"],
    queryFn: marketService.getTrendingMarkets,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const t = typeForTab[tab] ?? "all";
    if (t === "all") return data;
    return data.filter((p) => p.type === t);
  }, [data, tab]);

  const stats = useMemo(() => {
    const trades = (data ?? []).filter((p) => p.type === "trade").length;
    return {
      trades,
      markets: (data ?? []).filter((p) => p.type === "market").length,
      social: (data ?? []).filter((p) => p.type === "social").length,
      alerts: (data ?? []).filter((p) => p.type === "alert").length,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Feed"
        title="Activity"
        description="Real-time updates from across the community."
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Live Trades"
          value={stats.trades}
          icon={<Zap className="h-5 w-5" />}
          trend="up"
          hint="+12 today"
          accent="primary"
        />
        <StatCard
          label="Volume Moved"
          value="1.4M"
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend="up"
          hint="+8.2%"
          accent="success"
        />
        <StatCard
          label="Markets Moved"
          value={stats.markets}
          icon={<LineChart className="h-5 w-5" />}
          trend="neutral"
          hint="past 24h"
          accent="blue"
        />
        <StatCard
          label="Active Traders"
          value="2,847"
          icon={<Flame className="h-5 w-5" />}
          trend="up"
          hint="+221 online"
          accent="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ActivityIcon className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Trades, market movements and community milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="flex-wrap">
                {ACTIVITY_TABS.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {ACTIVITY_TABS.map((t) => (
                <TabsContent key={t.value} value={t.value}>
                  {isLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 rounded-[12px]" />
                      ))}
                    </div>
                  ) : isError ? (
                    <ErrorState onRetry={() => refetch()} />
                  ) : filtered.length === 0 ? (
                    <EmptyState
                      title="Nothing here yet"
                      description="There are no activity items in this category."
                    />
                  ) : (
                    <div className="space-y-1">
                      {filtered.map((post) => (
                        <ActivityItem key={post.id} post={post} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <LiveMarketPulse volatility={24} />
          <TrendingNowRail />
          {trendingMarkets && trendingMarkets.length > 0 ? (
            <a
              href="/trending"
              className="flex items-center justify-center gap-1.5 rounded-[16px] border border-border bg-surface py-3 text-sm font-semibold text-primary transition-colors hover:bg-background"
            >
              <Flame className="h-4 w-4" />
              See all trending markets
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
