"use client";

import { useRef, useState } from "react";

import { PricingPlanCard } from "@/components/pricing/pricing-plan-card";
import { PricingToggle } from "@/components/pricing/pricing-toggle";
import { UpgradeConfirmationModal } from "@/components/pricing/upgrade-confirmation-modal";
import type { SubscriptionPlan } from "@/constants/pricing";
import { useOnboardingStore } from "@/store/onboarding-store";

interface PlanSelectorProps {
  onPlanChosen: (plan: SubscriptionPlan) => void;
}

export function PlanSelector({ onPlanChosen }: PlanSelectorProps) {
  const plan = useOnboardingStore((state) => state.plan);
  const setPlan = useOnboardingStore((state) => state.setPlan);
  const billingCycle = useOnboardingStore((state) => state.billingCycle);
  const setBillingCycle = useOnboardingStore((state) => state.setBillingCycle);

  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [previousPlan, setPreviousPlan] = useState<SubscriptionPlan>("FREE");
  const confirmed = useRef(false);

  const chooseFree = () => {
    if (plan !== "FREE") return;
    onPlanChosen("FREE");
  };

  const choosePro = () => {
    setPreviousPlan(plan);
    confirmed.current = false;
    setPlan("PRO");
    setUpgradeOpen(true);
  };

  const confirmUpgrade = () => {
    confirmed.current = true;
    setUpgradeOpen(false);
    onPlanChosen("PRO");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !confirmed.current) setPlan(previousPlan);
    setUpgradeOpen(open);
  };

  const freeLocked = plan === "PRO";

  return (
    <div>
      <div className="flex justify-center">
        <PricingToggle cycle={billingCycle} onChange={setBillingCycle} />
      </div>

      <div className="mt-6 grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
        <PricingPlanCard
          plan="FREE"
          cycle={billingCycle}
          selected={plan === "FREE"}
          disabled={freeLocked}
          onSelect={freeLocked ? undefined : setPlan}
          onPrimaryClick={chooseFree}
        />
        <PricingPlanCard
          plan="PRO"
          cycle={billingCycle}
          selected={plan === "PRO"}
          onSelect={setPlan}
          onPrimaryClick={choosePro}
        />
      </div>

      <p className="mt-5 text-center text-xs text-text-muted">
        No payment required — a demo subscription you can change anytime from
        settings.
      </p>

      <UpgradeConfirmationModal
        open={upgradeOpen}
        onOpenChange={handleOpenChange}
        cycle={billingCycle}
        onConfirm={confirmUpgrade}
      />
    </div>
  );
}