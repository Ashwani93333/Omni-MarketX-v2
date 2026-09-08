import { Suspense } from "react";

import { MarketDetailClient } from "./market-detail-client";

export default async function MarketDetailPage({
  params,
}: {
  params: Promise<{ marketId: string }>;
}) {
  const { marketId } = await params;
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-[16px]" />}>
      <MarketDetailClient marketId={marketId} />
    </Suspense>
  );
}