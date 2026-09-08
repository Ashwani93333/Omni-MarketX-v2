"use client";

import { Bell, BellPlus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAlertsStore } from "@/store/alerts-store";
import type { AlertDirection } from "@/types";

export function MarketAlertsCard({
  marketId,
  marketTitle,
  probability,
}: {
  marketId: string;
  marketTitle: string;
  probability: number;
}) {
  const alerts = useAlertsStore((s) => s.alerts);
  const add = useAlertsStore((s) => s.add);
  const remove = useAlertsStore((s) => s.remove);

  const [direction, setDirection] = useState<AlertDirection>("ABOVE");
  const [threshold, setThreshold] = useState(String(probability));
  const [error, setError] = useState<string | null>(null);

  const marketAlerts = alerts.filter((a) => a.marketId === marketId);

  const handleAdd = () => {
    const value = Number(threshold);
    if (
      !threshold.trim() ||
      Number.isNaN(value) ||
      value < 0 ||
      value > 100
    ) {
      setError("Enter a valid percentage between 0 and 100.");
      return;
    }
    setError(null);
    add({ marketId, marketTitle, direction, threshold: value });
    toast.success(
      `Alert set: notify when price goes ${direction.toLowerCase()} ${value}%`
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          Price Alerts
        </CardTitle>
        <CardDescription>
          Get notified when YES crosses a price level.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          role="group"
          aria-label="Alert direction"
          className="grid grid-cols-2 gap-2"
        >
          <button
            onClick={() => setDirection("ABOVE")}
            aria-pressed={direction === "ABOVE"}
            className={cn(
              "rounded-[10px] border px-3 py-2 text-xs font-bold transition-colors",
              direction === "ABOVE"
                ? "border-primary bg-primary-light/60 text-primary"
                : "border-border bg-background text-text-secondary hover:bg-surface"
            )}
          >
            Above
          </button>
          <button
            onClick={() => setDirection("BELOW")}
            aria-pressed={direction === "BELOW"}
            className={cn(
              "rounded-[10px] border px-3 py-2 text-xs font-bold transition-colors",
              direction === "BELOW"
                ? "border-primary bg-primary-light/60 text-primary"
                : "border-border bg-background text-text-secondary hover:bg-surface"
            )}
          >
            Below
          </button>
        </div>

        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                min="1"
                max="100"
                inputMode="numeric"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="pr-8 font-bold"
                invalid={Boolean(error)}
                aria-label="Alert threshold percentage"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-text-muted">
                %
              </span>
            </div>
            <Button onClick={handleAdd} variant="success" className="h-9 px-3">
              <BellPlus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <FieldError>{error}</FieldError>
        </div>

        {marketAlerts.length > 0 ? (
          <ul className="space-y-2">
            {marketAlerts.map((alert) => (
              <li
                key={alert.id}
                className="flex items-center justify-between gap-2 rounded-[10px] border border-border bg-background px-3 py-2"
              >
                <span className="text-xs font-semibold text-text-primary">
                  {alert.direction === "ABOVE" ? "Above" : "Below"}{" "}
                  <span className="number-tight">{alert.threshold}%</span>
                </span>
                <button
                  onClick={() => remove(alert.id)}
                  aria-label="Remove alert"
                  className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
            No alerts set for this market yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}