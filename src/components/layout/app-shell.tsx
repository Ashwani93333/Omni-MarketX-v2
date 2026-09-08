"use client";

import { useRef } from "react";

import { DemoBanner } from "@/components/layout/demo-banner";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SidebarContent } from "@/components/layout/sidebar";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/app-store";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);
  const hideTimer = useRef<number | null>(null);

  const hideSidebar = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setSidebarOpen(false), 250);
  };

  const cancelHide = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div
        aria-hidden
        onMouseEnter={() => setSidebarOpen(true)}
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-2",
          sidebarOpen ? "pointer-events-none" : "pointer-events-auto"
        )}
      />

      <aside
        onMouseLeave={hideSidebar}
        onMouseEnter={cancelHide}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-surface transition-transform duration-300 ease-in-out lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DrawerContent side="left" showClose className="w-72">
          <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </DrawerContent>
      </Drawer>

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding-left] duration-300 ease-in-out",
          sidebarOpen ? "lg:pl-60" : "lg:pl-0"
        )}
      >
        <div className="sticky top-0 z-30 w-full">
          <DemoBanner />
          <Header />
        </div>
        <main className={cn("flex-1 px-4 pb-24 pt-6 lg:px-6 lg:pb-10")}>
          <div
            className={cn(
              "mx-auto w-full max-w-[1500px]",
              className
            )}
          >
            {children}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}