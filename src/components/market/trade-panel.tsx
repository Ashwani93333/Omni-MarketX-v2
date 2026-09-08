"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { useAppStore } from "@/store/app-store";
import { useTradingStore } from "@/store/trading-store";
import type { MarketStatus } from "@/types";

const FEE_RATE = 0.002;
const MIN_TRADE = 10;
const MAX_TRADE = 5000;
const QUICK_AMOUNTS = [5, 10, 20, 40];

const tradeSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
});

type TradeForm = z.infer<typeof tradeSchema>;

type TradeResult = "success" | "failure" | null;

type TradeAction = "BUY" | "SELL";

const round2 = (n: number) => Math.round(n * 100) / 100;

const fmtUsdc = (n: number) =>
  `${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USDC`;

const fmtShares = (n: number) =>
  `${n.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

const toCents = (p: number) => {
  const v = Math.round(p * 10) / 10;
  return `${v % 1 === 0 ? v : v.toFixed(1)}¢`;
};

export function TradePanel({
  marketId,
  marketTitle,
  probability,
  status = "OPEN",
  onSuccess,
}: {
  marketId: string;
  marketTitle: string;
  probability: number;
  status?: MarketStatus;
  onSuccess?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [side, setSide] = useState<"YES" | "NO" | null>(() => {
    const t = searchParams.get("trade");
    return t === "YES" || t === "NO" ? t : null;
  });
  const [action, setAction] = useState<TradeAction>("BUY");
  const [confirming, setConfirming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tradeResult, setTradeResult] = useState<TradeResult>(null);
  const balance = useTradingStore((s) => s.balance);
  const positions = useTradingStore((s) => s.positions);
  const placeTrade = useTradingStore((s) => s.placeTrade);
  const sellPosition = useTradingStore((s) => s.sellPosition);
  const tradingMode = useAppStore((s) => s.tradingMode);

  const isClosed = status !== "OPEN";
  const isBuy = action === "BUY";
  const selectedPrice =
    side === "YES" ? probability / 100 : 1 - probability / 100;
  const degenerate = selectedPrice <= 0.01;
  const holding = side
    ? positions.find((p) => p.marketId === marketId && p.side === side)
    : undefined;
  const sharesHeld = holding?.shares ?? 0;
  const averagePrice = holding?.averagePrice ?? selectedPrice;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const setAmount = (v: string) =>
    setValue("amount", v, { shouldValidate: true });

  const amount = watch("amount");
  const numericAmount = Number(amount) || 0;
  const shares = numericAmount / Math.max(selectedPrice, 0.01);
  const fees = round2(numericAmount * FEE_RATE);

  let payout = 0;
  let total = 0;
  let profit = 0;
  if (isBuy) {
    payout = round2(shares);
    total = round2(numericAmount + fees);
    profit = round2(payout - total);
  } else {
    const costBasis = round2(Math.min(shares, sharesHeld) * averagePrice);
    payout = round2(numericAmount);
    total = round2(Math.max(numericAmount - fees, 0));
    profit = round2(numericAmount - costBasis - fees);
  }

  const insufficient = numericAmount > balance;
  const outOfRange =
    numericAmount > 0 &&
    (numericAmount < MIN_TRADE || numericAmount > MAX_TRADE);
  const noShares = sharesHeld <= 0;
  const notEnoughShares = !noShares && shares > sharesHeld;

  const canSubmit =
    Boolean(side) &&
    isValid &&
    numericAmount > 0 &&
    !outOfRange &&
    (isBuy ? !insufficient && !degenerate : !noShares && !notEnoughShares);

  const selectSide = (s: "YES" | "NO") => {
    setSide(s);
    setTradeResult(null);
    const params = new URLSearchParams(window.location.search);
    params.set("trade", s);
    router.replace(`/markets/${marketId}?${params.toString()}`, { scroll: false });
  };

  const onSubmit = handleSubmit(async () => {
    if (!side) return;
    setConfirming(true);
  });

  const confirmTrade = async () => {
    if (!side) return;
    setProcessing(true);
    try {
      if (isBuy) {
        await placeTrade({
          marketId,
          marketTitle,
          side,
          amount: numericAmount,
          price: selectedPrice,
        });
      } else {
        await sellPosition({
          marketId,
          marketTitle,
          side,
          amount: numericAmount,
          price: selectedPrice,
        });
      }
      setConfirming(false);
      setTradeResult("success");
      toast.success(
        `${tradingMode === "DEMO" ? "Demo " : ""}${isBuy ? "Bought" : "Sold"} ${side} ${formatCurrency(numericAmount)}`
      );
      onSuccess?.();
    } catch {
      setConfirming(false);
      setTradeResult("failure");
      toast.error(isBuy ? "Trade failed. Please try again." : "No shares to sell. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (tradeResult) {
    return (
      <div className="rounded-[16px] border border-border bg-surface p-5">
        <div
          className={cn(
            "flex flex-col items-center gap-3 rounded-[12px] p-6 text-center",
            tradeResult === "success"
              ? "bg-success-light"
              : "bg-danger-light"
          )}
        >
          {tradeResult === "success" ? (
            <CheckCircle2 className="h-10 w-10 text-success" />
          ) : (
            <XCircle className="h-10 w-10 text-danger" />
          )}
          <div>
            <p
              className={cn(
                "text-base font-bold",
                tradeResult === "success" ? "text-success" : "text-danger"
              )}
            >
              {tradeResult === "success"
                ? "Trade Placed Successfully"
                : "Trade Failed"}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {tradeResult === "success"
                ? `You ${isBuy ? "bought" : "sold"} ${side} ${formatCurrency(numericAmount)} on "${marketTitle}"`
                : "Something went wrong. Please try again."}
            </p>
          </div>
          <Button
            variant={tradeResult === "success" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setTradeResult(null)}
          >
            {tradeResult === "success" ? "Place Another Trade" : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-border bg-surface p-5">
      <div
        role="tablist"
        aria-label="Trade action"
        className="grid grid-cols-2 gap-1 rounded-[10px] bg-background p-1"
      >
        {(["BUY", "SELL"] as const).map((a) => (
          <button
            key={a}
            role="tab"
            aria-selected={action === a}
            onClick={() => {
              setAction(a);
              setTradeResult(null);
            }}
            className={cn(
              "h-9 rounded-[8px] text-sm font-bold capitalize transition-colors",
              action === a
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            {a.toLowerCase()}
          </button>
        ))}
      </div>

      {isClosed ? (
        <div className="mt-4 rounded-[12px] bg-background p-4 text-center">
          <p className="text-sm font-semibold text-text-primary">
            {status === "RESOLVED" ? "Market resolved" : "Market closed"}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {status === "RESOLVED"
              ? "This market has settled and is no longer tradable."
              : "Trading has ended for this market."}
          </p>
        </div>
      ) : (
        <>
          <div
            role="group"
            aria-label="Choose outcome"
            className="mt-3 grid grid-cols-2 gap-2"
          >
            <button
              onClick={() => selectSide("YES")}
              aria-pressed={side === "YES"}
              className={cn(
                "inline-flex h-10 items-center justify-between gap-2 rounded-[10px] px-3 text-sm font-bold transition-all",
                side === "YES"
                  ? "bg-success text-white shadow-sm"
                  : "bg-success-light text-success hover:bg-success/20"
              )}
            >
              <span>YES</span>
              <span>{toCents(probability)}</span>
            </button>
            <button
              onClick={() => selectSide("NO")}
              aria-pressed={side === "NO"}
              className={cn(
                "inline-flex h-10 items-center justify-between gap-2 rounded-[10px] px-3 text-sm font-bold transition-all",
                side === "NO"
                  ? "bg-danger text-white shadow-sm"
                  : "bg-danger-light text-danger hover:bg-danger/20"
              )}
            >
              <span>NO</span>
              <span>{toCents(100 - probability)}</span>
            </button>
          </div>

          <p className="mt-3 text-xs text-text-muted">
            Your Balance{" "}
            <span className="font-semibold text-text-primary">
              {fmtUsdc(balance)}
            </span>{" "}
            {tradingMode === "DEMO" ? "(Demo)" : ""}
          </p>

          <div className="mt-4">
            <div className="grid grid-cols-5 gap-1.5">
              {QUICK_AMOUNTS.map((a) => {
                const selected = Number(amount) === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAmount(a.toString())}
                    aria-pressed={selected}
                    className={cn(
                      "h-9 rounded-[8px] text-sm font-bold transition-colors",
                      selected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-background text-text-secondary hover:bg-border"
                    )}
                  >
                    {a}
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={QUICK_AMOUNTS.every((a) => Number(amount) !== a)}
                className={cn(
                  "h-9 rounded-[8px] text-xs font-bold transition-colors",
                  QUICK_AMOUNTS.every((a) => Number(amount) !== a)
                    ? "bg-primary text-white shadow-sm"
                    : "bg-background text-text-secondary hover:bg-border"
                )}
              >
                Custom
              </button>
            </div>

            <div className="mt-2.5">
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-text-muted">
                  $
                </span>
                <Controller
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="0.00"
                      inputMode="decimal"
                      className="pl-7 text-base font-bold"
                      invalid={Boolean(errors.amount) || (isBuy && insufficient) || outOfRange}
                      {...field}
                    />
                  )}
                  control={control}
                  name="amount"
                />
              </div>
              <FieldError>{errors.amount?.message}</FieldError>
              {isBuy && insufficient && (
                <FieldError>Insufficient balance.</FieldError>
              )}
              {outOfRange && (
                <FieldError>
                  Minimum ${MIN_TRADE.toFixed(2)} · Maximum $
                  {MAX_TRADE.toLocaleString()}.00
                </FieldError>
              )}
              {!isBuy && noShares && (
                <p className="mt-1.5 rounded-[10px] bg-danger-light px-3 py-2 text-xs font-semibold text-danger">
                  You don&rsquo;t hold any {side} shares in this market yet.
                </p>
              )}
              {!isBuy && !noShares && notEnoughShares && (
                <p className="mt-1.5 rounded-[10px] bg-danger-light px-3 py-2 text-xs font-semibold text-danger">
                  Insufficient {side} shares — you hold {sharesHeld}.
                </p>
              )}
              <p className="mt-1.5 text-[11px] text-text-muted">
                Minimum trade ${MIN_TRADE.toFixed(2)} · Maximum $
                {MAX_TRADE.toLocaleString()}.00
              </p>
            </div>
          </div>

          {!side ? (
            <p className="mt-4 rounded-[10px] bg-background px-3 py-2 text-center text-xs text-text-secondary">
              Select YES or NO to start trading
            </p>
          ) : (
            <>
              {degenerate && isBuy && (
                <p className="mt-4 rounded-[10px] bg-danger-light px-3 py-2 text-xs font-semibold text-danger">
                  Trading is temporarily unavailable for this side while the
                  market settles.
                </p>
              )}
              <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
                <div className="space-y-2 rounded-[12px] bg-background p-3.5">
                  <SummaryRow label="Shares (approx.)">
                    ~{fmtShares(shares)}
                  </SummaryRow>
                  <SummaryRow label={isBuy ? "Est. Payout" : "Est. Credit"}>
                    {fmtUsdc(payout)}
                  </SummaryRow>
                  <SummaryRow label="Fees">{fmtUsdc(fees)}</SummaryRow>
                  <SummaryRow label="Est. Total">{fmtUsdc(total)}</SummaryRow>
                  <Separator />
                  <div className="flex items-center justify-between pt-1 text-sm">
                    <span className="text-text-secondary">Potential Profit</span>
                    <span
                      className={cn(
                        "number-tight font-bold",
                        profit >= 0 ? "text-success" : "text-danger"
                      )}
                    >
                      {profit > 0 ? "+" : profit < 0 ? "-" : ""}
                      {Math.abs(profit).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      USDC
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={side === "YES" ? "success" : "destructive"}
                  className="h-11 w-full text-base"
                  disabled={!canSubmit}
                >
                  {isBuy ? "Buy" : "Sell"} {side}
                </Button>
              </form>
            </>
          )}

          <Modal open={confirming} onOpenChange={setConfirming}>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Confirm trade</ModalTitle>
                <ModalDescription>
                  Review your order before placing it.
                </ModalDescription>
              </ModalHeader>

              <div className="rounded-[12px] border border-border bg-background p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-text-muted">Action</p>
                    <p className="mt-0.5 font-bold text-text-primary">
                      {isBuy ? "Buy" : "Sell"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Side</p>
                    <p className="mt-0.5 font-bold text-text-primary">
                      {side} @ {formatCurrency(selectedPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Amount</p>
                    <p className="number-tight mt-0.5 font-bold text-text-primary">
                      {formatCurrency(numericAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">
                      {isBuy ? "Est. Payout" : "Est. Credit"}
                    </p>
                    <p className="number-tight mt-0.5 font-bold text-success">
                      {formatCurrency(payout)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Fees</p>
                    <p className="number-tight mt-0.5 font-semibold text-text-secondary">
                      {formatCurrency(fees)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Estimated Profit</p>
                    <p className="number-tight mt-0.5 font-bold text-text-primary">
                      +{formatCurrency(profit)}
                    </p>
                  </div>
                </div>
                <Separator className="my-3" />
                <p className="text-xs text-text-muted">{marketTitle}</p>
              </div>

              <ModalFooter>
                <Button
                  variant="secondary"
                  onClick={() => setConfirming(false)}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button onClick={confirmTrade} loading={processing}>
                  Confirm {isBuy ? "Buy" : "Sell"}
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="number-tight font-bold text-text-primary">{children}</span>
    </div>
  );
}