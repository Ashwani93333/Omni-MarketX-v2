"use client";

import { PlanSelector } from "@/components/pricing/plan-selector";

interface OnboardingPlanStepProps {
  onComplete: () => void;
}

export function OnboardingPlanStep({ onComplete }: OnboardingPlanStepProps) {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Choose your plan
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
          Start exploring OmniMarketX today. Upgrade whenever you&rsquo;re
          ready.
        </p>
      </div>

      <div className="mt-6">
        <PlanSelector
          onPlanChosen={() => {
            onComplete();
          }}
        />
      </div>
    </div>
  );
}