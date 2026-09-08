"use client";

import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, UsersRound } from "lucide-react";
import Link from "next/link";

import { MarketCard } from "@/components/market/market-card";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { groups } from "@/mocks/groups";
import { searchUsers } from "@/mocks/social";
import { marketService } from "@/services/market.service";
import type { Group, User } from "@/types";
import { cn } from "@/lib/utils";

export function SearchResults({ query }: { query: string }) {
  const q = query.trim();

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: () => marketService.getMarkets({ search: q, sort: "Volume" }),
    enabled: Boolean(q),
  });

  const matchedUsers = q
    ? searchUsers.filter((u) =>
        `${u.displayName} ${u.username}`.toLowerCase().includes(q.toLowerCase())
      )
    : [];
  const matchedGroups: Group[] = q
    ? groups.filter(
        (g) =>
          g.name.toLowerCase().includes(q.toLowerCase()) ||
          g.description.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const empty = !isLoading && !data?.length && !matchedUsers.length && !matchedGroups.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Search
          </p>
          <h1 className="mt-1 truncate text-2xl font-bold text-text-primary">
            {q ? <>Results for &ldquo;{q}&rdquo;</> : "Search OmniMarketX"}
          </h1>
        </div>
        <Link
          href="/markets"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-xs font-semibold text-text-primary transition-colors hover:bg-background"
        >
          <SearchIcon className="h-4 w-4" />
          Browse all markets
        </Link>
      </div>

      {!q ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <SearchIcon className="h-10 w-10 text-text-muted" />
            <p className="mt-4 text-base font-semibold text-text-primary">
              Find a market, trader or community
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              Use the search bar in the header to look up markets, events,
              traders and groups.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-[16px]" />
          ))}
        </div>
      ) : empty ? (
        <Card>
          <CardContent className="flex flex-col items-center py-16 text-center">
            <SearchIcon className="h-10 w-10 text-text-muted" />
            <p className="mt-4 text-base font-semibold text-text-primary">
              No results for &ldquo;{q}&rdquo;
            </p>
            <p className="mt-1 max-w-sm text-sm text-text-secondary">
              Try a different keyword, or browse the full market directory.
            </p>
            <Link
              href="/markets"
              className="mt-5 inline-flex items-center gap-1.5 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
            >
              View all markets
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {data && data.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-text-primary">
                Markets ({data.length})
              </h2>
              <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((market) => (
                  <MarketCard key={market.id} market={market} />
                ))}
              </div>
            </section>
          )}

          {matchedUsers.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-text-primary">
                Traders ({matchedUsers.length})
              </h2>
              <Card className="mt-3">
                <CardContent className="divide-y divide-border-light p-0">
                  <TradersRow users={matchedUsers} />
                </CardContent>
              </Card>
            </section>
          )}

          {matchedGroups.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-text-primary">
                Groups ({matchedGroups.length})
              </h2>
              <Card className="mt-3">
                <CardContent className="divide-y divide-border-light p-0">
                  {matchedGroups.map((group) => (
                    <Link
                      key={group.id}
                      href="/groups"
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-light text-primary">
                        <UsersRound className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-text-primary">
                          {group.name}
                        </span>
                        <span className="block truncate text-xs text-text-muted">
                          {group.memberCount.toLocaleString()} members ·{" "}
                          {group.category}
                        </span>
                      </span>
                      <span className="max-w-[180px] truncate text-xs text-text-secondary">
                        {group.description}
                      </span>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TradersRow({ users }: { users: User[] }) {
  return (
    <>
      {users.map((user) => (
        <Link
          key={user.id}
          href={`/users/${user.id}`}
          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-background"
        >
          <Avatar size="md" initials={user.initials} alt={user.displayName} />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-text-primary">
              {user.displayName}
            </span>
            <span className="block text-xs text-text-muted">
              @{user.username}
            </span>
          </span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-bold",
              user.username.includes("miacrypto")
                ? "bg-success-light text-success"
                : "bg-primary-light text-primary"
            )}
          >
            Trader
          </span>
        </Link>
      ))}
    </>
  );
}