"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AuthCard({
  title,
  subtitle,
  children,
  social = true,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  social?: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
      </div>

      <div className="rounded-[16px] border border-border bg-surface p-6 shadow-[var(--shadow-sm)]">
        {social ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-11 justify-center" aria-label="Continue with Google">
                Google
              </Button>
              <Button variant="outline" className="h-11 justify-center" aria-label="Continue with Wallet">
                Wallet
              </Button>
              <Button variant="outline" className="h-11 justify-center" aria-label="Continue with Github">
                GitHub
              </Button>
            </div>
            <div className="my-5 flex items-center gap-3">
              <Separator />
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                or continue with email
              </span>
              <Separator />
            </div>
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
}