"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { CATEGORIES } from "@/constants";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import type { Market } from "@/types";

const COLOR_BY = ["Probability", "24h Change"] as const;
const SORTS = ["Volume", "Newest", "Probability"] as const;

function probabilityClasses(p: number): string {
  if (p >= 70) return "bg-success/90 text-white";
  if (p >= 55) return "bg-success/25 text-success";
  if (p >= 45) return "bg-primary-light/70 text-text-primary";
  if (p >= 30) return "bg-danger/25 text-danger";
  return "bg-danger/90 text-white";
}

function changeClasses(v: number): string {
  if (v >= 5) return "bg-success/90 text-white";
  if (v >= 1) return "bg-success/25 text-success";
  if (v > -1) return "bg-primary-light/70 text-text-primary";
  if (v > -5) return "bg-danger/25 text-danger";
  return "bg-danger/90 text-white";
}

function LegendSwatch({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted">
      <span className={cn("h-3 w-7 rounded-md", className)} />
      {label}
    </span>
  );
}

function HeatCell({ market }: { market: Market }) {
  return (
    <Link
      href={`/markets/${market.id}`}
      title={`${market.title} — ${market.probability}% YES`}
      className={cn(
        "flex min-h-20 flex-col justify-between gap-2 rounded-[12px] px-3 py-2.5 transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      )}
    >
      <span className="line-clamp-2 text-[11px] font-semibold leading-snug">
        {market.title}
      </span>
      <span className="flex items-end justify-between gap-2">
        <span className="number-tight text-lg font-extrabold leading-none">
          {market.probability}%
        </span>
        {market.priceChange24h !== undefined && (
          <span className="number-tight rounded-md bg-background/50 px-1 py-0.5 text-[10px] font-bold">
            {market.priceChange24h >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(market.priceChange24h)}%
          </span>
        )}
      </span>
    </Link>
  );
}

export function MarketHeatmap() {
  const [colorBy, setColorBy] =
    useState<(typeof COLOR_BY)[number]>("Probability");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Volume");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["markets", "heatmap", sort],
    queryFn: () => marketService.getMarkets({ sort }),
  });

  const open = data?.filter((m) => m.status === "OPEN") ?? [];
  const groups = CATEGORIES.map((category) => ({
    category,
    items: open.filter((m) => m.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">
            Color by
          </span>
          <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5">
            {COLOR_BY.map((c) => (
              <button
                key={c}
                onClick={() => setColorBy(c)}
                aria-pressed={colorBy === c}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                  colorBy === c
                    ? "bg-surface text-text-primary shadow-[var(--shadow-sm)]"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5">
            {SORTS.map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                aria-pressed={sort === s}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                  sort === s
                    ? "bg-surface text-text-primary shadow-[var(--shadow-sm)]"
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {colorBy === "Probability" ? (
            <>
              <LegendSwatch className="bg-danger/90" label="0–30%" />
              <LegendSwatch className="bg-danger/25" label="30–45%" />
              <LegendSwatch className="bg-primary-light/70" label="45–55%" />
              <LegendSwatch className="bg-success/25" label="55–70%" />
              <LegendSwatch className="bg-success/90" label="70%+" />
            </>
          ) : (
            <>
              <LegendSwatch className="bg-danger/90" label="-5% or lower" />
              <LegendSwatch className="bg-danger/25" label="-1 to -5%" />
              <LegendSwatch className="bg-primary-light/70" label="Flat" />
              <LegendSwatch className="bg-success/25" label="+1 to +5%" />
              <LegendSwatch className="bg-success/90" label="+5% or higher" />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-[12px]" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[16px] border border-border bg-surface p-8 text-center">
          <p className="text-sm text-text-secondary">
            Heatmap unavailable right now.{" "}
            <button
              onClick={() => refetch()}
              className="font-semibold text-primary hover:underline"
            >
              Retry
            </button>
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <section key={group.category} className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
                {group.category}
              </h2>
              <span className="text-xs text-text-muted">
                {group.items.length}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.items.map((market) => (
                <div
                  key={market.id}
                  className={
                    colorBy === "Probability"
                      ? probabilityClasses(market.probability)
                      : changeClasses(market.priceChange24h ?? 0)
                  }
                >
                  <HeatCell market={market} />
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}