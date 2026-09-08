import { Suspense } from "react";

import { MarketsBrowser } from "./markets-browser";
import { MarketCardSkeletonGrid } from "@/components/market/market-card-skeleton";

export default function MarketsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="skeleton h-20 rounded-[16px]" />
          <div className="skeleton h-10 rounded-full" />
          <MarketCardSkeletonGrid count={9} />
        </div>
      }
    >
      <MarketsBrowser />
    </Suspense>
  );
}