import { ArrowDownRight, ArrowUpRight, TrendingUp, Wallet } from "lucide-react";

import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/format";
import { useTradingStore } from "@/store/trading-store";

export function WalletOverview() {
  const balance = useTradingStore((s) => s.balance);
  const totalIn = useTradingStore((s) => s.totalIn);

  const withdrawn = Math.max(0, totalIn - balance);
  const netProfit = balance - totalIn;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<Wallet className="h-5 w-5" />}
        label="Available Balance"
        value={formatCurrency(balance)}
        accent="success"
      />
      <StatCard
        icon={<ArrowUpRight className="h-5 w-5" />}
        label="Total Deposits"
        value={formatCurrency(totalIn)}
        accent="orange"
      />
      <StatCard
        icon={<ArrowDownRight className="h-5 w-5" />}
        label="Total Withdrawn"
        value={formatCurrency(withdrawn)}
        accent="primary"
      />
      <StatCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Net Profit"
        value={formatCurrency(netProfit)}
        trend={netProfit >= 0 ? "up" : "down"}
        valueClassName={netProfit >= 0 ? "text-success" : "text-danger"}
        accent="blue"
      />
    </div>
  );
}