"use client";

import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

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

      <div className="rounded-[16px] border border-border bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-7">
        {social ? (
          <>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="h-11 justify-center gap-2"
                aria-label="Continue with Google"
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-center gap-2"
                aria-label="Continue with Wallet"
              >
                <Wallet className="text-blue" />
                Wallet
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-center gap-2"
                aria-label="Continue with GitHub"
              >
                <GithubIcon />
                GitHub
              </Button>
            </div>
            <div className="my-5 flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-text-muted">
                or continue with email
              </span>
              <Separator className="flex-1" />
            </div>
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
}