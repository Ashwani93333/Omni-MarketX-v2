"use client";

import { useQuery } from "@tanstack/react-query";
import { EyeOff, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { MarketCard } from "@/components/market/market-card";
import { MarketCardSkeletonGrid } from "@/components/market/market-card-skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { marketService } from "@/services/market.service";
import { useWatchlistStore } from "@/store/watchlist-store";

export default function WatchlistPage() {
  const router = useRouter();
  const ids = useWatchlistStore((s) => s.ids);
  const clear = useWatchlistStore((s) => s.clear);
  const [confirmingClear, setConfirmingClear] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["markets", "all"],
    queryFn: () => marketService.getMarkets({ sort: "Volume" }),
  });

  const watched =
    data?.filter((m) => ids.includes(m.id)) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Watchlist"
        title="My Watchlist"
        description="Markets you're following, with live probability updates."
      >
        {watched.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmingClear(true)}
            className="text-text-muted"
          >
            <EyeOff className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </PageHeader>

      {isLoading ? (
        <MarketCardSkeletonGrid count={4} />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : watched.length === 0 ? (
        <EmptyState
          title="Nothing on your watchlist yet"
          description="Star any market to keep an eye on it. You'll see it here with its latest probability."
          actionLabel="Explore markets"
          onAction={() => router.push("/markets")}
        />
      ) : (
        <div>
          <p className="mb-4 text-sm text-text-secondary">
            <strong className="number-tight text-text-primary">
              {watched.length}
            </strong>{" "}
            {watched.length === 1 ? "market" : "markets"} being watched
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {watched.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-[16px] border border-border bg-surface px-4 py-3 text-sm text-text-secondary">
        <Star className="mt-0.5 h-4 w-4 shrink-0 text-orange" />
        <p>
          Use the star on any market card (or the market page) to add or remove
          it from your watchlist.
        </p>
      </div>

      <Modal open={confirmingClear} onOpenChange={setConfirmingClear}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Clear your watchlist?</ModalTitle>
            <ModalDescription>
              This will unfollow all {watched.length}{" "}
              {watched.length === 1 ? "market" : "markets"} from your
              watchlist. You can always add them back later.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <Button variant="secondary" onClick={() => setConfirmingClear(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clear();
                setConfirmingClear(false);
              }}
            >
              Clear watchlist
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}