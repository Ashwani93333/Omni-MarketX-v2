"use client";

import { useQuery } from "@tanstack/react-query";
import { Gift, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

import { LeaderboardItem } from "@/components/leaderboard/leaderboard-item";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MOCK_CURRENT_USER } from "@/constants";
import { leaderboardService } from "@/services/domain.service";
import type { LeaderboardEntry, User } from "@/types";
import { useState } from "react";

const PERIOD_TABS = ["Daily", "Weekly", "Monthly", "All Time"] as const;
const FILTER_CHIPS = ["Highest ROI", "Highest Profit", "Most Trades", "Most Active"] as const;

export default function LeaderboardPage() {
  const [activePeriod, setActivePeriod] = useState<string>("All Time");
  const [activeFilter, setActiveFilter] = useState<string>("Highest ROI");
  const [showRewards, setShowRewards] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: leaderboardService.getLeaderboard,
  });

  const me: LeaderboardEntry = {
    id: "me",
    rank: 137,
    user: {
      id: MOCK_CURRENT_USER.id,
      username: MOCK_CURRENT_USER.username,
      displayName: MOCK_CURRENT_USER.displayName,
      initials: MOCK_CURRENT_USER.initials,
    } as User,
    roi: 42.7,
    profit: 884.12,
    trades: 96,
    change: 2,
  };

  const sorted = data?.slice().sort((a, b) => {
    switch (activeFilter) {
      case "Highest Profit":
        return b.profit - a.profit;
      case "Most Trades":
        return b.trades - a.trades;
      case "Highest ROI":
      default:
        return b.roi - a.roi;
    }
  });

  const rising = data?.slice().sort((a, b) => b.change - a.change).slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Compete"
          title="Leaderboard"
          description="Top traders by ROI this season. Climb the ranks."
        />

        <Tabs value={activePeriod} onValueChange={setActivePeriod}>
          <TabsList>
            {PERIOD_TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 pt-4">
            {FILTER_CHIPS.map((filter) => (
              <Chip
                key={filter}
                active={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </Chip>
            ))}
          </div>

          <TabsContent value={activePeriod} className="pt-4">
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border bg-gradient-to-r from-primary-light/40 to-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-4 w-4 text-orange" />
                  {activePeriod} Rankings
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                {isLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 rounded-[12px]" />
                    ))}
                  </div>
                ) : isError ? (
                  <ErrorState onRetry={() => refetch()} />
                ) : !sorted || sorted.length === 0 ? (
                  <EmptyState title="No rankings yet" description="Start trading to appear on the leaderboard." />
                ) : (
                  <>
                    <ol className="space-y-1">
                      {sorted.map((entry) => (
                        <li key={entry.id}>
                          <LeaderboardItem entry={entry} />
                        </li>
                      ))}
                    </ol>

                    <div className="mt-4 border-t border-border-light pt-4">
                      <LeaderboardItem entry={me} highlighted />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <aside className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <Gift className="h-4 w-4 text-primary" />
              Monthly Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-[12px] bg-background p-4 text-center">
              <p className="text-sm font-semibold text-text-primary">Compete for rewards</p>
              <p className="mt-1 text-xs text-text-secondary">
                Top traders earn recognition and exclusive rewards each month.
              </p>
              <Button
                size="sm"
                className="mt-3"
                onClick={() => setShowRewards((v) => !v)}
              >
                {showRewards ? "Hide Rewards" : "View Rewards"}
              </Button>
              {showRewards && (
                <ul className="mt-3 space-y-1.5 text-left">
                  {[
                    ["Rank #1", "$250 USDC"],
                    ["Rank #2", "$150 USDC"],
                    ["Rank #3", "$75 USDC"],
                    ["Top 10", "$20 USDC"],
                    ["Top 50", "Badge"],
                  ].map(([place, reward]) => (
                    <li
                      key={place}
                      className="flex items-center justify-between rounded-lg border border-border-light bg-surface px-3 py-1.5 text-xs"
                    >
                      <span className="font-semibold text-text-primary">{place}</span>
                      <span className="text-text-secondary">{reward}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[15px]">
              <TrendingUp className="h-4 w-4 text-success" />
              Fastest Rising
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {rising && rising.length > 0 ? (
              <ul className="space-y-2">
                {rising.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2.5 rounded-lg px-2 py-2">
                    <Link href={`/users/${entry.user.id}`} className="flex min-w-0 flex-1 items-center gap-2.5">
                      <Avatar size="sm" initials={entry.user.initials} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {entry.user.displayName}
                        </p>
                        <p className="text-xs text-text-muted">@{entry.user.username}</p>
                      </div>
                    </Link>
                    <span className="number-tight text-sm font-bold text-success">
                      +{entry.change}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 rounded-[10px]" />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
