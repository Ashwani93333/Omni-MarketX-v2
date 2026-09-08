import { Suspense } from "react";

import { TraderProfileClient } from "./trader-profile-client";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-[16px]" />}>
      <TraderProfileClient userId={userId} />
    </Suspense>
  );
}