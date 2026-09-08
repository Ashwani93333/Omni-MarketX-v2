"use client";

import { Crown } from "lucide-react";

import { PricingFeatureList } from "@/components/pricing/pricing-feature-list";
import { PricingSoonList } from "@/components/pricing/pricing-soon-list";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  getBillingDetails,
  pricingConfig,
  type BillingCycle,
} from "@/constants/pricing";

interface UpgradeConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cycle: BillingCycle;
  onConfirm: () => void;
}

export function UpgradeConfirmationModal({
  open,
  onOpenChange,
  cycle,
  onConfirm,
}: UpgradeConfirmationModalProps) {
  const details = getBillingDetails("PRO", cycle);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-h-[85vh] max-w-md overflow-y-auto">
        <ModalHeader>
          <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gradient-brand text-white shadow-md">
            <Crown className="h-5 w-5" />
          </span>
          <ModalTitle className="mt-2">Start OmniMarketX Pro?</ModalTitle>
          <ModalDescription>
            This is a demo subscription — it is not billed and can be changed
            anytime from your settings.
          </ModalDescription>
        </ModalHeader>

        <div className="mt-1 rounded-[14px] border border-border bg-background p-4">
          <div className="flex items-baseline gap-1">
            <span className="number-tight text-3xl font-extrabold text-text-primary">
              ${details.perMonth.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-text-secondary">/month</span>
          </div>
          {details.billingNote && cycle === "YEARLY" && (
            <p className="mt-1 text-xs text-text-secondary">{details.billingNote}</p>
          )}
          {pricingConfig.PRO.highlights && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {pricingConfig.PRO.highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center rounded-full bg-gradient-brand px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
              You&rsquo;ll get access to
            </p>
            <PricingFeatureList
              features={pricingConfig.PRO.features}
              itemClassName="text-text-primary"
            />
            {pricingConfig.PRO.soon && pricingConfig.PRO.soon.length > 0 && (
              <PricingSoonList features={pricingConfig.PRO.soon} />
            )}
          </div>
        </div>

        <ModalFooter className="mt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Go Back
          </Button>
          <Button
            className="bg-gradient-brand hover:bg-gradient-brand hover:opacity-95"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}