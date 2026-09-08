"use client";

import { cn } from "@/lib/utils";

import { YEARLY_SAVINGS_PCT, type BillingCycle } from "@/constants/pricing";

interface PricingToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}

const options: { value: BillingCycle; label: string }[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

export function PricingToggle({
  cycle,
  onChange,
  className,
}: PricingToggleProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-9 items-center gap-1 rounded-[10px] bg-background p-1",
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={cycle === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "inline-flex h-full items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold text-text-secondary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            cycle === option.value &&
              "bg-surface text-text-primary shadow-[var(--shadow-sm)]",
            cycle !== option.value && "hover:text-text-primary"
          )}
        >
          {option.label}
          {option.value === "YEARLY" && (
            <span
              className={cn(
                "rounded-full px-1.5 py-px text-[10px] font-extrabold text-white",
                cycle === "YEARLY" ? "bg-primary" : "bg-gradient-brand"
              )}
            >
              SAVE {YEARLY_SAVINGS_PCT}%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}