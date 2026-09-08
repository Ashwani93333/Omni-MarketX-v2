"use client";

import { useEffect } from "react";

import { applyTheme, useAppStore } from "@/store/app-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return <>{children}</>;
}