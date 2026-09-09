"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/format";
import { marketService } from "@/services/market.service";
import type { OrderBookLevel } from "@/types";

interface DepthPoint {
  price: number;
  total: number;
}

interface DepthTooltipEntry {
  name?: string;
  payload?: DepthPoint;
}

function DepthTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: DepthTooltipEntry[];
}) {
  const entry = payload?.[0];
  if (!active || !entry?.payload) return null;
  const { price, total } = entry.payload;
  const isBid = entry.name === "Bids";
  return (
    <div
      className={cn(
        "rounded-[10px] border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-md)]"
      )}
    >
      <p
        className={cn(
          "mb-1 font-bold",
          isBid ? "text-success" : "text-danger"
        )}
      >
        {isBid ? "Bids" : "Asks"} depth
      </p>
      <p className="flex justify-between gap-4 text-text-muted">
        <span>At</span>
        <span className="number-tight font-semibold text-text-primary">
          {Math.round(price * 1000) / 10}{"\u00a2"}
        </span>
      </p>
      <p className="flex justify-between gap-4 text-text-muted">
        <span>Cumulative</span>
        <span className="number-tight font-semibold text-text-primary">
          {total.toLocaleString()} shares
        </span>
      </p>
    </div>
  );
}

function cents(v: number): string {
  return `${Math.round(v * 1000) / 10}\u00a2`;
}

export function OrderBookDepth({
  marketId,
  lastPrice,
}: {
  marketId: string;
  lastPrice: number;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-book", marketId, lastPrice],
    queryFn: () => marketService.getOrderBook(marketId, lastPrice),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <Skeleton className="h-44 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-[10px] bg-background px-3 py-2 text-xs text-text-secondary">
        Depth chart unavailable right now.
      </p>
    );
  }

  const asks = data.filter((l) => l.side === "SELL");
  const bids = data.filter((l) => l.side === "BUY");

  const askSeries: DepthPoint[] = asks.map((l: OrderBookLevel) => ({
    price: l.price,
    total: l.total,
  }));
  const bidSeries: DepthPoint[] = [...bids]
    .reverse()
    .map((l: OrderBookLevel) => ({ price: l.price, total: l.total }));

  const bestBid = bids[0]?.price ?? lastPrice;
  const bestAsk = asks[0]?.price ?? lastPrice;
  const spread = Math.max(0, bestAsk - bestBid);
  const bidDepth = bidSeries[bidSeries.length - 1]?.total ?? 0;
  const askDepth = askSeries[askSeries.length - 1]?.total ?? 0;

  return (
    <div>
      <div className="mb-2 grid grid-cols-3 gap-2">
        <div className="rounded-[10px] border border-border bg-background px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Bids depth
          </p>
          <p className="number-tight text-sm font-bold text-success">
            {formatCompactNumber(bidDepth)}
          </p>
          <p className="number-tight text-[11px] text-text-muted">
            best {cents(bestBid)}
          </p>
        </div>
        <div className="rounded-[10px] border border-border bg-background px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Spread
          </p>
          <p className="number-tight text-sm font-bold text-text-primary">
            {cents(spread)}
          </p>
          <p className="number-tight text-[11px] text-text-muted">
            last {cents(lastPrice)}
          </p>
        </div>
        <div className="rounded-[10px] border border-border bg-background px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            Asks depth
          </p>
          <p className="number-tight text-sm font-bold text-danger">
            {formatCompactNumber(askDepth)}
          </p>
          <p className="number-tight text-[11px] text-text-muted">
            best {cents(bestAsk)}
          </p>
        </div>
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart>
            <defs>
              <linearGradient id="depthBidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--success)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--success)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="depthAskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--danger)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--danger)" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />

            <XAxis
              dataKey="price"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={cents}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border-light)" }}
              tickLine={{ stroke: "var(--border-light)" }}
              interval="preserveStartEnd"
            />

            <YAxis
              dataKey="total"
              type="number"
              tickFormatter={(v: number) => formatCompactNumber(v)}
              tick={{ fontSize: 10, fill: "var(--text-muted)" }}
              axisLine={{ stroke: "var(--border-light)" }}
              tickLine={{ stroke: "var(--border-light)" }}
              width={44}
            />

            <Tooltip content={<DepthTooltip />} cursor={false} />

            <ReferenceLine
              x={lastPrice}
              stroke="var(--text-muted)"
              strokeDasharray="4 3"
              label={{
                value: cents(lastPrice),
                fill: "var(--text-muted)",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            <Area
              data={bidSeries}
              name="Bids"
              dataKey="total"
              type="monotone"
              stroke="var(--success)"
              strokeWidth={2}
              fill="url(#depthBidGradient)"
              isAnimationActive={false}
            />
            <Area
              data={askSeries}
              name="Asks"
              dataKey="total"
              type="monotone"
              stroke="var(--danger)"
              strokeWidth={2}
              fill="url(#depthAskGradient)"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}