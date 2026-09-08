"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, LineChart, Target, Trophy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FollowButton } from "@/components/social/follow-button";
import { CopyTraderButton } from "@/components/social/copy-trader-button";
import { ReputationCard } from "@/components/social/reputation-score";
import { Avatar } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { MOCK_CURRENT_USER } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { traderService } from "@/services/trader.service";
import { useFollowStore } from "@/store/follow-store";

export function TraderProfileClient({ userId }: { userId: string }) {
  const router = useRouter();
  const followedIds = useFollowStore((s) => s.followedIds);

  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ["trader", userId],
    queryFn: () => traderService.getTraderProfile(userId),
  });

  if (isLoading) {
    return <div className="skeleton h-96 rounded-[16px]" />;
  }

  if (isError || !profile) {
    return (
      <ErrorState
        title="Trader not found"
        description="We couldn't find this trader. It may have been removed."
        onRetry={() => {
          router.push("/leaderboard");
          refetch();
        }}
      />
    );
  }

  const isMe = profile.id === MOCK_CURRENT_USER.id;
  const followers =
    profile.stats.followers +
    (followedIds.includes(profile.id) && !isMe ? 1 : 0);

  const stats = [
    {
      label: "All-time ROI",
      value: `${profile.stats.roi.toFixed(1)}%`,
      icon: Trophy,
      tone: "text-orange",
    },
    {
      label: "Total Profit",
      value: formatCurrency(profile.stats.profit),
      icon: LineChart,
      tone:
        profile.stats.profit >= 0 ? "text-success" : "text-danger",
    },
    {
      label: "Win Rate",
      value: `${profile.stats.winRate}%`,
      icon: Target,
      tone: "text-primary",
    },
    {
      label: "Trades",
      value: profile.stats.trades.toLocaleString(),
      icon: LineChart,
      tone: "text-text-primary",
    },
  ] as const;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Avatar size="xl" initials={profile.user.initials} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-text-primary">
                  {profile.user.displayName}
                </h1>
                {isMe && (
                  <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    You
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-text-muted">
                @{profile.user.username} · Member since{" "}
                {formatDate(profile.memberSince)}
              </p>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-text-secondary">
                {profile.bio}
              </p>
            </div>
          </div>

          {!isMe && (
            <div className="flex shrink-0 items-center gap-2">
              <CopyTraderButton
                trader={{
                  userId: profile.id,
                  displayName: profile.user.displayName,
                  initials: profile.user.initials,
                }}
              />
              <FollowButton userId={profile.id} />
            </div>
          )}
        </CardContent>
      </Card>

      <ReputationCard profile={profile} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="space-y-1.5 p-5">
                <Icon className={cn("h-4 w-4", stat.tone)} />
                <p className="number-tight text-xl font-extrabold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-text-muted">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="number-tight text-2xl font-extrabold text-text-primary">
                {followers}
              </p>
              <p className="text-xs font-medium text-text-muted">Followers</p>
            </div>
            <div className="text-right">
              <p className="number-tight text-2xl font-extrabold text-text-primary">
                {profile.stats.following}
              </p>
              <p className="text-xs font-medium text-text-muted">Following</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <CalendarDays className="h-4 w-4 text-text-muted" />
            <CardTitle className="text-[15px]">Recent Positions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1.5">
              {profile.recentPositions.map((pos) => (
                <li key={pos.id}>
                  <Link
                    href={`/markets/${pos.marketId}`}
                    className="flex items-center gap-3 rounded-[10px] border border-border bg-background px-3 py-2 transition-colors hover:bg-surface"
                  >
                    <span
                      className={cn(
                        "w-10 shrink-0 rounded-md px-1.5 py-0.5 text-center text-[11px] font-bold",
                        pos.side === "YES"
                          ? "bg-success-light text-success"
                          : "bg-danger-light text-danger"
                      )}
                    >
                      {pos.side}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text-primary">
                      {pos.marketTitle}
                    </span>
                    <span className="shrink-0 text-[11px] text-text-muted">
                      {pos.shares.toLocaleString()} @ {pos.price.toFixed(3)}
                    </span>
                    <span
                      className={cn(
                        "number-tight w-20 shrink-0 text-right text-xs font-bold",
                        pos.pnl >= 0 ? "text-success" : "text-danger"
                      )}
                    >
                      {pos.pnl >= 0 ? "+" : ""}
                      {formatCurrency(pos.pnl)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}