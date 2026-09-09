"use client";

import { CandlestickChart, LineChart, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CHART_RANGES } from "@/constants";
import { cn } from "@/lib/utils";
import { formatCompactNumber } from "@/lib/format";

type ChartRange = (typeof CHART_RANGES)[number];
type ChartMode = "candles" | "line";

interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const RANGE_MS: Record<ChartRange, number> = {
  "1H": 60 * 60 * 1000,
  "24H": 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "30D": 30 * 24 * 60 * 60 * 1000,
  ALL: 90 * 24 * 60 * 60 * 1000,
};

const POINTS: Record<ChartRange, number> = {
  "1H": 30,
  "24H": 48,
  "7D": 56,
  "30D": 64,
  ALL: 64,
};

const VOLATILITY: Record<ChartRange, number> = {
  "1H": 0.004,
  "24H": 0.008,
  "7D": 0.015,
  "30D": 0.03,
  ALL: 0.045,
};

const LAYOUT = { top: 14, right: 12, bottom: 26, left: 46 };
const VOLUME_HEIGHT = 42;
const SVG_HEIGHT = 252;

function createRng(seed: number) {
  let state = seed || 1;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clampPrice(p: number): number {
  return Math.max(0.01, Math.min(0.99, p));
}

function generateCandles(
  basePrice: number,
  range: ChartRange,
  count: number
): Candle[] {
  const rng = createRng(Math.round(basePrice * 10000) + POINTS[range] * 97);
  const span = RANGE_MS[range];
  const step = span / (count - 1);
  const vol = VOLATILITY[range];
  const now = Date.now();
  let price = clampPrice(basePrice * (0.9 + rng() * 0.16));
  const candles: Candle[] = [];

  for (let i = 0; i < count; i++) {
    const open = price;
    const drift = (basePrice - open) * 0.2 + (rng() * 2 - 1) * vol;
    const close = clampPrice(open + drift);
    const upper = Math.max(open, close);
    const lower = Math.min(open, close);
    const high = clampPrice(upper * (1 + rng() * vol * 2));
    const low = clampPrice(lower * (1 - rng() * vol * 2));
    const volume = Math.round(
      (900 + rng() * 3400) * (1 + Math.abs(close - open) * 25)
    );
    candles.push({
      time: now - (count - 1 - i) * step,
      open,
      high,
      low,
      close,
      volume,
    });
    price = close;
  }

  const last = candles[candles.length - 1];
  candles[candles.length - 1] = {
    ...last,
    close: basePrice,
    high: Math.max(last.high, basePrice),
    low: Math.min(last.low, basePrice),
  };
  return candles;
}

function niceStep(rough: number): number {
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
  return step * mag;
}

function ticksBetween(min: number, max: number, target = 4): number[] {
  const span = max - min;
  if (span <= 0) return [];
  const step = niceStep(span / Math.max(1, target - 1));
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) {
    ticks.push(v);
  }
  return ticks;
}

function timeLabel(time: number, range: ChartRange): string {
  const d = new Date(time);
  if (range === "1H" || range === "24H") {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MarketPriceChart({ probability }: { probability: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    startIdx: number;
    lastIdx: number;
    moved: boolean;
  } | null>(null);

  const [range, setRange] = useState<ChartRange>("24H");
  const [mode, setMode] = useState<ChartMode>("candles");
  const [view, setView] = useState<{
    range: ChartRange;
    start: number;
    end: number;
  } | null>(null);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const candles = useMemo(
    () => generateCandles(probability / 100, range, POINTS[range]),
    [probability, range]
  );

  const activeView = view && view.range === range ? view : null;
  const visible =
    activeView && activeView.end > activeView.start
      ? candles.slice(activeView.start, activeView.end)
      : candles;

  const count = visible.length;
  const plotW = Math.max(0, width - LAYOUT.left - LAYOUT.right);
  const plotH = SVG_HEIGHT - LAYOUT.top - LAYOUT.bottom - VOLUME_HEIGHT - 8;
  const priceBottom = LAYOUT.top + plotH;
  const stepX = count > 1 ? plotW / (count - 1) : plotW;
  const bodyW = Math.max(2, Math.min(10, stepX * 0.62));

  const priceMin = Math.min(...visible.map((c) => c.low));
  const priceMax = Math.max(...visible.map((c) => c.high));
  const pad = (priceMax - priceMin) * 0.08 || 0.02;
  const yMin = Math.max(0, priceMin - pad);
  const yMax = Math.min(1, priceMax + pad);
  const volMax = Math.max(...visible.map((c) => c.volume), 1);

  const priceTicks = ticksBetween(yMin, yMax);
  const volTicks = ticksBetween(0, volMax).filter((t) => t > 0);

  const xi = (i: number) => LAYOUT.left + stepX * i;
  const yi = (p: number) =>
    LAYOUT.top + ((yMax - p) / Math.max(1e-9, yMax - yMin)) * plotH;

  const xTickEvery = Math.max(1, Math.ceil(72 / Math.max(1, stepX)));
  const xTicks = visible
    .map((c, i) => ({ i, ...c }))
    .filter((_, i, arr) => i % xTickEvery === 0 || i === arr.length - 1);

  const change =
    visible.length >= 2
      ? ((visible[visible.length - 1].close - visible[0].open) /
          visible[0].open) *
        100
      : 0;

  const hoverCandle =
    hover !== null && hover >= 0 && hover < count ? visible[hover] : null;

  const linePath =
    mode === "line"
      ? visible.map((c, i) => `${i === 0 ? "M" : "L"}${xi(i)},${yi(c.close)}`).join(" ")
      : "";
  const areaPath =
    mode === "line"
      ? `${linePath} L${xi(count - 1)},${priceBottom} L${xi(0)},${priceBottom} Z`
      : "";

  const getIndexAt = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || stepX <= 0) return 0;
    const x = clientX - rect.left - LAYOUT.left;
    return Math.min(count - 1, Math.max(0, Math.round(x / stepX)));
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startIdx: getIndexAt(e.clientX), lastIdx: 0, moved: false };
    setHover(null);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const idx = getIndexAt(e.clientX);
    const drag = dragRef.current;
    if (drag) {
      drag.moved = drag.moved || Math.abs(idx - drag.startIdx) >= 2;
      drag.lastIdx = idx;
      setSelection({ start: drag.startIdx, end: idx });
    } else {
      setHover(idx);
    }
  };

  const handlePointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    setHover(null);
    setSelection(null);
    if (!drag?.moved) return;
    const windowStart = Math.min(drag.startIdx, drag.lastIdx);
    const windowEnd = Math.max(drag.startIdx, drag.lastIdx);
    if (windowEnd - windowStart >= 2) {
      const baseStart = activeView?.start ?? 0;
      setView({ range, start: baseStart + windowStart, end: baseStart + windowEnd });
    }
  };

  const sel = selection;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-text-muted">Price history</p>
          <div className="flex items-baseline gap-2">
            <p className="number-tight text-xl font-bold text-text-primary">
              ${(probability / 100).toFixed(3)}
            </p>
            <span
              className={cn(
                "number-tight text-xs font-bold",
                change >= 0 ? "text-success" : "text-danger"
              )}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </span>
          </div>
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

      <div className="flex items-center justify-between">
        <div
          role="group"
          aria-label="Chart type"
          className="inline-flex items-center gap-0.5 rounded-[10px] border border-border bg-background p-0.5"
        >
          <button
            onClick={() => setMode("candles")}
            aria-pressed={mode === "candles"}
            aria-label="Candlestick chart"
            title="Candlesticks"
            className={cn(
              "flex h-7 w-8 items-center justify-center rounded-lg transition-colors",
              mode === "candles"
                ? "bg-surface text-primary shadow-[var(--shadow-sm)]"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <CandlestickChart className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMode("line")}
            aria-pressed={mode === "line"}
            aria-label="Line chart"
            title="Line"
            className={cn(
              "flex h-7 w-8 items-center justify-center rounded-lg transition-colors",
              mode === "line"
                ? "bg-surface text-primary shadow-[var(--shadow-sm)]"
                : "text-text-muted hover:text-text-primary"
            )}
          >
            <LineChart className="h-4 w-4" />
          </button>
        </div>

        {activeView ? (
          <button
            onClick={() => setView(null)}
            className="inline-flex items-center gap-1 rounded-lg bg-background px-2 py-1 text-[11px] font-semibold text-primary transition-colors hover:bg-primary-light"
          >
            <RotateCcw className="h-3 w-3" />
            Reset zoom (double-click)
          </button>
        ) : (
          <span className="text-[11px] text-text-muted">
            Drag to zoom into a range
          </span>
        )}
      </div>

      <div ref={containerRef} className="relative w-full">
        {width > 0 ? (
          <>
            <svg
              ref={svgRef}
              width={width}
              height={SVG_HEIGHT}
              viewBox={`0 0 ${width} ${SVG_HEIGHT}`}
              role="img"
              aria-label={`${count} ${mode} price points over ${range}`}
              className="touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={() => {
                if (!dragRef.current) setHover(null);
              }}
              onDoubleClick={() => setView(null)}
            >
              <defs>
                <linearGradient id="advancedLineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                </linearGradient>
              </defs>

              {priceTicks.map((t) => (
                <g key={`grid-${t}`}>
                  <line
                    x1={LAYOUT.left}
                    x2={LAYOUT.left + plotW}
                    y1={yi(t)}
                    y2={yi(t)}
                    stroke="var(--border-light)"
                  />
                  <text
                    x={LAYOUT.left - 6}
                    y={yi(t) + 3.5}
                    textAnchor="end"
                    fontSize={10}
                    fill="var(--text-muted)"
                  >
                    {Math.round(t * 100)}%
                  </text>
                </g>
              ))}

              {mode === "candles"
                ? visible.map((c, i) => {
                    const up = c.close >= c.open;
                    const color = up ? "var(--success)" : "var(--danger)";
                    const x = xi(i);
                    const wickTop = yi(c.high);
                    const wickBottom = yi(c.low);
                    const bodyTop = Math.min(yi(c.open), yi(c.close));
                    const bodyH = Math.max(1, Math.abs(yi(c.open) - yi(c.close)));
                    return (
                      <g key={c.time}>
                        <line
                          x1={x}
                          x2={x}
                          y1={wickTop}
                          y2={wickBottom}
                          stroke={color}
                          strokeWidth={1}
                        />
                        <rect
                          x={x - bodyW / 2}
                          y={bodyTop}
                          width={bodyW}
                          height={bodyH}
                          rx={0.5}
                          fill={color}
                        />
                      </g>
                    );
                  })
                : null}

              {mode === "line" && areaPath ? (
                <>
                  <path d={areaPath} fill="url(#advancedLineGradient)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke="var(--success)"
                    strokeWidth={2}
                  />
                </>
              ) : null}

              {volTicks.map((t) => (
                <text
                  key={`volgrid-${t}`}
                  x={LAYOUT.left + plotW}
                  y={priceBottom + VOLUME_HEIGHT - (t / volMax) * VOLUME_HEIGHT + 3}
                  textAnchor="end"
                  fontSize={9}
                  fill="var(--text-muted)"
                >
                  {formatCompactNumber(t)}
                </text>
              ))}

              {xTicks.map(({ i, time: t }) => (
                <text
                  key={t}
                  x={xi(i)}
                  y={SVG_HEIGHT - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill="var(--text-muted)"
                >
                  {timeLabel(t, range)}
                </text>
              ))}

              {visible.map((c, i) => {
                const up = c.close >= c.open;
                const x = xi(i);
                const vh = (c.volume / volMax) * VOLUME_HEIGHT;
                return (
                  <rect
                    key={`vol-${c.time}`}
                    x={x - bodyW / 2}
                    y={priceBottom + (VOLUME_HEIGHT - vh)}
                    width={bodyW}
                    height={vh}
                    rx={0.5}
                    fill={up ? "var(--success)" : "var(--danger)"}
                    opacity={0.45}
                  />
                );
              })}

              {sel ? (
                <rect
                  x={xi(Math.min(sel.start, sel.end))}
                  y={LAYOUT.top}
                  width={Math.abs(xi(sel.end) - xi(sel.start))}
                  height={priceBottom - LAYOUT.top + VOLUME_HEIGHT}
                  fill="var(--primary)"
                  opacity={0.12}
                />
              ) : null}

              {hoverCandle ? (
                <g>
                  <line
                    x1={xi(hover ?? 0)}
                    x2={xi(hover ?? 0)}
                    y1={LAYOUT.top}
                    y2={SVG_HEIGHT - LAYOUT.bottom}
                    stroke="var(--text-muted)"
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={xi(hover ?? 0)}
                    cy={yi(hoverCandle.close)}
                    r={3.5}
                    fill="var(--surface)"
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                </g>
              ) : null}
            </svg>

            {hoverCandle && hover !== null ? (
              <div
                className="pointer-events-none absolute top-1 z-10 w-[168px] rounded-[10px] border border-border bg-surface px-3 py-2 text-xs shadow-[var(--shadow-md)]"
                style={{
                  left: Math.min(
                    Math.max(8, xi(hover) - 84),
                    Math.max(8, width - 176)
                  ),
                }}
              >
                <p className="mb-1 font-semibold text-text-muted">
                  {timeLabel(hoverCandle.time, range)}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                  <span className="text-text-muted">Open</span>
                  <span className="number-tight text-right font-semibold text-text-primary">
                    {Math.round(hoverCandle.open * 1000) / 10}{"\u00a2"}
                  </span>
                  <span className="text-text-muted">High</span>
                  <span className="number-tight text-right font-semibold text-success">
                    {Math.round(hoverCandle.high * 1000) / 10}{"\u00a2"}
                  </span>
                  <span className="text-text-muted">Low</span>
                  <span className="number-tight text-right font-semibold text-danger">
                    {Math.round(hoverCandle.low * 1000) / 10}{"\u00a2"}
                  </span>
                  <span className="text-text-muted">Close</span>
                  <span className="number-tight text-right font-semibold text-text-primary">
                    {Math.round(hoverCandle.close * 1000) / 10}{"\u00a2"}
                  </span>
                </div>
                <p className="mt-1 flex justify-between border-t border-border-light pt-1 text-text-muted">
                  <span>Volume</span>
                  <span className="number-tight font-semibold text-text-primary">
                    {formatCompactNumber(hoverCandle.volume)}
                  </span>
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div style={{ height: SVG_HEIGHT }} />
        )}
      </div>
    </div>
  );
}