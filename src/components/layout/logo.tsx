import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2", className)}
      aria-label="OmniMarketX home"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-brand text-sm font-extrabold text-white shadow-[0_2px_8px_rgba(242,31,104,0.35)]">
        M
      </span>
      <span className="bg-gradient-brand bg-clip-text text-[17px] font-extrabold tracking-tight text-transparent">
        OmniMarketX
      </span>
    </Link>
  );
}