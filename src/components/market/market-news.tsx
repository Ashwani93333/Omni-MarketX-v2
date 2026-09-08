"use client";

import { MessageCircle, Newspaper, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { newsService } from "@/services/news.service";
import type { Market } from "@/types";

const IMPACT_STYLES: Record<string, string> = {
  HIGH: "bg-danger-light text-danger",
  MEDIUM: "bg-primary-light text-primary",
  LOW: "bg-background text-text-muted",
};

const SENTIMENT_STYLES: Record<string, string> = {
  positive: "text-success",
  negative: "text-danger",
  neutral: "text-text-muted",
};

function formatMinutesAgo(minutesAgo: number): string {
  if (minutesAgo < 60) return `${Math.max(1, minutesAgo)}m ago`;
  if (minutesAgo < 60 * 24) return `${Math.floor(minutesAgo / 60)}h ago`;
  return `${Math.floor(minutesAgo / 1440)}d ago`;
}

export function MarketNews({ market }: { market: Market }) {
  const articles = useMemo(
    () => newsService.getMarketNews(market, 4),
    [market]
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="h-4 w-4 text-primary" />
          Market News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {articles.map((article) => (
          <Link
            key={article.id}
            href="#"
            className="block rounded-[12px] border border-border bg-background p-3.5 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="font-bold text-text-primary">{article.source}</span>
              <span
                className={cn(
                  "rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                  IMPACT_STYLES[article.impact]
                )}
              >
                {article.impact} impact
              </span>
              <span
                className={cn(
                  "font-semibold capitalize",
                  SENTIMENT_STYLES[article.sentiment]
                )}
              >
                {article.sentiment}
              </span>
              <span className="ml-auto text-text-muted">
                {formatMinutesAgo(article.minutesAgo)}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold leading-snug text-text-primary">
              {article.headline}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-text-secondary">
              {article.excerpt}
            </p>
            <div className="mt-2.5 flex items-center gap-4 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-3.5 w-3.5" />
                <span className="number-tight">{article.likes}</span>
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                <span className="number-tight">{article.comments}</span>
              </span>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}