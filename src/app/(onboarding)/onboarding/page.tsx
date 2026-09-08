"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Crown,
  Gift,
  Rocket,
  Sparkles,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { OnboardingPlanStep } from "@/components/onboarding/onboarding-plan-step";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { Button } from "@/components/ui/button";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";
import { CATEGORIES } from "@/constants";
import { getBillingDetails } from "@/constants/pricing";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useUserStore } from "@/store/user-store";
import { cn } from "@/lib/utils";

const STEPS = ["Welcome", "Profile", "Interests", "Plan", "Complete"];
const PLAN_STEP_INDEX = 3;

function OnboardingWizard() {
  const params = useSearchParams();
  const router = useRouter();

  const [step, setStep] = useState(() =>
    params.get("step") === "plan" ? PLAN_STEP_INDEX : 0
  );

  const displayNameSaved = useOnboardingStore((state) => state.displayName);
  const usernameSaved = useOnboardingStore((state) => state.username);
  const emailSaved = useOnboardingStore((state) => state.email);
  const interests = useOnboardingStore((state) => state.interests);
  const plan = useOnboardingStore((state) => state.plan);
  const billingCycle = useOnboardingStore((state) => state.billingCycle);
  const setProfile = useOnboardingStore((state) => state.setProfile);
  const toggleInterest = useOnboardingStore((state) => state.toggleInterest);
  const complete = useOnboardingStore((state) => state.complete);
  const setUserProfile = useUserStore((state) => state.setProfile);
  const userProfile = useUserStore((state) => ({
    displayName: state.displayName,
    username: state.username,
    email: state.email,
  }));

  const [displayName, setDisplayName] = useState(
    displayNameSaved || userProfile.displayName
  );
  const [username, setUsername] = useState(
    usernameSaved || userProfile.username
  );
  const [email, setEmail] = useState(emailSaved || userProfile.email);
  const [formErrors, setFormErrors] = useState<{
    displayName?: string;
    username?: string;
    email?: string;
  }>({});
  const [touched, setTouched] = useState(false);

  const goNext = () => setStep((value) => Math.min(value + 1, STEPS.length - 1));
  const goBack = () => setStep((value) => Math.max(value - 1, 0));
  const goComplete = () => {
    complete();
    goNext();
  };

  const saveProfile = () => {
    setTouched(true);
    const errors: typeof formErrors = {};
    if (displayName.trim().length < 2)
      errors.displayName = "Display name must be at least 2 characters";
    if (!/^[a-z0-9_]{3,}$/.test(username.trim()))
      errors.username = "Lowercase letters, numbers and underscores only (3+)";
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      errors.email = "Enter a valid email address";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const profile = {
      displayName: displayName.trim(),
      username: username.trim(),
      email: email.trim(),
    };
    setProfile(profile);
    setUserProfile(profile);
    goNext();
  };

  const details = getBillingDetails(plan, billingCycle);
  const isPro = plan === "PRO";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <OnboardingProgress steps={STEPS} current={step} />

        <div className="rounded-[20px] border border-border bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8">
          {step === 0 && (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-brand text-white shadow-md">
                <Rocket className="h-7 w-7" />
              </span>
              <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                Welcome to OmniMarketX
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                Trade on what you know across sports, crypto, politics and more.
                You&rsquo;re seconds away from your first trade.
              </p>
              <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2">
                {[
                  { icon: <Wallet className="h-4 w-4" />, label: "$10,000 demo wallet" },
                  { icon: <Sparkles className="h-4 w-4" />, label: "Every feature unlocked" },
                  { icon: <Gift className="h-4 w-4" />, label: "2-minute setup" },
                ].map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center justify-center gap-2 rounded-[12px] border border-border bg-background px-4 py-2.5 text-sm font-semibold text-text-primary"
                  >
                    <span className="text-primary">{chip.icon}</span>
                    {chip.label}
                  </span>
                ))}
              </div>
              <Button
                size="lg"
                className="mt-7 w-full"
                onClick={goNext}
                aria-label="Get started"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-sm text-text-secondary">
                Already have an account?
                <Link
                  href="/login"
                  className="ml-1.5 font-semibold text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          )}

          {step === 1 && (
            <div>
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Tell us about you
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                  A few details to personalize your profile and leaderboard
                  identity.
                </p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="Alex River"
                    invalid={touched && Boolean(formErrors.displayName)}
                  />
                  <FieldError>{touched ? formErrors.displayName : ""}</FieldError>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="alexriver"
                      invalid={touched && Boolean(formErrors.username)}
                    />
                    <FieldError>{touched ? formErrors.username : ""}</FieldError>
                  </div>
                  <div>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      invalid={touched && Boolean(formErrors.email)}
                    />
                    <FieldError>{touched ? formErrors.email : ""}</FieldError>
                  </div>
                </div>
              </div>
              <Button
                className="mt-7 h-11 w-full"
                onClick={saveProfile}
                aria-label="Continue"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-text-primary">
                  Pick your interests
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-text-secondary">
                  Choose a few topics and we&rsquo;ll tune your feed. You can
                  change this anytime.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORIES.map((category) => {
                  const active = interests.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleInterest(category)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center justify-center gap-1.5 rounded-[12px] border px-3 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        active
                          ? "border-primary bg-primary-light text-primary"
                          : "border-border bg-background text-text-secondary hover:text-text-primary"
                      )}
                    >
                      {active && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      {category}
                    </button>
                  );
                })}
              </div>
              <Button
                className="mt-7 h-11 w-full"
                onClick={goNext}
                aria-label="Continue"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {step === PLAN_STEP_INDEX && <OnboardingPlanStep onComplete={goComplete} />}

          {step === 4 && (
            <div className="text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-white shadow-md">
                <Check className="h-8 w-8" strokeWidth={3} />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                You&rsquo;re all set
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-text-secondary">
                Your demo account is ready. Here&rsquo;s your setup at a glance.
              </p>

              <div className="mx-auto mt-6 max-w-sm rounded-[16px] border border-border bg-background p-5 text-left">
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-secondary">Profile</dt>
                    <dd className="font-semibold text-text-primary">
                      {displayNameSaved || displayName}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-secondary">Interests</dt>
                    <dd className="font-semibold text-text-primary">
                      {interests.length > 0
                        ? `${interests.length} selected`
                        : "All categories"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-secondary">Plan</dt>
                    <dd className="flex max-w-[60%] flex-wrap items-center justify-end gap-1.5 font-semibold text-text-primary">
                      {isPro && (
                        <Crown className="h-4 w-4 text-primary" />
                      )}
                      {isPro ? "OmniMarketX Pro" : "Free plan"}
                      <span className="text-xs font-medium text-text-muted">
                        — {details.perMonth > 0 ? `$${details.perMonth.toFixed(2)}/mo` : "$0"}
                        {details.billingNote && details.period === "YEARLY"
                          ? " · billed yearly"
                          : ""}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <Button
                size="lg"
                className="mt-7 w-full"
                onClick={() => router.replace("/home")}
                aria-label="Start trading"
              >
                Start trading
                <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-4 text-xs text-text-muted">
                Plan can be changed anytime.
                <Link
                  href="/pricing"
                  className="ml-1 font-semibold text-primary hover:underline"
                >
                  See all plans
                </Link>
              </p>
            </div>
          )}
        </div>

        {step > 0 && step < STEPS.length - 1 && (
          <div className="mt-5 flex justify-center">
            <Button
              variant="ghost"
              onClick={goBack}
              aria-label="Go back"
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense>
      <OnboardingWizard />
    </Suspense>
  );
}