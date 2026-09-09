"use client";

import { CalendarDays, Link2, MapPin, Sparkles, Tags } from "lucide-react";
import type { ReactNode } from "react";

import {
  formatClosesAt,
  isValidUrl,
  type CreateMarketDraft,
} from "./create-market.types";
import { MarketPreviewCard } from "./market-preview-card";

function FactRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-text-muted">{label}</span>
      <span className="text-right font-medium text-text-primary">{value}</span>
    </div>
  );
}

export function ReviewStep({
  draft,
}: {
  draft: CreateMarketDraft;
}) {
  const isMulti = draft.marketType === "MULTI";
  const typeLabel = isMulti
    ? `Multiple choice (${draft.outcomes.filter((o) => o.trim()).length})`
    : "Yes / No";
  const hasSource = isValidUrl(draft.sourceUrl);

  return (
    <div className="space-y-6">
      <MarketPreviewCard draft={draft} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-[14px] border border-border bg-surface p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
            <Sparkles className="h-4 w-4 text-primary" />
            Resolution plan
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            {draft.resolutionCriteria.trim() || "\u2014"}
          </p>
          <div className="mt-3 space-y-1.5 text-xs text-text-muted">
            {hasSource ? (
              <p className="flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5" />
                {draft.sourceUrl.trim()}
              </p>
            ) : null}
            <p className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {draft.earlyResolution
                ? "Early resolution enabled"
                : "Standard resolution only"}
            </p>
          </div>
        </div>

        <div className="rounded-[14px] border border-border bg-surface p-4">
          <h3 className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
            <Tags className="h-4 w-4 text-primary" />
            Publishing details
          </h3>
          <div className="mt-2">
            <FactRow label="Type" value={typeLabel} />
            <FactRow
              label={isMulti ? "Opening split" : "Starting price"}
              value={
                isMulti
                  ? "Evenly split"
                  : `YES ${draft.probability}\u00a2 / NO ${100 - draft.probability}\u00a2`
              }
            />
            <FactRow label="Category" value={draft.category || "\u2014"} />
            <FactRow
              label="Closing"
              value={formatClosesAt(draft.closesAt, draft.timezone)}
            />
            <FactRow
              label="Timezone"
              value={
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-text-muted" />
                  {draft.timezone}
                </span>
              }
            />
            <FactRow
              label="Tags"
              value={
                draft.tags.length > 0
                  ? draft.tags.map((t) => `#${t}`).join(", ")
                  : "\u2014"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}