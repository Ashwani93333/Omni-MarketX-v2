"use client";

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
  const mobileNavOpen = useAppStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-border bg-surface lg:block">
        <SidebarContent />
      </aside>

      <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DrawerContent side="left" showClose className="w-72">
          <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
        </DrawerContent>
      </Drawer>

      <div className="flex min-h-screen flex-col lg:pl-60">
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