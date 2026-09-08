"use client";

import { Gauge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { aiService } from "@/services/ai.service";
import type { Market } from "@/types";

const DIRECTION_LABEL: Record<string, string> = {
  bullish: "Bullish",
  bearish: "Bearish",
  balanced: "Balanced",
};

export function MarketSentimentCard({ market }: { market: Market }) {
  const sentiment = aiService.getMarketSentiment(market);
  const directionColor =
    sentiment.direction === "bullish"
      ? "text-success"
      : sentiment.direction === "bearish"
        ? "text-danger"
        : "text-text-secondary";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-[15px]">
          <Gauge className="h-4 w-4 text-primary" />
          Market Sentiment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-success">YES {sentiment.bullishPct}%</span>
            <span className={cn("text-sm font-extrabold", directionColor)}>
              {DIRECTION_LABEL[sentiment.direction]}
            </span>
            <span className="text-danger">NO {sentiment.bearishPct}%</span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-success"
              style={{ width: `${sentiment.bullishPct}%` }}
            />
            <div
              className="h-full bg-danger"
              style={{ width: `${sentiment.bearishPct}%` }}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Top drivers
          </p>
          {sentiment.drivers.map((driver, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold capitalize text-text-primary">
                  {driver.label}
                </span>
                <span className="number-tight text-text-muted">
                  {driver.weight}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                <div
                  className={cn(
                    "h-full rounded-full",
                    sentiment.direction === "bullish"
                      ? "bg-success"
                      : sentiment.direction === "bearish"
                        ? "bg-danger"
                        : "bg-primary"
                  )}
                  style={{ width: `${driver.weight}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}