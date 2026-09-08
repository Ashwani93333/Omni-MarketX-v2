"use client";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

export function MarketActionButtons({
  marketId,
  disabled,
  direction = "row",
  className,
}: {
  marketId: string;
  disabled?: boolean;
  direction?: "row" | "column";
  className?: string;
}) {
  const router = useRouter();

  const go = (side: "YES" | "NO") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/markets/${marketId}?trade=${side}`);
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2",
        direction === "column" && "grid-cols-1",
        className
      )}
    >
      <button
        disabled={disabled}
        onClick={go("YES")}
        className="inline-flex h-9 items-center justify-center rounded-[10px] bg-success-light text-sm font-bold text-success transition-all hover:bg-success hover:text-white disabled:pointer-events-none disabled:opacity-50"
      >
        YES
      </button>
      <button
        disabled={disabled}
        onClick={go("NO")}
        className="inline-flex h-9 items-center justify-center rounded-[10px] bg-danger-light text-sm font-bold text-danger transition-all hover:bg-danger hover:text-white disabled:pointer-events-none disabled:opacity-50"
      >
        NO
      </button>
    </div>
  );
}