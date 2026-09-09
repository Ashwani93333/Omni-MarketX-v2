"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Rocket,
  Save,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";
import type { Market } from "@/types";

import {
  addDaysLocalIso,
  clearDraft,
  EMPTY_DRAFT,
  formatClosesAt,
  isMarketCategory,
  loadDraft,
  marketShareUrl,
  persistDraft,
  savedAtLabel,
  STEP_LABELS,
  validateDetailsStep,
  validateQuestionStep,
  validateResolutionStep,
  type CreateMarketDraft,
} from "./create-market.types";
import { DetailsStep } from "./details-step";
import { MarketQualityScore } from "./market-quality-score";
import { QuestionStep } from "./question-step";
import { ResolutionStep } from "./resolution-step";
import { ReviewStep } from "./review-step";

export function CreateMarketWizard() {
  const router = useRouter();
  const [draft, setDraft] = useState<CreateMarketDraft>(() => loadDraft());
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [published, setPublished] = useState<Market | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSavedAt(persistDraft(draft));
    }, 600);
    return () => window.clearTimeout(timer);
  }, [draft]);

  const update = (patch: Partial<CreateMarketDraft>) =>
    setDraft((d) => ({ ...d, ...patch }));

  const saveNow = () => {
    const at = persistDraft(draft);
    setSavedAt(at);
    if (at === 0) {
      toast.error("Could not save draft");
    } else {
      toast.success("Draft saved");
    }
  };

  const discardDraft = () => {
    clearDraft();
    setDraft({
      ...EMPTY_DRAFT,
      closesAt: addDaysLocalIso(30),
      timezone: draft.timezone,
    });
    setStep(0);
    setErrors({});
    setSavedAt(null);
    toast.success("Draft discarded");
  };

  const handleNext = () => {
    const nextErrors =
      step === 0
        ? validateQuestionStep(draft)
        : step === 1
          ? validateDetailsStep(draft)
          : validateResolutionStep(draft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Some fields need your attention");
      return;
    }
    setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
  };

  const handlePublish = async () => {
    if (!isMarketCategory(draft.category)) {
      setPublishError("Pick a category before publishing");
      return;
    }
    setSubmitting(true);
    setPublishError(null);
    try {
      const market = await marketService.createMarket({
        title: draft.question.trim(),
        category: draft.category,
        description: draft.description.trim(),
        resolutionCriteria: draft.resolutionCriteria.trim(),
        closesAt: new Date(draft.closesAt).toISOString(),
        probability: draft.probability,
        marketType: draft.marketType,
        outcomeLabels:
          draft.marketType === "MULTI"
            ? draft.outcomes.map((o) => o.trim()).filter(Boolean)
            : undefined,
        image: draft.image,
        tags: draft.tags.length > 0 ? draft.tags : undefined,
        sourceUrl: draft.sourceUrl.trim() || undefined,
        earlyResolution: draft.earlyResolution || undefined,
        timezone: draft.timezone,
      });
      clearDraft();
      setConfirmOpen(false);
      setSavedAt(null);
      setPublished(market);
      toast.success("Market published", {
        description: "Your market is now live on OmniMarketX.",
      });
    } catch (err) {
      setPublishError(
        err instanceof Error ? err.message : "Something went wrong while publishing"
      );
      toast.error("Publish failed", { description: "Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const copyMarketLink = async (market: Market) => {
    try {
      await navigator.clipboard.writeText(marketShareUrl(market.id));
    } catch {
      return;
    }
    setCopied(true);
    toast.success("Market link copied");
    window.setTimeout(() => setCopied(false), 2000);
  };

  const resetWizard = () => {
    clearDraft();
    setPublished(null);
    setStep(0);
    setErrors({});
    setSavedAt(null);
    setDraft({
      ...EMPTY_DRAFT,
      closesAt: addDaysLocalIso(30),
      timezone: draft.timezone,
    });
  };

  if (published) {
    const shareText = encodeURIComponent(
      `"${published.title}" — trade it on OmniMarketX`
    );
    const xIntent = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(
      marketShareUrl(published.id)
    )}`;

    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-10">
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-light">
            <Check className="h-7 w-7 text-success" strokeWidth={3} />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-text-primary">
            Market published!
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Your market is live and ready for traders.
          </p>
        </div>

        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Market
              </p>
              <h3 className="mt-1 text-lg font-bold leading-snug text-text-primary">
                {published.title}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{published.category}</Badge>
              <Badge className="bg-primary-light text-primary">Community</Badge>
              {published.closesAt ? (
                <Badge variant="blue">
                  Closes {formatClosesAt(published.closesAt, "UTC")}
                </Badge>
              ) : null}
            </div>
            <div className="rounded-[12px] border border-dashed border-border bg-background p-3">
              <p className="truncate text-xs text-text-muted">
                {marketShareUrl(published.id)}
              </p>
            </div>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => router.push(`/markets/${published.id}`)}
              >
                <ExternalLink />
                View Market
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => copyMarketLink(published)}>
                  {copied ? <Check /> : <Copy />}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <a
                  href={xIntent}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }), "h-10")}
                >
                  <Share2 />
                  Share on X
                </a>
              </div>
              <Button variant="ghost" className="w-full" onClick={resetWizard}>
                <Sparkles />
                Create another market
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        eyebrow="Launch"
        title="Create a Market"
        description="Publish your own prediction market in four quick steps. Your draft auto-saves as you go."
      />

      <OnboardingProgress steps={[...STEP_LABELS]} current={step} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <Card>
            <CardContent className="p-5 sm:p-6">
              {step === 0 ? (
                <QuestionStep draft={draft} errors={errors} update={update} />
              ) : step === 1 ? (
                <DetailsStep draft={draft} errors={errors} update={update} />
              ) : step === 2 ? (
                <ResolutionStep draft={draft} errors={errors} update={update} />
              ) : (
                <ReviewStep draft={draft} />
              )}
            </CardContent>
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step > 0 ? (
              <Button variant="ghost" onClick={handleBack}>
                <ArrowLeft />
                Back
              </Button>
            ) : (
              <span />
            )}
            {step < STEP_LABELS.length - 1 ? (
              <Button onClick={handleNext}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => {
                  setPublishError(null);
                  setConfirmOpen(true);
                }}
              >
                <Rocket />
                Publish Market
              </Button>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[14px] border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-text-primary">
                <Save className="h-4 w-4 text-primary" />
                Auto-save
              </h3>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                On
              </span>
            </div>
            <p className="mt-1.5 text-xs text-text-muted">
              Draft saved at {savedAtLabel(savedAt)}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={saveNow}>
                <Save />
                Save draft
              </Button>
              <Button variant="ghost" size="sm" onClick={discardDraft}>
                <Trash2 />
                Discard
              </Button>
            </div>
          </div>

          <MarketQualityScore draft={draft} />
        </aside>
      </div>

      <Modal open={confirmOpen} onOpenChange={setConfirmOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Publish this market?</ModalTitle>
            <ModalDescription>
              Your market will go live immediately and be visible to every
              trader on OmniMarketX.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-2 rounded-[12px] border border-border bg-background p-4 text-sm">
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-text-muted">Question</span>
              <span className="text-right font-semibold text-text-primary">
                {draft.question || "\u2014"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-text-muted">Category</span>
              <span className="text-right font-semibold text-text-primary">
                {draft.category || "\u2014"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-text-muted">Type</span>
              <span className="text-right font-semibold text-text-primary">
                {draft.marketType === "MULTI" ? "Multiple choice" : "Yes / No"}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="shrink-0 text-text-muted">Closing</span>
              <span className="text-right font-semibold text-text-primary">
                {formatClosesAt(draft.closesAt, draft.timezone)}
              </span>
            </div>
          </div>
          {publishError ? (
            <p className="text-sm font-medium text-danger" role="alert">
              {publishError}
            </p>
          ) : null}
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="secondary">Cancel</Button>
            </ModalClose>
            <Button variant="success" loading={submitting} onClick={handlePublish}>
              <Rocket />
              Publish now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}