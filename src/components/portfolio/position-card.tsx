import { MarketLink } from "@/components/market/market-link";
import { ProgressBar } from "@/components/ui/progress-bar";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Position } from "@/types";

export function PositionCard({ position }: { position: Position }) {
  const isYes = position.side === "YES";
  const profitPct = position.currentPrice - position.averagePrice;

  return (
    <MarketLink
      marketId={position.marketId}
      className="group flex flex-col gap-3 rounded-[16px] border border-border bg-surface p-5 transition-all hover:shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-bold",
            isYes ? "bg-success-light text-success" : "bg-danger-light text-danger"
          )}
        >
          {position.side}
        </span>
        <span
          className={cn(
            "number-tight text-sm font-bold",
            position.pnl >= 0 ? "text-success" : "text-danger"
          )}
        >
          {position.pnl >= 0 ? "+" : ""}
          {formatCurrency(position.pnl)}
        </span>
      </div>

      <p className="line-clamp-2 text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
        {position.marketTitle}
      </p>

      <div className="space-y-2 text-xs text-text-secondary">
        <div className="flex justify-between">
          <span>Shares</span>
          <strong className="number-tight text-text-primary">
            {position.shares.toLocaleString()}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Avg. Price</span>
          <strong className="number-tight text-text-primary">
            ${position.averagePrice.toFixed(3)}
          </strong>
        </div>
        <div className="flex justify-between">
          <span>Current</span>
          <strong className="number-tight text-text-primary">
            ${position.currentPrice.toFixed(3)}
          </strong>
        </div>
      </div>

      <ProgressBar
        value={position.currentPrice * 100}
        tone={isYes ? "success" : "primary"}
        className="mt-1"
        barClassName={cn(!isYes && "bg-danger")}
      />

      <p
        className={cn(
          "text-xs font-semibold",
          profitPct >= 0 ? "text-success" : "text-danger"
        )}
      >
        {profitPct >= 0 ? "▲" : "▼"} {Math.abs(profitPct * 100).toFixed(1)}% vs
        market
      </p>
    </MarketLink>
  );
}