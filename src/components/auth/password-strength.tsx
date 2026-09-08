"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

export function PasswordStrength({ password }: { password: string }) {
  const { score, label, color, width } = useMemo(() => {
    if (!password) return { score: 0, label: "", color: "", width: 0 };
    let s = 0;
    if (password.length >= 8) s += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s += 1;
    if (/\d/.test(password)) s += 1;
    if (/[^A-Za-z0-9]/.test(password)) s += 1;
    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-danger", "bg-orange", "bg-blue", "bg-success"];
    return {
      score: s,
      label: labels[s],
      color: colors[s],
      width: (s / 4) * 100,
    };
  }, [password]);

  return (
    <div className="mt-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-background">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn(
              "mx-0.5 h-full flex-1 rounded-full transition-colors duration-300 first:ml-0 last:mr-0",
              segment <= score ? color : "bg-border-light"
            )}
          />
        ))}
      </div>
      {label ? (
        <p
          className={cn(
            "mt-1 text-xs font-semibold",
            score <= 1 && "text-danger",
            score === 2 && "text-orange",
            score === 3 && "text-blue",
            score === 4 && "text-success"
          )}
        >
          Password strength: {label}
        </p>
      ) : null}
      <span className="sr-only">{Math.round(width)}%</span>
    </div>
  );
}