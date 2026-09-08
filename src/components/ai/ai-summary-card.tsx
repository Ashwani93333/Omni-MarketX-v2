"use client";

import { RefreshCw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { aiService } from "@/services/ai.service";
import type { Market, MarketAiSummary } from "@/types";

const TONE_STYLES: Record<
  MarketAiSummary["tone"],
  { chip: string; dot: string }
> = {
  bullish: { chip: "bg-success-light text-success", dot: "bg-success" },
  bearish: { chip: "bg-danger-light text-danger", dot: "bg-danger" },
  neutral: { chip: "bg-primary-light text-primary", dot: "bg-primary" },
};

export function AiSummaryCard({ market }: { market: Market }) {
  const [seed, setSeed] = useState(0);
  const summary = useMemo(
    () => aiService.getAiSummary(market, String(seed)),
    [market, seed]
  );
  const tone = TONE_STYLES[summary.tone];

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-surface via-surface to-primary-light/30">
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Market Summary
        </CardTitle>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold",
              tone.chip
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {summary.tone}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Regenerate summary"
            className="h-7 w-7 text-text-muted"
            onClick={() => setSeed((s) => s + 1)}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-semibold leading-snug text-text-primary">
          {summary.headline}
        </p>
        <ul className="space-y-1.5">
          {summary.points.map((point, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13px] leading-relaxed text-text-secondary"
            >
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", tone.dot)} />
              {point}
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-text-muted">
          AI-generated · model confidence{" "}
          <span className="number-tight font-bold">{summary.confidence}%</span>
        </p>
      </CardContent>
    </Card>
  );
}