import type { Metadata } from "next";

import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Access your OmniMarketX dashboard.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RedirectIfAuthenticated>
      <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-4 py-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary-light/50 to-transparent"
        />
        <Logo className="relative mb-8" />
        <div className="relative w-full max-w-md">{children}</div>
      </div>
    </RedirectIfAuthenticated>
  );
}