import { SearchX, Inbox } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  variant = "default",
  className,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: "default" | "search";
  className?: string;
}) {
  const Icon = variant === "search" ? SearchX : Inbox;
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-border bg-background/50 px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-surface text-text-muted">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-2 text-base font-semibold text-text-primary">
        {title}
      </h3>
      {description ? (
        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}