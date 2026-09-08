"use client";

import { Check, Copy, Gift, QrCode, Rocket, Share2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
import { StatCard } from "@/components/ui/stat-card";
import { MOCK_CURRENT_USER } from "@/constants";

const REFERRAL_CODE = "OMX-ALEXR-2026";
const REFERRAL_LINK = "https://omnimarketx.example.com/?ref=ALEXR";

const recentInvites = [
  {
    id: "inv-001",
    name: "Mia Crypto",
    initials: "MC",
    date: "Sep 4, 2026",
    reward: 25,
  },
  {
    id: "inv-002",
    name: "Kaden Sterling",
    initials: "KS",
    date: "Sep 1, 2026",
    reward: 25,
  },
  {
    id: "inv-003",
    name: "Nova Hodl",
    initials: "NH",
    date: "Aug 28, 2026",
    reward: 10,
  },
];

export default function InvitePage() {
  const [copied, setCopied] = useState(false);

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
          value="4"
          accent="primary"
        />
        <StatCard
          icon={<Gift className="h-5 w-5" />}
          label="Rewards Earned"
          value="$85.00"
          accent="success"
        />
        <StatCard
          icon={<Gift className="h-5 w-5" />}
          label="Pending Bonuses"
          value="$50.00"
          accent="orange"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Link</CardTitle>
          <CardDescription>
            Earn $25 USDC for every friend who deposits and places their first
            trade.
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
                onClick={() => toast("QR code", { description: "Scan to invite friends." })}
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
                  text: "$25 USDC is credited to your wallet automatically.",
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

        <Card className="border-primary/30 bg-gradient-to-br from-primary-light/40 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Rocket className="h-4 w-4 text-primary" />
              Upgrade to Pro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-text-secondary">
              Unlock 2x referral rewards, priority support, and advanced market
              analytics when you upgrade to Pro.
            </p>
            <Button className="w-full" onClick={() => toast.info("Upgrade flow coming soon")}>
              Upgrade to Pro
            </Button>
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
            {recentInvites.map((invite) => (
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
                <span className="number-tight rounded-md bg-success-light px-2 py-0.5 text-xs font-bold text-success">
                  +${invite.reward}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[12px] bg-background px-4 py-3 text-xs text-text-secondary">
            Last rewarded on {MOCK_CURRENT_USER.memberSince} · Unclaimed rewards
            auto-deposit each Friday.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}