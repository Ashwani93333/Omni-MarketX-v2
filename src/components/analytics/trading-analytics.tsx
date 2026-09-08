"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { analyticsService } from "@/services/analytics.service";

const RANGES = [
  { label: "7D", points: 7 },
  { label: "30D", points: 30 },
] as const;

export function TradingAnalytics({ userId }: { userId: string }) {
  const [range, setRange] = useState<(typeof RANGES)[number]["label"]>("30D");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["analytics", userId],
    queryFn: () => analyticsService.getTradingAnalytics(userId),
  });

  const active = RANGES.find((r) => r.label === range);

  const kpis = data?.kpis;
  const series = data?.series.slice(-(active?.points ?? 30));

  const positive = (kpis?.netPnl ?? 0) >= 0;
  const accent = positive ? "#16a34a" : "#dc2626";

  if (isLoading) {
    return (
      <Card>
        <CardContent className="space-y-4 p-5">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-56 w-full" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-[12px]" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !data || !kpis || !series) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-text-secondary">
          Analytics unavailable right now.
        </CardContent>
      </Card>
    );
  }

  const kpiTiles = [
    { label: "Win Rate", value: `${kpis.winRate}%`, tone: "text-text-primary" },
    { label: "Profit Factor", value: kpis.profitFactor.toFixed(2), tone: "text-text-primary" },
    { label: "Avg Win", value: `+${formatCurrency(kpis.avgWin)}`, tone: "text-success" },
    { label: "Avg Loss", value: `-${formatCurrency(kpis.avgLoss)}`, tone: "text-danger" },
    { label: "Best Day", value: `+${formatCurrency(kpis.bestDay)}`, tone: "text-success" },
    { label: "Worst Day", value: `-${formatCurrency(kpis.worstDay)}`, tone: "text-danger" },
    { label: "Trades", value: kpis.trades.toLocaleString(), tone: "text-text-primary" },
    { label: "Net P&L", value: formatCurrency(kpis.netPnl), tone: positive ? "text-success" : "text-danger" },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 flex-wrap">
        <CardTitle className="text-lg">Trading Analytics</CardTitle>
        <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.label)}
              aria-pressed={range === r.label}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                range === r.label
                  ? "bg-surface text-text-primary shadow-[var(--shadow-sm)]"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accent} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(t) =>
                  new Date(t).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                minTickGap={40}
              />
              <YAxis
                tickFormatter={(v) => `$${Number(v).toLocaleString()}`}
                tick={{ fontSize: 11, fill: "var(--text-muted)" }}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  boxShadow: "var(--shadow-md)",
                  fontSize: 12,
                }}
                labelStyle={{ color: "var(--text-muted)", fontWeight: 600 }}
                itemStyle={{ color: "var(--text-primary)", fontWeight: 700 }}
                labelFormatter={(t) =>
                  new Date(Number(t)).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                formatter={(value) => [
                  `${Number(value) >= 0 ? "+" : ""}${formatCurrency(Number(value))}`,
                  "Net P&L",
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={accent}
                strokeWidth={2}
                fill="url(#pnlGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {kpiTiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-[12px] border border-border bg-background px-3.5 py-3"
            >
              <p className="text-xs font-medium text-text-muted">{tile.label}</p>
              <p
                className={cn(
                  "number-tight mt-0.5 text-base font-extrabold text-text-primary",
                  tile.tone
                )}
              >
                {tile.value}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}