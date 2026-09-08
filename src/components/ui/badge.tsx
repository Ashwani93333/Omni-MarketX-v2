import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-background text-text-secondary border border-border",
        primary: "bg-primary-light text-primary",
        success: "bg-success-light text-success",
        danger: "bg-danger-light text-danger",
        orange: "bg-orange-light text-orange",
        purple: "bg-purple/10 text-purple",
        blue: "bg-blue/10 text-blue",
        outline: "border border-border text-text-primary bg-surface",
      },
      size: {
        default: "text-xs",
        sm: "px-2 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };