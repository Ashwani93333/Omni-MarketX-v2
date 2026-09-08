"use client";

import { Check } from "lucide-react";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  steps: string[];
  current: number;
}

export function OnboardingProgress({
  steps,
  current,
}: OnboardingProgressProps) {
  return (
    <div className="mb-10 w-full" role="navigation" aria-label="Progress">
      <div className="flex items-center">
        {steps.map((label, index) => (
          <Fragment key={label}>
            {index > 0 && (
              <div
                className={cn(
                  "h-[2px] flex-1 rounded-full transition-colors",
                  index <= current ? "bg-primary" : "bg-border"
                )}
              />
            )}
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border transition-all",
                  index < current &&
                    "border-primary bg-primary text-white",
                  index === current &&
                    "border-primary bg-primary-light text-primary",
                  index > current &&
                    "border-border bg-surface text-text-muted"
                )}
              >
                {index < current ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                ) : (
                  <span className="number-tight text-[11px] font-bold">
                    {index + 1}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "absolute left-1/2 top-full mt-1.5 hidden -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold sm:block",
                  index === current ? "text-primary" : "text-text-muted",
                  index < current && "text-text-secondary"
                )}
              >
                {label}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
      <p className="mt-8 text-center text-xs font-semibold uppercase tracking-widest text-primary sm:hidden">
        Step {current + 1} of {steps.length} — {steps[current]}
      </p>
    </div>
  );
}