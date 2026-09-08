"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { MarketCard } from "@/components/market/market-card";
import { MarketCardSkeletonGrid } from "@/components/market/market-card-skeleton";
import { MarketRow } from "@/components/market/market-row";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_CHIPS, SORT_OPTIONS } from "@/constants";
import { cn } from "@/lib/utils";
import { marketService } from "@/services/market.service";

export function MarketsBrowser() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "All";
  const sort = searchParams.get("sort") ?? "Volume";
  const view = searchParams.get("view") ?? "grid";
  const search = searchParams.get("search") ?? "";

  const [searchText, setSearchText] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText), 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (debouncedSearch === current) return;
    const next = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      next.set("search", debouncedSearch);
    } else {
      next.delete("search");
    }
    const qs = next.toString();
    router.replace(qs ? `/markets?${qs}` : "/markets", { scroll: false });
  }, [debouncedSearch, router, searchParams]);

  const params = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || value === "All") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }
      const qs = next.toString();
      router.push(qs ? `/markets?${qs}` : "/markets", { scroll: false });
    },
    [router, searchParams]
  );

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["markets", category, sort, debouncedSearch],
    queryFn: () =>
      marketService.getMarkets({
        category,
        sort,
        search: debouncedSearch || undefined,
      }),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Browse"
        title="Markets"
        description="Explore all prediction markets. Trade on what you know."
      />

      <div className="scrollbar-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {CATEGORY_CHIPS.map((cat) => (
          <Chip
            key={cat}
            active={category === cat}
            onClick={() => params({ category: cat === "All" ? null : cat })}
          >
            {cat}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchInput
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => {
              setSearchText("");
              params({ search: null });
            }}
            placeholder="Search markets\u2026"
            className="max-w-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") params({ search: searchText });
            }}
            aria-label="Search markets"
          />
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Market view"
            className="inline-flex h-10 items-center gap-0.5 rounded-[10px] border border-border bg-surface p-0.5"
          >
            <button
              onClick={() => params({ view: "grid" })}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                view === "grid"
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => params({ view: "list" })}
              aria-pressed={view === "list"}
              aria-label="List view"
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                view === "list"
                  ? "bg-primary-light text-primary"
                  : "text-text-muted hover:text-text-primary"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Select value={sort} onValueChange={(v) => params({ sort: v })}>
            <SelectTrigger className="w-[140px]" aria-label="Sort markets">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <MarketCardSkeletonGrid count={9} />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !data || data.length === 0 ? (
        <EmptyState
          variant="search"
          title="No markets found"
          description="Try another search or category."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchText("");
            router.push("/markets");
          }}
        />
      ) : (
        <>
          <p className="text-xs font-medium text-text-muted">
            {data.length} markets
          </p>
          {view === "grid" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {data.map((market) => (
                <MarketCard key={market.id} market={market} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data.map((market) => (
                <MarketRow key={market.id} market={market} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
