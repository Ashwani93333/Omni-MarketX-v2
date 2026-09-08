"use client";

import { useQuery } from "@tanstack/react-query";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

import { TradingAnalytics } from "@/components/analytics/trading-analytics";
import { PageHeader } from "@/components/layout/page-header";
import { PositionCard } from "@/components/portfolio/position-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_CURRENT_USER } from "@/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { portfolioService } from "@/services/wallet.service";
import { useTradingStore } from "@/store/trading-store";

export default function PortfolioPage() {
  const router = useRouter();
  const positions = useTradingStore((s) => s.positions);
  const trades = useTradingStore((s) => s.trades);
  const balance = useTradingStore((s) => s.balance);

  const { isLoading, isError, refetch } = useQuery({
    queryKey: ["portfolio-positions"],
    queryFn: portfolioService.getPositions,
  });

  const positionsValue = positions.reduce(
    (sum, p) => sum + p.shares * p.currentPrice,
    0
  );
  const totalValue = positionsValue + balance;
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <PageHeader
          eyebrow="Overview"
          title="Portfolio"
          description="Track your positions and overall performance."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Total Value"
            value={formatCurrency(totalValue)}
            accent="primary"
          />
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Total P&L"
            value={formatCurrency(totalPnl)}
            trend={totalPnl >= 0 ? "up" : "down"}
            valueClassName={totalPnl >= 0 ? "text-success" : "text-danger"}
          />
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Open Positions"
            value={positions.length}
            accent="orange"
          />
          <StatCard
            icon={<Briefcase className="h-5 w-5" />}
            label="Cash Balance"
            value={formatCurrency(balance)}
            accent="blue"
          />
        </div>

        <TradingAnalytics userId={MOCK_CURRENT_USER.id} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 rounded-[16px]" />
                ))}
              </div>
            ) : isError ? (
              <ErrorState onRetry={() => refetch()} />
            ) : positions.length === 0 ? (
              <EmptyState
                title="No open positions"
                description="When you place a trade, your position will appear here."
                actionLabel="Explore Markets"
                onAction={() => router.push("/markets")}
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {positions.map((position) => (
                  <PositionCard
                    key={`${position.marketId}-${position.side}`}
                    position={position}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[15px]">Recent Demo Trades</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {trades && trades.length > 0 ? (
              <ul className="space-y-2">
                {trades.slice(0, 6).map((trade) => (
                  <li
                    key={trade.id}
                    className="rounded-[10px] px-2 py-2 transition-colors hover:bg-background"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                          trade.side === "YES"
                            ? "bg-success-light text-success"
                            : "bg-danger-light text-danger"
                        )}
                      >
                        {trade.side}
                      </span>
                      <span className="number-tight text-xs font-semibold text-text-primary">
                        {formatCurrency(trade.amount)}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-xs text-text-secondary">{trade.market}</p>
                    <p className="mt-0.5 text-[11px] text-text-muted">{formatDate(trade.date)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted">No trades yet.</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
