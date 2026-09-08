"use client";

import { BadgeCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TraderProfile } from "@/types";

const TIERS = [
  { min: 900, label: "Elite", className: "text-purple bg-purple/10" },
  { min: 800, label: "Trusted", className: "text-orange bg-orange/10" },
  { min: 700, label: "Established", className: "text-blue bg-blue/10" },
  { min: 0, label: "Rookie", className: "text-text-secondary bg-background" },
] as const;

export function ReputationCard({ profile }: { profile: TraderProfile }) {
  const { score, streak, weeksProfitable } = profile.reputation;
  const tier = TIERS.find((t) => score >= t.min) ?? TIERS[TIERS.length - 1];

  const bars = [
    {
      label: "Trade Success",
      value: Math.round(Math.min(100, profile.stats.winRate)),
      className: "bg-success",
    },
    {
      label: "Consistency",
      value: weeksProfitable,
      className: "bg-primary",
    },
    {
      label: "Streak",
      value: streak,
      className: "bg-orange",
    },
    {
      label: "Influence",
      value: Math.round(
        Math.min(100, (profile.stats.followers / 500) * 100)
      ),
      className: "bg-purple",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <BadgeCheck className="h-4 w-4 text-primary" />
          Reputation Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between rounded-[12px] bg-background px-4 py-3">
          <div>
            <p className="number-tight text-3xl font-extrabold text-text-primary">
              {score}
            </p>
            <p className="text-[11px] text-text-muted">out of 1000</p>
          </div>
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-bold",
              tier.className
            )}
          >
            {tier.label}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {bars.map((bar) => (
            <div key={bar.label} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  {bar.label}
                </span>
                <span className="number-tight text-text-muted">
                  {bar.value}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={cn("h-full rounded-full", bar.className)}
                  style={{ width: `${Math.min(100, bar.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}