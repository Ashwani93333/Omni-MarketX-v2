"use client";

import { CheckCircle2, Circle, Sparkles } from "lucide-react";

import { ProgressBar } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";

import {
  computeMarketQuality,
  type CreateMarketDraft,
} from "./create-market.types";

export function MarketQualityScore({ draft }: { draft: CreateMarketDraft }) {
  const { score, label, tone, checks } = computeMarketQuality(draft);
  const passed = checks.filter((c) => c.done).length;

  return (
    <div className="rounded-[14px] border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
          <Sparkles className="h-4 w-4 text-primary" />
          Market Quality Score
        </h3>
        <span
          className={cn(
            "number-tight text-sm font-bold",
            tone === "success" && "text-success",
            tone === "orange" && "text-orange",
            tone === "danger" && "text-danger"
          )}
        >
          {score}
        </span>
      </div>
      <ProgressBar
        value={score}
        tone={tone === "danger" ? "orange" : tone}
        className="mt-3"
      />
      <p className="mt-2 text-xs font-semibold text-text-secondary">
        {label} — {passed}/{checks.length} checks passed
      </p>
      <ul className="mt-3 space-y-2">
        {checks.map((check) => (
          <li
            key={check.label}
            className="flex items-start gap-2 text-xs text-text-secondary"
          >
            {check.done ? (
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            ) : (
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" />
            )}
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}