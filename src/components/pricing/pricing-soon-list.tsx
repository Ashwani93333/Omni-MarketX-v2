import { Lock } from "lucide-react";

import { cn } from "@/lib/utils";

interface PricingSoonListProps {
  features: string[];
  className?: string;
}

export function PricingSoonList({
  features,
  className,
}: PricingSoonListProps) {
  return (
    <div className={cn("mt-4 border-t border-border-light pt-4", className)}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
        Coming soon
      </p>
      <ul className="mt-2 space-y-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center justify-between gap-3 text-sm text-text-muted"
          >
            <span className="flex min-w-0 items-center gap-2">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{feature}</span>
            </span>
            <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-muted">
              Soon
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}