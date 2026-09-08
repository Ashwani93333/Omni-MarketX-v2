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

const tradeSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter a valid amount"),
});

type TradeForm = z.infer<typeof tradeSchema>;

type TradeResult = "success" | "failure" | null;

export function TradePanel({
  marketId,
  marketTitle,
  probability,
  onSuccess,
}: {
  marketId: string;
  marketTitle: string;
  probability: number;
  onSuccess?: () => void;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [side, setSide] = useState<"YES" | "NO" | null>(() => {
    const t = searchParams.get("trade");
    return t === "YES" || t === "NO" ? t : null;
  });
  const [confirming, setConfirming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [tradeResult, setTradeResult] = useState<TradeResult>(null);
  const balance = useTradingStore((s) => s.balance);
  const placeTrade = useTradingStore((s) => s.placeTrade);
  const tradingMode = useAppStore((s) => s.tradingMode);

  const selectedPrice = side === "YES" ? probability / 100 : 1 - probability / 100;
  const degenerate = selectedPrice <= 0.01;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<TradeForm>({
    resolver: zodResolver(tradeSchema),
    mode: "onChange",
    defaultValues: { amount: "" },
  });

  const amount = watch("amount");
  const numericAmount = Number(amount) || 0;
  const potentialReturn = numericAmount / Math.max(selectedPrice, 0.01);
  const estimatedProfit = potentialReturn - numericAmount;
  const insufficient = numericAmount > balance;

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
      await placeTrade({
        marketId,
        marketTitle,
        side,
        amount: numericAmount,
        price: selectedPrice,
      });
      setConfirming(false);
      setTradeResult("success");
      toast.success(
        tradingMode === "DEMO"
          ? `Demo trade placed: ${side} ${formatCurrency(numericAmount)}`
          : `Trade placed: ${side} ${formatCurrency(numericAmount)}`
      );
      onSuccess?.();
    } catch {
      setConfirming(false);
      setTradeResult("failure");
      toast.error("Trade failed. Please try again.");
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
              {tradeResult === "success" ? "Trade Placed Successfully" : "Trade Failed"}
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              {tradeResult === "success"
                ? `You ${side} ${formatCurrency(numericAmount)} on "${marketTitle}"`
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
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-text-primary">Trade</h3>
        <span className="text-xs font-medium text-text-muted">
          {tradingMode === "DEMO" ? "Demo \u00B7 Virtual USDC" : "Real \u00B7 Live funds"}
        </span>
      </div>

      <div
        role="group"
        aria-label="Choose side"
        className="mt-4 grid grid-cols-2 gap-2"
      >
        <button
          onClick={() => selectSide("YES")}
          aria-pressed={side === "YES"}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-[10px] text-sm font-bold transition-all",
            side === "YES"
              ? "bg-success text-white shadow-sm"
              : "bg-success-light text-success hover:bg-success/20"
          )}
        >
          YES {probability}%
        </button>
        <button
          onClick={() => selectSide("NO")}
          aria-pressed={side === "NO"}
          className={cn(
            "inline-flex h-11 items-center justify-center rounded-[10px] text-sm font-bold transition-all",
            side === "NO"
              ? "bg-danger text-white shadow-sm"
              : "bg-danger-light text-danger hover:bg-danger/20"
          )}
        >
          NO {100 - probability}%
        </button>
      </div>

      {!side ? (
        <p className="mt-4 rounded-[10px] bg-background px-3 py-2 text-center text-xs text-text-secondary">
          Select YES or NO to start trading
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
          {degenerate && (
            <p className="rounded-[10px] bg-danger-light px-3 py-2 text-xs font-semibold text-danger">
              Trading is temporarily unavailable for this side while the market
              settles.
            </p>
          )}
          <div>
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
                    invalid={Boolean(errors.amount) || insufficient}
                    {...field}
                  />
                )}
                control={control}
                name="amount"
              />
            </div>
            <FieldError>{errors.amount?.message}</FieldError>
            {insufficient && (
              <FieldError>
                Insufficient {tradingMode === "DEMO" ? "virtual" : ""} balance.
              </FieldError>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-text-muted">
              <span>Balance: {formatCurrency(balance)}</span>
              <span>
                Price @ {side} {formatCurrency(selectedPrice)}
              </span>
            </div>
          </div>

          <div className="space-y-2 rounded-[12px] bg-background p-3.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Potential Return</span>
              <span className="font-bold text-text-primary">
                {formatCurrency(potentialReturn)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Estimated Profit</span>
              <span
                className={cn(
                  "number-tight font-bold",
                  estimatedProfit >= 0 ? "text-success" : "text-danger"
                )}
              >
                {estimatedProfit >= 0 ? "+" : ""}${estimatedProfit.toFixed(2)}
              </span>
            </div>
            {tradingMode === "REAL" && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Estimated Fees</span>
                <span className="font-semibold text-text-secondary">$0.00</span>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="h-11 w-full text-base"
            disabled={!isValid || insufficient || numericAmount <= 0 || degenerate}
          >
            {tradingMode === "DEMO" ? "Place Demo Trade" : "Place Trade"}
          </Button>
        </form>
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
                <p className="text-xs text-text-muted">Side</p>
                <p className="mt-0.5 font-bold text-text-primary">
                  {side === "YES" ? "YES" : "NO"} @{" "}
                  {formatCurrency(selectedPrice)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Amount</p>
                <p className="number-tight mt-0.5 font-bold text-text-primary">
                  {formatCurrency(numericAmount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Potential Return</p>
                <p className="number-tight mt-0.5 font-bold text-success">
                  {formatCurrency(potentialReturn)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted">Estimated Profit</p>
                <p className="number-tight mt-0.5 font-bold text-text-primary">
                  +{formatCurrency(estimatedProfit)}
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
              {tradingMode === "DEMO" ? "Confirm Demo Trade" : "Confirm Trade"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
