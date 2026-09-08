import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface PricingFeatureListProps {
  features: string[];
  className?: string;
  itemClassName?: string;
}

export function PricingFeatureList({
  features,
  className,
  itemClassName,
}: PricingFeatureListProps) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {features.map((feature) => (
        <li
          key={feature}
          className={cn("flex items-start gap-2 text-sm text-text-secondary", itemClassName)}
        >
          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}