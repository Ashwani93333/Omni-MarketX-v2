"use client";

import { Clock, Link2 } from "lucide-react";

import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import {
  formatClosesAt,
  TIMEZONES,
  type CreateMarketDraft,
} from "./create-market.types";

export function ResolutionStep({
  draft,
  errors,
  update,
}: {
  draft: CreateMarketDraft;
  errors: Record<string, string>;
  update: (patch: Partial<CreateMarketDraft>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <FieldLabel htmlFor="resolution-criteria">Resolution criteria</FieldLabel>
        <Textarea
          id="resolution-criteria"
          value={draft.resolutionCriteria}
          maxLength={500}
          rows={4}
          placeholder="What official source will determine the outcome? What counts as a clear result?"
          onChange={(e) => update({ resolutionCriteria: e.target.value })}
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <FieldError>{errors.resolutionCriteria}</FieldError>
          <span className="number-tight ml-auto text-[11px] font-medium text-text-muted">
            {draft.resolutionCriteria.length}/500
          </span>
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="source-url">Source URL</FieldLabel>
        <Input
          id="source-url"
          value={draft.sourceUrl}
          inputMode="url"
          placeholder="https://\u2026"
          onChange={(e) => update({ sourceUrl: e.target.value })}
        />
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
          <Link2 className="h-3.5 w-3.5" />
          Used for AI summaries and as evidence for resolution.
        </p>
        <FieldError>{errors.sourceUrl}</FieldError>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="closes-at">Closing date &amp; time</FieldLabel>
          <Input
            id="closes-at"
            type="datetime-local"
            value={draft.closesAt}
            onChange={(e) => update({ closesAt: e.target.value })}
          />
          <FieldError>{errors.closesAt}</FieldError>
        </div>
        <div>
          <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
          <Select
            value={draft.timezone}
            onValueChange={(value) => update({ timezone: value })}
          >
            <SelectTrigger id="timezone" aria-label="Timezone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {draft.closesAt ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary">
          <Clock className="h-3.5 w-3.5 text-text-muted" />
          Closes {formatClosesAt(draft.closesAt, draft.timezone)}
        </p>
      ) : null}

      <div>
        <FieldLabel>Early resolution</FieldLabel>
        <button
          type="button"
          role="switch"
          aria-checked={draft.earlyResolution}
          onClick={() => update({ earlyResolution: !draft.earlyResolution })}
          className={cn(
            "flex w-full items-center justify-between gap-4 rounded-[14px] border p-4 text-left transition-colors",
            draft.earlyResolution
              ? "border-primary bg-primary-light/50"
              : "border-border bg-background hover:border-primary/30"
          )}
        >
          <span>
            <span className="block text-sm font-bold text-text-primary">
              Allow early resolution
            </span>
            <span className="mt-0.5 block text-xs text-text-muted">
              Resolve before the closing date once the outcome is certain.
            </span>
          </span>
          <span
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              draft.earlyResolution ? "bg-primary" : "bg-border"
            )}
          >
            <span
              className={cn(
                "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform",
                draft.earlyResolution && "translate-x-5"
              )}
            />
          </span>
        </button>
        {draft.earlyResolution ? (
          <div className="mt-3">
            <FieldLabel htmlFor="early-criteria">
              Early resolution conditions
            </FieldLabel>
            <Textarea
              id="early-criteria"
              value={draft.earlyResolutionCriteria}
              maxLength={500}
              rows={2}
              placeholder="e.g. If the official result is confirmed before the closing date."
              onChange={(e) =>
                update({ earlyResolutionCriteria: e.target.value })
              }
            />
            <FieldError>{errors.earlyResolutionCriteria}</FieldError>
          </div>
        ) : null}
      </div>
    </div>
  );
}