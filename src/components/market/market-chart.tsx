"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_RANGES } from "@/constants";
import { cn } from "@/lib/utils";

function generateData(basePrice: number, range: string, points = 24) {
  const now = Date.now();
  const rangesMs: Record<string, number> = {
    "1H": 60 * 60 * 1000,
    "24H": 24 * 60 * 60 * 1000,
    "7D": 7 * 24 * 60 * 60 * 1000,
    "30D": 30 * 24 * 60 * 60 * 1000,
    ALL: 90 * 24 * 60 * 60 * 1000,
  };
  const span = rangesMs[range] ?? rangesMs["24H"];
  const data = [];
  let price = Math.max(0.02, basePrice - 0.06);
  for (let i = 0; i < points; i++) {
    const t = now - span + (i / (points - 1)) * span;
    const drift = (basePrice - price) * (i / points);
    const wave = Math.sin(i / 2.5) * 0.015;
    price = Math.max(0.01, Math.min(0.99, basePrice - 0.06 + drift + wave));
    data.push({
      time: new Date(t).toISOString(),
      price: Math.round(price * 1000) / 1000,
    });
  }
  data[data.length - 1] = { ...data[data.length - 1], price: basePrice };
  return data;
}

export function MarketPriceChart({ probability }: { probability: number }) {
  const [range, setRange] = useState<(typeof CHART_RANGES)[number]>("24H");
  const data = generateData(probability / 100, range);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-text-muted">Price history</p>
          <p className="number-tight mt-0.5 text-xl font-bold text-text-primary">
            ${(probability / 100).toFixed(3)}
          </p>
        </div>
        <div className="inline-flex items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5">
          {CHART_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                range === r
                  ? "bg-surface text-text-primary shadow-[var(--shadow-sm)]"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#149447" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#149447" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(t) =>
                new Date(t).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              }
              minTickGap={40}
            />
            <YAxis
              domain={[0, 1]}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tick={{ fontSize: 11, fill: "var(--text-muted)" }}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: "var(--shadow-md)",
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--text-muted)", fontWeight: 600 }}
              itemStyle={{ color: "var(--text-primary)", fontWeight: 700 }}
              labelFormatter={(t) => {
                const n = Number(t);
                return new Date(n).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                });
              }}
              formatter={(value, name) => [
                `${(Number(value) * 100).toFixed(1)}%`,
                String(name),
              ]}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#149447"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}