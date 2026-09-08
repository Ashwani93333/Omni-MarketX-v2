"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Crown, LogOut } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/layout/page-header";
import { PlanSelector } from "@/components/pricing/plan-selector";
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
  FieldError,
  FieldLabel,
  Input,
  InputHint,
  Textarea,
} from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { getBillingDetails } from "@/constants/pricing";
import { useAppStore } from "@/store/app-store";
import { useOnboardingStore } from "@/store/onboarding-store";
import { useTradingStore } from "@/store/trading-store";
import { useUserStore } from "@/store/user-store";

const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers and underscores only"),
  email: z.string().email("Enter a valid email address"),
  bio: z.string().max(160, "Bio must be under 160 characters").optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const themeOptions = ["light", "dark"] as const;

const modeOptions = ["DEMO", "REAL"] as const;

export default function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const tradingMode = useAppStore((s) => s.tradingMode);
  const setTradingMode = useAppStore((s) => s.setTradingMode);
  const resetDemo = useTradingStore((s) => s.resetDemo);
  const plan = useOnboardingStore((s) => s.plan);
  const billingCycle = useOnboardingStore((s) => s.billingCycle);
  const [notify, setNotify] = useState({
    trades: true,
    movement: true,
    digest: false,
  });
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const billingDetails = getBillingDetails(plan, billingCycle);
  const profile = useUserStore((s) => ({
    displayName: s.displayName,
    username: s.username,
    email: s.email,
    bio: s.bio,
    initials: s.initials,
  }));
  const setProfile = useUserStore((s) => s.setProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      username: profile.username,
      email: profile.email,
      bio: profile.bio || "Trader. Learner. Occasionally early.",
    },
  });

  const onSave = (values: ProfileForm) => {
    setProfile({
      displayName: values.displayName,
      username: values.username,
      email: values.email,
      bio: values.bio,
    });
    toast.success("Profile updated", {
      description: "Your changes are now live.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your profile, preferences and account."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription>
                How you appear to the community.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar
                  size="xl"
                  initials={profile.initials}
                  alt={profile.displayName}
                />
                <div>
                  <input
                    ref={avatarRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setAvatarLoading(true);
                      setTimeout(() => {
                        setAvatarLoading(false);
                        toast.success("Avatar updated", {
                          description: file.name,
                        });
                      }, 700);
                      e.target.value = "";
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    loading={avatarLoading}
                    onClick={() => avatarRef.current?.click()}
                  >
                    Change Avatar
                  </Button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSave)}
                className="mt-6 space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                    <Input
                      id="displayName"
                      {...register("displayName")}
                      invalid={Boolean(errors.displayName)}
                    />
                    <FieldError>{errors.displayName?.message}</FieldError>
                  </div>
                  <div>
                    <FieldLabel htmlFor="username">Username</FieldLabel>
                    <Input
                      id="username"
                      {...register("username")}
                      invalid={Boolean(errors.username)}
                    />
                    <FieldError>{errors.username?.message}</FieldError>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    invalid={Boolean(errors.email)}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell the community about yourself"
                    {...register("bio")}
                  />
                  <InputHint>160 characters max</InputHint>
                  <FieldError>{errors.bio?.message}</FieldError>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card id="plan" className="scroll-mt-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Crown className="h-4 w-4 text-primary" />
                Plan & Billing
              </CardTitle>
              <CardDescription>
                Choose your plan or switch between monthly and yearly billing.
                Changes apply instantly in this demo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 flex flex-wrap items-center gap-2 rounded-[14px] border border-border bg-background px-4 py-3 text-sm">
                <span className="text-xs font-bold uppercase tracking-wide text-text-muted">
                  Current plan
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 font-bold text-text-primary">
                  {plan === "PRO" && <Crown className="h-4 w-4 text-primary" />}
                  {plan === "PRO" ? "OmniMarketX Pro" : "Free"}
                  <span className="text-xs font-medium text-text-muted">
                    {plan === "PRO"
                      ? `— $${billingDetails.perMonth.toFixed(2)}/mo · ${billingCycle.toLowerCase()}`
                      : "— $0 · forever"}
                  </span>
                </span>
              </div>
              <PlanSelector
                onPlanChosen={(chosen) => {
                  if (chosen === "PRO") {
                    toast.success("Welcome to Pro!", {
                      description: "Demo Pro is now active on your account.",
                    });
                  } else {
                    toast.success("You're on the Free plan", {
                      description: "Upgrade to Pro anytime you like.",
                    });
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
              <CardDescription>Customize your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Appearance
                  </p>
                  <p className="text-sm text-text-muted">
                    Choose between light and dark themes.
                  </p>
                </div>
                <SegmentedControl
                  value={theme}
                  options={themeOptions}
                  onChange={setTheme}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Trading Mode
                  </p>
                  <p className="text-sm text-text-muted">
                    Trade with virtual funds or connect a live wallet.
                  </p>
                </div>
                <SegmentedControl
                  value={tradingMode}
                  options={modeOptions}
                  onChange={setTradingMode}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Trade notifications
                    </p>
                    <p className="text-sm text-text-muted">
                      Alerts when your orders fill.
                    </p>
                  </div>
                  <Switch
                    checked={notify.trades}
                    onCheckedChange={(v) =>
                      setNotify((p) => ({ ...p, trades: v }))
                    }
                    aria-label="Trade notifications"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Market movement alerts
                    </p>
                    <p className="text-sm text-text-muted">
                      Notify me on big probability swings.
                    </p>
                  </div>
                  <Switch
                    checked={notify.movement}
                    onCheckedChange={(v) =>
                      setNotify((p) => ({ ...p, movement: v }))
                    }
                    aria-label="Market movement alerts"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      Community digest
                    </p>
                    <p className="text-sm text-text-muted">
                      Weekly email with top markets.
                    </p>
                  </div>
                  <Switch
                    checked={notify.digest}
                    onCheckedChange={(v) =>
                      setNotify((p) => ({ ...p, digest: v }))
                    }
                    aria-label="Community digest"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="min-w-0 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Connected Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Member since</span>
                <span className="font-semibold text-text-primary">
                  Jan 12, 2026
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Account type</span>
                <span className="inline-flex items-center gap-1.5 font-semibold text-text-primary">
                  {plan === "PRO" && <Crown className="h-3.5 w-3.5 text-primary" />}
                  {plan === "PRO" ? "Pro" : "Free"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Email verified</span>
                <span className="font-semibold text-success">Yes</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-danger/30">
            <CardHeader>
              <CardTitle className="text-lg text-danger">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setConfirmingReset(true)}
              >
                Reset Demo Account
              </Button>
              <Button
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => toast.success("Signed out (demo)")}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-text-secondary">
                Questions about your account or trading?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => toast.info("Support ticket opened (demo)")}
              >
                Contact Support
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => toast.info("Opening documentation (demo)")}
              >
                Read the Documentation
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Modal open={confirmingReset} onOpenChange={setConfirmingReset}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Reset demo account?</ModalTitle>
            <ModalDescription>
              This will clear all virtual trades and restore your balance to
              $10,000. This cannot be undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setConfirmingReset(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetDemo();
                setConfirmingReset(false);
                toast.success("Demo account reset", {
                  description: "Virtual balance restored to $10,000.",
                });
              }}
            >
              Reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}