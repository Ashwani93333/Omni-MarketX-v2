"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type DrawerSide = "left" | "right" | "bottom";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;

const sideClasses: Record<DrawerSide, string> = {
  left: "left-0 top-0 h-full w-[300px] max-w-[85vw] rounded-r-[16px]",
  right: "right-0 top-0 h-full w-[340px] max-w-[85vw] rounded-l-[16px]",
  bottom:
    "bottom-0 left-0 right-0 w-full rounded-t-[16px] max-h-[80vh] overflow-y-auto",
};

export function DrawerContent({
  children,
  side = "left",
  className,
  showClose = true,
}: {
  children: React.ReactNode;
  side?: DrawerSide;
  className?: string;
  showClose?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 bg-surface p-6 shadow-[var(--shadow-md)] focus:outline-none",
          sideClasses[side],
          className
        )}
      >
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1 text-text-muted transition-colors hover:bg-background hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export { Drawer, DrawerTrigger, DrawerClose };