"use client";

import { useQuery } from "@tanstack/react-query";
import { Medal, Sparkles } from "lucide-react";

import { AchievementCard } from "@/components/achievements/achievement-card";
import { PageHeader } from "@/components/layout/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { analyticsService } from "@/services/analytics.service";

export default function AchievementsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["achievements"],
    queryFn: analyticsService.getAchievements,
  });

  const unlocked = data?.filter((a) => a.unlocked) ?? [];
  const points = unlocked.reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Rewards"
        title="Achievements"
        description="Earn badges as you trade, win, and climb the community ranks."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-primary-light text-primary">
              <Medal className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-[15px]">Badges Earned</CardTitle>
              <CardDescription>Unlocked achievements</CardDescription>
            </div>
            <span className="number-tight ml-auto text-2xl font-extrabold text-text-primary">
              {isLoading ? "…" : `${unlocked.length}/${data?.length ?? 0}`}
            </span>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3 pb-0">
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-orange-light text-orange">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="text-[15px]">Total Points</CardTitle>
              <CardDescription>Earned across all badges</CardDescription>
            </div>
            <span className="number-tight ml-auto text-2xl font-extrabold text-text-primary">
              {isLoading ? "…" : points.toLocaleString()}
            </span>
          </CardHeader>
        </Card>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[16px]" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState
          title="Couldn't load achievements"
          onRetry={() => refetch()}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  );
}