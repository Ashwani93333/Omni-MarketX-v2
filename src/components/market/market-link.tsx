import Link from "next/link";

import { cn } from "@/lib/utils";

export function MarketLink({
  marketId,
  className,
  children,
  onClick,
}: {
  marketId: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={`/markets/${marketId}`}
      className={cn(className)}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}