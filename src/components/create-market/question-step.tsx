"use client";

import { Check, Loader2, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/constants";

import {
  improveQuestion,
  MAX_STARTING_PROBABILITY,
  MIN_STARTING_PROBABILITY,
  type CreateMarketDraft,
  type MarketType,
} from "./create-market.types";

const MARKET_TYPE_OPTIONS: { value: MarketType; title: string; desc: string }[] =
  [
    {
      value: "BINARY",
      title: "Yes / No",
      desc: "Binary resolution \u2014 buy YES or NO shares.",
    },
    {
      value: "MULTI",
      title: "Multiple choice",
      desc: "Between 2 and 5 possible outcomes.",
    },
  ];

export function QuestionStep({
  draft,
  errors,
  update,
}: {
  draft: CreateMarketDraft;
  errors: Record<string, string>;
  update: (patch: Partial<CreateMarketDraft>) => void;
}) {
  const [aiLoading, setAiLoading] = useState(false);

  const changeMarketType = (marketType: MarketType) => {
    if (marketType === "MULTI") {
      const outcomes =
        draft.outcomes.filter((o) => o.trim()).length >= 2
          ? draft.outcomes
          : ["", ""];
      update({ marketType, outcomes });
    } else {
      update({ marketType });
    }
  };

  const setOutcome = (index: number, value: string) =>
    update({ outcomes: draft.outcomes.map((o, i) => (i === index ? value : o)) });

  const removeOutcome = (index: number) =>
    update({ outcomes: draft.outcomes.filter((_, i) => i !== index) });

  const addOutcome = () => update({ outcomes: [...draft.outcomes, ""] });

  const handleImprove = () => {
    if (!draft.question.trim()) return;
    setAiLoading(true);
    window.setTimeout(() => {
      const improved = improveQuestion(draft.question);
      update({ question: improved });
      setAiLoading(false);
      toast.success("AI improved your question", { description: improved });
    }, 1200);
  };

  const setProbability = (value: number) => {
    if (Number.isNaN(value)) return;
    update({
      probability: Math.min(
        MAX_STARTING_PROBABILITY,
        Math.max(MIN_STARTING_PROBABILITY, Math.round(value))
      ),
    });
  };

  const { probability } = draft;
  const sliderProgress = ((probability - MIN_STARTING_PROBABILITY) /
    (MAX_STARTING_PROBABILITY - MIN_STARTING_PROBABILITY)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <FieldLabel htmlFor="market-question">Question</FieldLabel>
        <Input
          id="market-question"
          value={draft.question}
          maxLength={160}
          placeholder="Will the Fed cut rates before Q4 2026?"
          onChange={(e) => update({ question: e.target.value })}
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <FieldError>{errors.question}</FieldError>
          <span
            className={cn(
              "number-tight ml-auto text-[11px] font-medium text-text-muted",
              draft.question.length >= 150 && "text-orange"
            )}
          >
            {draft.question.length}/160
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleImprove}
            disabled={aiLoading || !draft.question.trim()}
          >
            {aiLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Improve question with AI
          </Button>
          <span className="text-xs text-text-muted">
            {aiLoading ? "Polishing your wording\u2026" : ""}
          </span>
        </div>
      </div>

      <div>
        <FieldLabel>Market type</FieldLabel>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MARKET_TYPE_OPTIONS.map((option) => {
            const selected = draft.marketType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => changeMarketType(option.value)}
                aria-pressed={selected}
                className={cn(
                  "rounded-[14px] border p-4 text-left transition-all",
                  selected
                    ? "border-primary bg-primary-light/50 shadow-[var(--shadow-sm)]"
                    : "border-border bg-background hover:border-primary/30"
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-text-primary">
                    {option.title}
                  </span>
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      selected
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface text-transparent"
                    )}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </span>
                <span className="mt-1 block text-xs text-text-muted">
                  {option.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="starting-probability">
          Starting probability
        </FieldLabel>
        {draft.marketType === "BINARY" ? (
          <div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative h-2 rounded-full bg-background">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    style={{ width: `${sliderProgress}%` }}
                  />
                  <span
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-surface shadow"
                    style={{ left: `calc(${sliderProgress}% - 8px)` }}
                  />
                  <input
                    id="starting-probability"
                    type="range"
                    min={MIN_STARTING_PROBABILITY}
                    max={MAX_STARTING_PROBABILITY}
                    step={1}
                    value={probability}
                    onChange={(e) => setProbability(Number(e.target.value))}
                    aria-label="Starting probability"
                    aria-valuetext={`${probability} percent`}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] font-medium text-text-muted">
                  <span>{MIN_STARTING_PROBABILITY}%</span>
                  <span>{MAX_STARTING_PROBABILITY}%</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={MIN_STARTING_PROBABILITY}
                  max={MAX_STARTING_PROBABILITY}
                  value={probability}
                  onChange={(e) => setProbability(Number(e.target.value))}
                  className="w-20 text-center"
                  aria-label="Starting probability percent"
                />
                <span className="text-sm font-bold text-text-secondary">%</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <span className="font-bold text-success">
                YES <span className="number-tight">{probability}&#162;</span>
              </span>
              <span className="font-bold text-text-secondary">
                <span className="number-tight">{100 - probability}&#162;</span>{" "}
                NO
              </span>
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              Shown as the per-share price when the market opens. The other side
              is priced at the inverse (100 &#8722; probability).
            </p>
            <FieldError>{errors.probability}</FieldError>
          </div>
        ) : (
          <p className="text-xs text-text-muted">
            Multiple-choice markets open with their outcomes evenly split.
          </p>
        )}
      </div>

      {draft.marketType === "MULTI" ? (
        <div>
          <FieldLabel>Outcomes</FieldLabel>
          <div className="space-y-2">{draft.outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={outcome}
                  maxLength={40}
                  placeholder={`Outcome ${index + 1}`}
                  aria-label={`Outcome ${index + 1}`}
                  onChange={(e) => setOutcome(index, e.target.value)}
                />
                {draft.outcomes.length > 2 ? (
                  <button
                    type="button"
                    onClick={() => removeOutcome(index)}
                    aria-label={`Remove outcome ${index + 1}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-colors hover:border-danger/40 hover:text-danger"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          {draft.outcomes.length < 5 ? (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addOutcome}
            >
              <Plus className="h-4 w-4" />
              Add outcome
            </Button>
          ) : null}
          <FieldError>{errors.outcomes}</FieldError>
        </div>
      ) : null}

      <div>
        <FieldLabel>Category</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={draft.category === category}
              onClick={() => update({ category })}
            >
              {category}
            </Chip>
          ))}
        </div>
        <FieldError>{errors.category}</FieldError>
      </div>
    </div>
  );
}