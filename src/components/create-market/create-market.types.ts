import { CATEGORIES } from "@/constants";
import type { MarketCategory } from "@/types";

export type MarketType = "BINARY" | "MULTI";

export const MIN_STARTING_PROBABILITY = 5;
export const MAX_STARTING_PROBABILITY = 95;

export interface CreateMarketDraft {
  question: string;
  category: string;
  marketType: MarketType;
  probability: number;
  outcomes: string[];
  description: string;
  image?: string;
  imageName?: string;
  tags: string[];
  resolutionCriteria: string;
  sourceUrl: string;
  closesAt: string;
  timezone: string;
  earlyResolution: boolean;
  earlyResolutionCriteria: string;
  updatedAt?: number;
}

export const MAX_QUESTION_LENGTH = 160;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_OUTCOMES = 5;
export const MAX_TAGS = 8;
export const MAX_IMAGE_BYTES = 1_500_000;

export const STEP_LABELS = [
  "Question",
  "Details",
  "Resolution",
  "Review & Publish",
] as const;

export const TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
] as const;

const DRAFT_KEY = "omx-market-draft";

export function addDaysLocalIso(days: number): string {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const EMPTY_DRAFT: CreateMarketDraft = {
  question: "",
  category: "",
  marketType: "BINARY",
  probability: 50,
  outcomes: ["YES", "NO"],
  description: "",
  tags: [],
  resolutionCriteria: "",
  sourceUrl: "",
  closesAt: addDaysLocalIso(30),
  timezone: "UTC",
  earlyResolution: false,
  earlyResolutionCriteria: "",
};

export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateQuestionStep(
  draft: CreateMarketDraft
): Record<string, string> {
  const errors: Record<string, string> = {};
  const q = draft.question.trim();
  if (!q) {
    errors.question = "Enter your market question";
  } else if (q.length < 10) {
    errors.question = "Use at least 10 characters";
  } else if (q.length > MAX_QUESTION_LENGTH) {
    errors.question = `Keep it under ${MAX_QUESTION_LENGTH} characters`;
  }
if (!draft.category) {
      errors.category = "Pick a category";
    }
    if (draft.marketType === "BINARY") {
      if (!draft.probability) {
        errors.probability = "Pick a starting probability";
      } else if (
        draft.probability < MIN_STARTING_PROBABILITY ||
        draft.probability > MAX_STARTING_PROBABILITY
      ) {
        errors.probability = `Use a value between ${MIN_STARTING_PROBABILITY} and ${MAX_STARTING_PROBABILITY}`;
      }
    }
    if (draft.marketType === "MULTI") {
    const filled = draft.outcomes.filter((o) => o.trim());
    if (filled.length < 2) {
      errors.outcomes = "Add at least 2 outcomes";
    } else if (draft.outcomes.some((o) => !o.trim())) {
      errors.outcomes = "Every outcome needs a label";
    }
  }
  return errors;
}

export function validateDetailsStep(
  draft: CreateMarketDraft
): Record<string, string> {
  const errors: Record<string, string> = {};
  const desc = draft.description.trim();
  if (!desc) {
    errors.description = "Describe what this market is about";
  } else if (desc.length < 20) {
    errors.description = "Use at least 20 characters";
  } else if (desc.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Keep it under ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return errors;
}

export function validateResolutionStep(
  draft: CreateMarketDraft
): Record<string, string> {
  const errors: Record<string, string> = {};
  const criteria = draft.resolutionCriteria.trim();
  if (!criteria) {
    errors.resolutionCriteria = "Explain how this market will be resolved";
  } else if (criteria.length < 20) {
    errors.resolutionCriteria = "Use at least 20 characters";
  }
  if (draft.sourceUrl.trim() && !isValidUrl(draft.sourceUrl.trim())) {
    errors.sourceUrl = "Enter a valid URL (https://\u2026)";
  }
  if (!draft.closesAt) {
    errors.closesAt = "Pick a closing date and time";
  } else if (new Date(draft.closesAt).getTime() <= Date.now()) {
    errors.closesAt = "The closing date must be in the future";
  }
  if (draft.earlyResolution && !draft.earlyResolutionCriteria.trim()) {
    errors.earlyResolutionCriteria =
      "Describe the conditions that would trigger early resolution";
  }
  return errors;
}

export interface QualityCheck {
  label: string;
  done: boolean;
}

export interface QualityResult {
  score: number;
  label: string;
  tone: "success" | "orange" | "danger";
  checks: QualityCheck[];
}

export function computeMarketQuality(draft: CreateMarketDraft): QualityResult {
  const checks: QualityCheck[] = [
    { label: "Clear, complete question", done: draft.question.trim().length >= 15 },
    { label: "Category selected", done: Boolean(draft.category) },
    { label: "Informative description", done: draft.description.trim().length >= 60 },
    { label: "Detailed resolution criteria", done: draft.resolutionCriteria.trim().length >= 30 },
    { label: "Source link provided", done: isValidUrl(draft.sourceUrl.trim()) },
    { label: "At least 3 tags", done: draft.tags.length >= 3 },
    {
      label: "Closing date in the future",
      done: draft.closesAt ? new Date(draft.closesAt).getTime() > Date.now() : false,
    },
  ];
  const score = Math.round(
    (checks.filter((c) => c.done).length / checks.length) * 100
  );
  const label =
    score >= 90 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Needs work";
  const tone = score >= 70 ? "success" : score >= 50 ? "orange" : "danger";
  return { score, label, tone, checks };
}

export function improveQuestion(question: string): string {
  const cleaned = question.trim().replace(/[!?.]+$/, "").replace(/\s+/g, " ");
  if (!cleaned) return "";
  const capped = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  const prefixed = /^Will\b/i.test(capped) ? capped : `Will ${capped}`;
  return `${prefixed}?`;
}

export function isMarketCategory(value: string): value is MarketCategory {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function loadDraft(): CreateMarketDraft {
  if (typeof window === "undefined") return { ...EMPTY_DRAFT };
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return { ...EMPTY_DRAFT };
    const parsed = JSON.parse(raw) as Partial<CreateMarketDraft>;
    return {
      ...EMPTY_DRAFT,
      ...parsed,
      probability:
        typeof parsed.probability === "number"
          ? Math.min(
              MAX_STARTING_PROBABILITY,
              Math.max(MIN_STARTING_PROBABILITY, Math.round(parsed.probability))
            )
          : EMPTY_DRAFT.probability,
      outcomes:
        Array.isArray(parsed.outcomes) && parsed.outcomes.length > 0
          ? parsed.outcomes.slice(0, MAX_OUTCOMES)
          : [...EMPTY_DRAFT.outcomes],
    };
  } catch {
    return { ...EMPTY_DRAFT };
  }
}

export function persistDraft(draft: CreateMarketDraft): number {
  const savedAt = Date.now();
  if (typeof window === "undefined") return savedAt;
  try {
    window.localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...draft, updatedAt: savedAt })
    );
  } catch {
    return 0;
  }
  return savedAt;
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    return;
  }
}

export function formatClosesAt(closesAt: string, timezone: string): string {
  if (!closesAt) return "\u2014";
  const date = new Date(closesAt);
  if (Number.isNaN(date.getTime())) return closesAt;
  try {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(date);
  } catch {
    return closesAt;
  }
}

export function marketShareUrl(marketId: string): string {
  return `https://omnimarketx.example.com/markets/${marketId}`;
}

export function savedAtLabel(savedAt: number | null): string {
  if (!savedAt) return "Not saved yet";
  return new Date(savedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}