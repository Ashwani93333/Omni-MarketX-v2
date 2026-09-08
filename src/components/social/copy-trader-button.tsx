"use client";

import { Copy, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { useCopyStore } from "@/store/copy-store";
import type { CopyAllocation } from "@/types";

const ALLOCATIONS: CopyAllocation[] = ["1", "5", "10"];

export function CopyTraderButton({
  trader,
}: {
  trader: { userId: string; displayName: string; initials: string };
}) {
  const copied = useCopyStore((s) => s.copied);
  const allocation = useCopyStore((s) => s.freeAllocation);
  const setAllocation = useCopyStore((s) => s.setFreeAllocation);
  const startCopy = useCopyStore((s) => s.startCopy);
  const stopCopy = useCopyStore((s) => s.stopCopy);

  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<CopyAllocation>(allocation);

  const isCopying = useMemo(
    () => copied.some((c) => c.userId === trader.userId),
    [copied, trader.userId]
  );

  const handleConfirm = () => {
    if (isCopying) {
      stopCopy(trader.userId);
      toast.success(`Stopped copying ${trader.displayName}`);
    } else {
      startCopy({ ...trader, allocation: pending });
      setAllocation(pending);
      toast.success(`Now copying ${trader.displayName}`);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant={isCopying ? "outline-primary" : "outline"}
        size="sm"
        onClick={() => {
          setPending(allocation);
          setOpen(true);
        }}
        className="gap-1.5"
      >
        {isCopying ? (
          <>
            <UserCheck className="h-4 w-4" /> Copying
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy Trader
          </>
        )}
      </Button>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {isCopying
                ? `Stop copying ${trader.displayName}?`
                : `Copy ${trader.displayName}`}
            </ModalTitle>
            <ModalDescription>
              {isCopying
                ? "Your open trades will stop mirroring this trader. Existing positions stay yours."
                : "Your portfolio will mirror this trader's new positions. You can stop anytime."}
            </ModalDescription>
          </ModalHeader>

          {!isCopying && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-widest text-text-muted">
                Allocation
              </p>
              <div className="grid grid-cols-3 gap-2">
                {ALLOCATIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setPending(a)}
                    className={cn(
                      "rounded-[10px] border px-3 py-2 text-center transition-colors",
                      pending === a
                        ? "border-primary bg-primary-light/60"
                        : "border-border bg-background hover:border-primary/40"
                    )}
                  >
                    <p className="text-sm font-extrabold text-text-primary">
                      {a}%
                    </p>
                    <p className="text-[10px] text-text-muted">
                      of {a === "1" ? "base" : a === "5" ? "average" : "large"} capital
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <ModalFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={isCopying ? "destructive" : "primary"}
              onClick={handleConfirm}
            >
              {isCopying
                ? "Stop Copying"
                : `Start Copying · ${pending}%`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}