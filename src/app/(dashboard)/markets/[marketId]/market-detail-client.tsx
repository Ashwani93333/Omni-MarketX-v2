"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Info } from "lucide-react";
import { useRouter } from "next/navigation";

import { AiAssistantDialog } from "@/components/ai/ai-assistant-dialog";
import { AiSummaryCard } from "@/components/ai/ai-summary-card";
import { MarketActivity } from "@/components/market/market-activity";
import { MarketAlertsCard } from "@/components/market/market-alerts";
import { MarketPriceChart } from "@/components/market/market-chart";
import { MarketCardCompact } from "@/components/market/market-card-compact";
import { MarketDiscussion } from "@/components/market/market-discussion";
import { MarketNews } from "@/components/market/market-news";
import {
  FavoriteStar,
  MarketCategoryChip,
  MarketStatusBadge,
  MarketVolumeTraders,
} from "@/components/market/market-probability";
import { MarketSentimentCard } from "@/components/market/market-sentiment";
import { TradePanel } from "@/components/market/trade-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Separator } from "@/components/ui/separator";
import { formatCompactNumber, formatDate } from "@/lib/format";
import { marketService } from "@/services/market.service";
import type { MarketOutcome } from "@/types";

const OUTCOME_COLORS: Record<string, string> = {
  YES: "bg-success",
  NO: "bg-danger",
  default: "bg-primary",
};

export function MarketDetailClient({ marketId }: { marketId: string }) {
  const router = useRouter();
  const { data: market, isLoading, isError, refetch } = useQuery({
    queryKey: ["market", marketId],
    queryFn: () => marketService.getMarket(marketId),
  });

  const { data: others } = useQuery({
    queryKey: ["markets", "home"],
    queryFn: () => marketService.getMarkets({ sort: "Volume" }),
    enabled: Boolean(market),
  });

  const similar = others?.filter((m) => m.id !== marketId).slice(0, 4);

  if (isLoading) {
    return <div className="skeleton h-96 rounded-[16px]" />;
  }

  if (isError || !market) {
    return (
      <ErrorState
        title="Market not found"
        description="We couldn't find this market. It may have been removed."
        onRetry={() => {
          router.push("/markets");
          refetch();
        }}
      />
    );
  }

  const noPrice = 1 - market.probability / 100;

  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/markets");
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Markets
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="order-2 min-w-0 space-y-6 lg:order-1">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <MarketCategoryChip category={market.category} />
                <MarketStatusBadge status={market.status} />
                {market.source === "community" ? (
                  <Badge className="bg-primary-light text-primary">
                    Community
                  </Badge>
                ) : null}
                <FavoriteStar marketId={market.id} size="md" />
                <span className="ml-auto">
                  <AiAssistantDialog market={market} />
                </span>
              </div>
              <CardTitle className="text-xl font-bold leading-snug sm:text-2xl">
                {market.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <MarketVolumeTraders
                  volume={market.volume}
                  traders={market.traderCount}
                />
                {market.closesAt ? (
                  <span className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    Closes {formatDate(market.closesAt)}
                  </span>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <MarketPriceChart probability={market.probability} />
            </CardContent>
          </Card>

          <AiSummaryCard market={market} />

          {market.outcomes && market.outcomes.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {market.outcomes.map((outcome: MarketOutcome) => (
                    <li
                      key={outcome.id}
                      className="flex items-center justify-between gap-4 rounded-[12px] border border-border bg-background px-4 py-3"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${OUTCOME_COLORS[outcome.label] ?? OUTCOME_COLORS.default}`}
                        />
                        <span className="text-sm font-semibold text-text-primary">
                          {outcome.label}
                        </span>
                      </span>
                      <span className="text-sm text-text-secondary">
                        {outcome.probability}% · $
                        {outcome.price.toFixed(3)}
                      </span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="rounded-[12px] bg-success-light p-4">
                  <p className="text-xs font-bold uppercase text-success">YES</p>
                  <p className="number-tight mt-1 text-2xl font-extrabold text-text-primary">
                    {market.probability}%
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    $ {(market.probability / 100).toFixed(3)} / share
                  </p>
                </div>
                <div className="rounded-[12px] bg-danger-light p-4">
                  <p className="text-xs font-bold uppercase text-danger">NO</p>
                  <p className="number-tight mt-1 text-2xl font-extrabold text-text-primary">
                    {100 - market.probability}%
                  </p>
                  <p className="mt-1 text-xs text-text-secondary">
                    $ {noPrice.toFixed(3)} / share
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {market.description ? (
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <Info className="h-4 w-4 text-text-muted" />
                <CardTitle className="text-lg">About this market</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-text-secondary">
                <p>{market.description}</p>
                {market.resolutionCriteria ? (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-text-muted">
                        Resolution Criteria
                      </h3>
                      <p className="mt-2 text-text-secondary">
                        {market.resolutionCriteria}
                      </p>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          <MarketActivity
            marketId={market.id}
            lastPrice={market.probability / 100}
          />

          <MarketDiscussion marketId={market.id} />

          <MarketNews market={market} />
        </div>

        <aside className="order-1 space-y-6 lg:order-2 lg:sticky lg:top-20 self-start w-full">
          <TradePanel
            marketId={market.id}
            marketTitle={market.title}
            probability={market.probability}
            status={market.status}
          />

          <Card>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Volume</span>
                <span className="number-tight font-bold text-text-primary">
                  {formatCompactNumber(market.volume)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Traders</span>
                <span className="number-tight font-bold text-text-primary">
                  {market.traderCount.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Market Type</span>
                <span className="font-semibold text-text-primary">Binary</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Created</span>
                <span className="font-medium text-text-primary">
                  {formatDate(market.createdAt)}
                </span>
              </div>
            </CardContent>
          </Card>

          <MarketSentimentCard market={market} />

          <MarketAlertsCard
            marketId={market.id}
            marketTitle={market.title}
            probability={market.probability}
          />
        </aside>
      </div>

      {similar && similar.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-text-primary">
            You may also like
          </h2>
          <div className="space-y-3">
            {similar.map((m) => (
              <MarketCardCompact key={m.id} market={m} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}