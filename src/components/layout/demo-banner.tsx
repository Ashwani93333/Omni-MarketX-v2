"use client";

import { useAppStore } from "@/store/app-store";

export function DemoBanner() {
  const tradingMode = useAppStore((s) => s.tradingMode);
  const setTradingMode = useAppStore((s) => s.setTradingMode);

  const isDemo = tradingMode === "DEMO";

  return (
    <div
      className={
        isDemo ? "border-b border-orange/20 bg-orange-light" : "h-0 overflow-hidden"
      }
      aria-hidden={!isDemo}
    >
      {isDemo ? (
        <div className="mx-auto flex max-w-[1500px] items-center justify-end gap-3 px-4 py-1.5">
          <p className="min-w-0 flex-1 items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-orange sm:text-xs">
            <span
              className="hidden h-2 w-2 rounded-full bg-orange sm:inline-block"
              aria-hidden="true"
            />
            Demo trading mode — virtual funds, not real money
          </p>
          <button
            onClick={() => setTradingMode("REAL")}
            className="shrink-0 rounded-full border border-orange/30 px-3 py-0.5 text-[11px] font-semibold text-orange transition-colors hover:bg-orange/10"
          >
            Exit Demo
          </button>
        </div>
      ) : null}
    </div>
  );
}