import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: "primary" | "success" | "orange" | "blue" | "danger";
  valueClassName?: string;
}

const accentStyles: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary-light text-primary",
  success: "bg-success-light text-success",
  orange: "bg-orange-light text-orange",
  blue: "bg-blue/10 text-blue",
  danger: "bg-danger-light text-danger",
};

const trendStyles: Record<NonNullable<StatCardProps["trend"]>, string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-text-secondary",
};

export function StatCard({
  label,
  value,
  icon,
  hint,
  trend = "neutral",
  accent = "primary",
  className,
  valueClassName,
  ...props
}: StatCardProps) {
  return (
    <Card className={cn("transition-shadow hover:shadow-[var(--shadow-md)]", className)} {...props}>
      <CardContent className="flex items-start gap-4 p-5">
        {icon ? (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-[12px]",
              accentStyles[accent]
            )}
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p
            className={cn(
              "number-tight mt-1 text-2xl font-bold tracking-tight text-text-primary",
              valueClassName
            )}
          >
            {value}
          </p>
          {hint ? (
            <p className={cn("mt-1 text-xs font-semibold", trendStyles[trend])}>
              {hint}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}