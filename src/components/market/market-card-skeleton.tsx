import { Skeleton } from "@/components/ui/skeleton";

export function MarketCardSkeleton() {
  return (
    <div className="rounded-[16px] border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-5 w-full" />
      <Skeleton className="mt-2 h-5 w-3/4" />
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="mt-5 flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-14" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-9 rounded-[10px]" />
        <Skeleton className="h-9 rounded-[10px]" />
      </div>
    </div>
  );
}

export function MarketCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <MarketCardSkeleton key={i} />
      ))}
    </div>
  );
}