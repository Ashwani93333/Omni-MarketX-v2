"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, Download, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletOverview } from "@/components/wallet/wallet-overview";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { walletService } from "@/services/wallet.service";
import { useAppStore } from "@/store/app-store";
import { useTradingStore } from "@/store/trading-store";
import type { Trade } from "@/types";

export default function WalletPage() {
  const router = useRouter();
  const tradingMode = useAppStore((s) => s.tradingMode);
  const storeTrades = useTradingStore((s) => s.trades);
  const storeBalance = useTradingStore((s) => s.balance);
  const resetDemo = useTradingStore((s) => s.resetDemo);
  const deposit = useTradingStore((s) => s.deposit);
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("100");
  const [depositing, setDepositing] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["wallet-trades"],
    queryFn: walletService.getTrades,
  });

  const isDemo = tradingMode === "DEMO";
  const trades = isDemo && storeTrades ? storeTrades : data;

  const handleExport = () => {
    const rows = (trades ?? []).map((t) => [
      t.market,
      t.side,
      t.amount,
      t.price,
      t.shares,
      t.status,
      t.date,
    ]);
    const header = ["Market", "Side", "Amount", "Price", "Shares", "Status", "Date"];
    const csv = [header, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "omnimarketx-trades.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Transaction history exported");
  };

  const confirmDeposit = () => {
    const amount = Number(depositAmount) || 0;
    if (amount <= 0) {
      toast.error("Enter a valid deposit amount");
      return;
    }
    setDepositing(true);
    setTimeout(() => {
      deposit(amount);
      setDepositing(false);
      setDepositOpen(false);
      toast.success(`${formatCurrency(amount)} deposited`);
    }, 600);
  };

  const columns: DataTableColumn<Trade>[] = [
    {
      key: "market",
      header: "Market",
      cell: (row) => (
        <a
          href={`/markets/${row.marketId}`}
          className="line-clamp-1 max-w-[320px] font-medium text-text-primary hover:text-primary"
        >
          {row.market}
        </a>
      ),
    },
    {
      key: "side",
      header: "Side",
      cell: (row) => (
        <span
          className={cn(
            "inline-flex rounded-md px-2 py-0.5 text-xs font-bold",
            row.side === "YES"
              ? "bg-success-light text-success"
              : "bg-danger-light text-danger"
          )}
        >
          {row.side}
        </span>
      ),
      align: "center",
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="number-tight font-semibold">
          {formatCurrency(row.amount)}
        </span>
      ),
      align: "right",
    },
    {
      key: "price",
      header: "Price",
      cell: (row) => (
        <span className="number-tight text-text-secondary">
          ${row.price.toFixed(3)}
        </span>
      ),
      align: "right",
    },
    {
      key: "shares",
      header: "Shares",
      cell: (row) => (
        <span className="number-tight">{row.shares.toLocaleString()}</span>
      ),
      align: "right",
    },
    {
      key: "date",
      header: "Date",
      cell: (row) => (
        <span className="whitespace-nowrap text-text-secondary">
          {formatDate(row.date)}
        </span>
      ),
      align: "right",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Wallet"
        description="Manage your funds, view transactions and trade history."
      >
        <div className="flex items-center gap-2">
          {isDemo ? (
            <Button variant="secondary" size="sm" onClick={() => setResetOpen(true)}>
              <CircleDollarSign className="h-4 w-4" />
              Reset Demo
            </Button>
          ) : null}
          {isDemo ? (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={(trades?.length ?? 0) === 0}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          )}
          <Button size="sm" onClick={() => setDepositOpen(true)}>
            <Plus className="h-4 w-4" />
            Deposit
          </Button>
        </div>
      </PageHeader>

      <WalletOverview />

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Transaction History</CardTitle>
            <CardDescription>
              {isDemo ? "Demo account · virtual funds" : "Real account · live funds"}
            </CardDescription>
          </div>
          <span className="rounded-lg bg-background px-2.5 py-1 text-xs font-semibold text-text-muted">
            Balance {formatCurrency(storeBalance)}
          </span>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : !trades || trades.length === 0 ? (
            <EmptyState
              title="No transactions yet"
              description="Your trades and activity will show up here."
              actionLabel="Explore Markets"
              onAction={() => router.push("/markets")}
            />
          ) : (
            <DataTable columns={columns} data={trades} rowKey={(r) => r.id} />
          )}
        </CardContent>
      </Card>

      <Modal open={resetOpen} onOpenChange={setResetOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Reset Demo Account</ModalTitle>
            <ModalDescription>
              This will restore your demo balance to $10,000 and clear all demo
              trade history and positions. This action cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setResetOpen(false)}
              disabled={resetting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              loading={resetting}
              onClick={() => {
                setResetting(true);
                setTimeout(() => {
                  resetDemo();
                  setResetting(false);
                  setResetOpen(false);
                }, 600);
              }}
            >
              Reset Account
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={depositOpen} onOpenChange={setDepositOpen}>
        <ModalContent>
          <div className="relative overflow-hidden rounded-[16px] bg-gradient-deposit px-5 py-6 text-white">
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                {isDemo ? "Demo wallet" : "Deposit funds"}
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-tight">
                {formatCurrency(storeBalance)}
              </p>
              <p className="mt-1 text-sm text-white/75">
                {isDemo
                  ? "Add virtual funds to your demo balance."
                  : "Funds are added instantly."}
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <FieldLabel htmlFor="deposit-amount">Amount</FieldLabel>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                $
              </span>
              <Input
                id="deposit-amount"
                type="number"
                min="1"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="pl-7 text-base font-bold"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {[100, 250, 500, 1000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setDepositAmount(String(amount))}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors",
                    Number(depositAmount) === amount
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border bg-background text-text-secondary hover:text-text-primary"
                  )}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <FieldError>
              {Number(depositAmount) > 0
                ? undefined
                : "Enter an amount greater than zero"}
            </FieldError>
          </div>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setDepositOpen(false)}
              disabled={depositing}
            >
              Cancel
            </Button>
            <Button onClick={confirmDeposit} loading={depositing}>
              <Plus className="h-4 w-4" />
              Deposit {Number(depositAmount) > 0 ? formatCurrency(Number(depositAmount)) : ""}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}