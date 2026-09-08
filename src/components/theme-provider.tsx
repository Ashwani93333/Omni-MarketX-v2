"use client";

import { useEffect } from "react";

import { applyTheme, useAppStore } from "@/store/app-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (useAppStore.getState().theme === "system") applyTheme("system");
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return <>{children}</>;
}