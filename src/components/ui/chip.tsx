import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex h-8 select-none items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-medium text-text-secondary transition-colors",
  {
    variants: {
      active: {
        true: "border-primary bg-primary-light text-primary",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        chipVariants({ active }),
        "hover:bg-background hover:text-text-primary",
        active && "hover:bg-primary-light hover:text-primary",
        className
      )}
      {...props}
    />
  )
);
Chip.displayName = "Chip";

export { Chip, chipVariants };