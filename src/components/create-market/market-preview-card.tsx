"use client";

import { Clock, ExternalLink } from "lucide-react";
import Image from "next/image";

import {
  MarketCategoryChip,
  ProbabilityBar,
} from "@/components/market/market-probability";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  formatClosesAt,
  isMarketCategory,
  isValidUrl,
  type CreateMarketDraft,
} from "./create-market.types";

export function MarketPreviewCard({
  draft,
  className,
}: {
  draft: CreateMarketDraft;
  className?: string;
}) {
  const isMulti = draft.marketType === "MULTI";
  const outcomes = draft.outcomes.map((o) => o.trim()).filter(Boolean);
  const hasSource = isValidUrl(draft.sourceUrl);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-sm)]",
        className
      )}
    >
      {draft.image ? (
        <div className="relative h-40 w-full border-b border-border-light">
          <Image
            src={draft.image}
            alt=""
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {draft.category && isMarketCategory(draft.category) ? (
            <MarketCategoryChip category={draft.category} />
          ) : (
            <Badge variant="outline" className="text-[11px] font-semibold">
              Uncategorized
            </Badge>
          )}
          <Badge className="bg-primary-light text-[11px] font-bold text-primary">
            Community
          </Badge>
        </div>

        <h3 className="mt-3 text-[15px] font-semibold leading-snug text-text-primary">
          {draft.question.trim() || "Your market question"}
        </h3>

        {isMulti && outcomes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {outcomes.map((label, index) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 text-xs font-bold text-text-primary"
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    index === 0 ? "bg-success" : "bg-primary"
                  )}
                />
                {label}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <ProbabilityBar probability={draft.probability} />
          </div>
        )}

        {draft.tags.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {draft.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-muted">
          {draft.closesAt ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Closes {formatClosesAt(draft.closesAt, draft.timezone)}
            </span>
          ) : null}
          {hasSource ? (
            <span className="inline-flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              Source
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}