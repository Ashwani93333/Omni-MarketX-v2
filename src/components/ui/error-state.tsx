"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this information.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-border bg-background/50 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-danger-light text-danger">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-2 text-base font-semibold text-text-primary">
        {title}
      </h3>
      <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}