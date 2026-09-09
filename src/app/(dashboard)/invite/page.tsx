"use client";

import {
  Check,
  Copy,
  Gift,
  Lock,
  QrCode,
  Rocket,
  Share2,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ReferralQr } from "@/components/invite/referral-qr";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useOnboardingStore } from "@/store/onboarding-store";
import {
  REFERRAL_BASE_REWARD,
  REWARD_MILESTONES,
  referralTotals,
  useReferralStore,
} from "@/store/referral-store";

const REFERRAL_CODE = "OMX-ALEXR-2026";
const REFERRAL_LINK = "https://omnimarketx.example.com/?ref=ALEXR";

export default function InvitePage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const pro = useOnboardingStore((s) => s.plan === "PRO");
  const invites = useReferralStore((s) => s.invites);

  const { friends, earned, pending } = referralTotals(invites);
  const perFriend = pro ? REFERRAL_BASE_REWARD * 2 : REFERRAL_BASE_REWARD;

  const nextMilestone = REWARD_MILESTONES.find((m) => friends < m.friends);
  const progress = nextMilestone
    ? (friends / nextMilestone.friends) * 100
    : 100;
  const nextReward = (nextMilestone?.reward ?? 0) * (pro ? 2 : 1);
  const latestActivity =
    invites.find((i) => i.status === "paid")?.date ?? "recently";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Earn"
        title="Invite Friends"
        description="Share the link, earn rewards when friends start trading."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<Users className="h-5 w-5" />}
          label="Friends Invited"
          value={String(friends)}
          accent="primary"
        />
        <StatCard
          icon={<Gift className="h-5 w-5" />}
          label="Rewards Earned"
          value={formatCurrency(earned)}
          accent="success"
        />
        <StatCard
          icon={<QrCode className="h-5 w-5" />}
          label="Pending Bonuses"
          value={formatCurrency(pending)}
          accent="orange"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-4 w-4 text-orange" />
            Reward Ladder
          </CardTitle>
          <CardDescription>
            Hit invite milestones to unlock bonus payouts — on top of your ${perFriend} per friend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {REWARD_MILESTONES.map((milestone) => {
              const unlocked = friends >= milestone.friends;
              const isNext = nextMilestone?.friends === milestone.friends;
              const value = milestone.reward * (pro ? 2 : 1);
              return (
                <li
                  key={milestone.friends}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-[12px] border p-3.5",
                    unlocked
                      ? "border-success/30 bg-success-light/40"
                      : isNext
                        ? "border-primary/40 bg-primary-light/20"
                        : "border-border bg-background"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full",
                        unlocked
                          ? "bg-success text-white"
                          : isNext
                            ? "bg-primary text-white"
                            : "bg-surface text-text-muted"
                      )}
                    >
                      {unlocked ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Lock className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <span className="number-tight text-sm font-extrabold text-text-primary">
                      +${value}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">
                    {milestone.label}
                  </p>
                  <p className="text-xs text-text-muted">
                    {milestone.friends} friend{milestone.friends === 1 ? "" : "s"} invited
                    {pro ? " · 2x" : ""}
                  </p>
                </li>
              );
            })}
          </ol>

          <div className="mt-5">
            <div className="mb-1.5 flex items-center justify-between text-xs text-text-muted">
              <span>
                {nextMilestone
                  ? `${friends} of ${nextMilestone.friends} friends toward +$${nextReward}`
                  : "All milestones unlocked — legendary."}
              </span>
              <span className="font-bold">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} tone={pro ? "primary" : "orange"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Link</CardTitle>
          <CardDescription>
            Earn ${perFriend} USDC for every friend who deposits and places
            their first trade. {pro ? "Pro 2x multiplier active." : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center justify-between gap-3 rounded-[12px] border border-border bg-background px-4 py-3">
              <span className="truncate text-sm font-semibold text-text-primary">
                {REFERRAL_LINK}
              </span>
              <span className="hidden shrink-0 rounded-md bg-primary-light px-2 py-0.5 text-xs font-bold text-primary sm:block">
                {REFERRAL_CODE}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={copyLink}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                variant="outline"
                aria-label="Show QR code"
                title="Show QR code"
                onClick={() => setQrOpen(true)}
              >
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Share</CardTitle>
          <CardDescription>
            Spread the word and earn rewards for every friend who trades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button
              variant="outline"
              className="justify-center"
              onClick={() => {
                const url = `https://wa.me/?text=${encodeURIComponent(`Join me on OmniMarketX — ${REFERRAL_LINK}`)}`;
                if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="justify-center"
              onClick={() => {
                const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Join me on OmniMarketX — ${REFERRAL_LINK}`)}`;
                if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              X
            </Button>
            <Button
              variant="outline"
              className="justify-center"
              onClick={() => {
                const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(REFERRAL_LINK)}`;
                if (typeof window !== "undefined") window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              LinkedIn
            </Button>
            <Button
              variant="outline"
              className="justify-center"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  navigator.share({ title: "Join me on OmniMarketX", text: REFERRAL_LINK });
                } else {
                  copyLink();
                }
              }}
            >
              <Share2 className="h-4 w-4" />
              More
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {[
                {
                  step: "They Sign Up",
                  text: "Your friend creates an account using your invite link.",
                },
                {
                  step: "They Trade",
                  text: "They place their first trade on any market.",
                },
                {
                  step: "You Earn",
                  text: `$${perFriend} USDC is credited to your wallet automatically.`,
                },
              ].map((item, i) => (
                <li key={item.step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-extrabold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {item.step}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-primary/30 bg-gradient-to-br from-primary-light/40 to-transparent",
            pro && "border-success/30 from-success-light/40 to-transparent"
          )}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Rocket className={cn("h-4 w-4", pro ? "text-success" : "text-primary")} />
              {pro ? "Pro is Active" : "Upgrade to Pro"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-text-secondary">
              Unlock 2x referral rewards, priority support, and advanced market
              analytics. {pro ? "Every new referral now pays $50 instead of $25." : ""}
            </p>
            {pro ? (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push("/settings#plan")}
              >
                Manage Plan
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => router.push("/settings#plan")}
              >
                Upgrade to Pro
              </Button>
            )}
            <p className="text-xs text-text-muted">
              14-day free trial · No card required
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Invites</CardTitle>
          <CardDescription>Friends who joined using your link.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="flex items-center gap-3 rounded-[12px] px-2 py-2.5 transition-colors hover:bg-background"
              >
                <Avatar size="sm" initials={invite.initials} alt={invite.name} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {invite.name}
                  </p>
                  <p className="text-xs text-text-muted">Joined {invite.date}</p>
                </div>
                <span
                  className={cn(
                    "number-tight rounded-md px-2 py-0.5 text-xs font-bold",
                    invite.status === "paid"
                      ? "bg-success-light text-success"
                      : "bg-orange/10 text-orange"
                  )}
                >
                  {invite.status === "paid" ? "+$" : "~$"}
                  {invite.reward}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[12px] bg-background px-4 py-3 text-xs text-text-secondary">
            Last rewarded {latestActivity} · Unclaimed rewards auto-deposit each
            Friday.
          </p>
        </CardContent>
      </Card>

      <Modal open={qrOpen} onOpenChange={setQrOpen}>
        <ModalContent className="max-w-sm sm:max-w-sm">
          <ModalHeader>
            <ModalTitle>Scan to invite</ModalTitle>
            <ModalDescription>
              Share this code or the link below with a friend.
            </ModalDescription>
          </ModalHeader>
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="rounded-[14px] border border-border bg-background p-3">
              <ReferralQr value={REFERRAL_LINK} />
            </div>
            <p className="number-tight text-sm font-bold text-text-primary">
              {REFERRAL_CODE}
            </p>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
          <ModalClose asChild>
            <Button variant="ghost" className="w-full">
              Close
            </Button>
          </ModalClose>
        </ModalContent>
      </Modal>
    </div>
  );
}