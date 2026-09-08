"use client";

import { Button, type ButtonProps } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface PricingCTAProps extends ButtonProps {
  gradient?: boolean;
}

export function PricingCTA({
  gradient,
  className,
  variant,
  ...props
}: PricingCTAProps) {
  if (gradient) {
    return (
      <Button
        variant="primary"
        className={cn(
          "w-full border-0 bg-gradient-brand shadow-md hover:bg-gradient-brand hover:opacity-95",
          className
        )}
        {...props}
      />
    );
  }
  return <Button variant={variant} className={cn("w-full", className)} {...props} />;
}