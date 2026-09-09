"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { useAuthStore } from "@/store/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      const redirect = encodeURIComponent(pathname || "/home");
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [ready, isAuthenticated, pathname, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking your account&hellip;
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}