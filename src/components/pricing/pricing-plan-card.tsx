"use client";

import { Check, Lock } from "lucide-react";

import { PlanBadge } from "@/components/pricing/plan-badge";
import { PricingCTA } from "@/components/pricing/pricing-cta";
import { PricingFeatureList } from "@/components/pricing/pricing-feature-list";
import { PricingSoonList } from "@/components/pricing/pricing-soon-list";
import {
  getBillingDetails,
  pricingConfig,
  type BillingCycle,
  type SubscriptionPlan,
} from "@/constants/pricing";
import { cn } from "@/lib/utils";

interface PricingPlanCardProps {
  plan: SubscriptionPlan;
  cycle: BillingCycle;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
  onPrimaryClick: () => void;
  className?: string;
}

export function PricingPlanCard({
  plan,
  cycle,
  selected,
  disabled,
  onSelect,
  onPrimaryClick,
  className,
}: PricingPlanCardProps) {
  const tier = pricingConfig[plan];
  const details = getBillingDetails(plan, cycle);
  const highlighted = tier.highlighted;

  const handleSelect = disabled ? undefined : onSelect;

  const inner = (
    <div
      className={cn(
        "flex h-full flex-col rounded-[18px] bg-surface p-5",
        !highlighted && "border border-border",
        highlighted && "rounded-[17px]",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-text-primary">{tier.name}</h3>
          <p className="mt-0.5 text-xs text-text-secondary">{tier.tagline}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {tier.badge && <PlanBadge className="hidden sm:inline-flex">{tier.badge}</PlanBadge>}
          {selected && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-baseline gap-1">
          <span className="number-tight text-4xl font-extrabold tracking-tight text-text-primary">
            ${details.perMonth > 0 ? details.perMonth.toFixed(2) : "0"}
          </span>
          <span className="text-sm font-medium text-text-secondary">/month</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {tier.monthly.note && details.period === "MONTHLY" && (
            <span className="text-xs text-text-secondary">{tier.monthly.note}</span>
          )}
          {details.billingNote && details.period === "YEARLY" && (
            <span className="text-xs text-text-secondary">{details.billingNote}</span>
          )}
          {details.savingsPct > 0 && (
            <span className="inline-flex items-center rounded-full bg-success-light px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-success">
              Save {details.savingsPct}%
            </span>
          )}
        </div>
        {tier.highlights && tier.highlights.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tier.highlights.map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center rounded-full bg-gradient-brand px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white"
              >
                {highlight}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex-1 border-t border-border-light pt-5">
        <PricingFeatureList features={tier.features} />
        {tier.soon && tier.soon.length > 0 && (
          <PricingSoonList features={tier.soon} className="mt-4" />
        )}
      </div>

      <div className="mt-5">
        <PricingCTA
          onClick={onPrimaryClick}
          variant={highlighted ? undefined : "secondary"}
          gradient={highlighted}
          disabled={disabled}
          aria-label={
            disabled
              ? `${tier.name} plan is unavailable (already on a paid plan)`
              : `${tier.name} plan: ${tier.cta}`
          }
        >
          {disabled && <Lock className="h-4 w-4" />}
          {tier.cta}
        </PricingCTA>
      </div>
    </div>
  );

  if (highlighted) {
    return (
      <div
        className={cn("relative h-full rounded-[20px] bg-gradient-brand p-px shadow-[var(--shadow-md)]", className)}
        onClick={handleSelect ? () => handleSelect(plan) : undefined}
      >
        {inner}
      </div>
    );
  }

  return (
    <div
      className={cn("relative h-full", className)}
      onClick={handleSelect ? () => handleSelect(plan) : undefined}
    >
      {inner}
    </div>
  );
}