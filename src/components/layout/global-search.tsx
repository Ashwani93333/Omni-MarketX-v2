"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { SearchInput } from "@/components/ui/search-input";
import { groups } from "@/mocks/groups";
import { marketService } from "@/services/market.service";
import type { Group, Market, User } from "@/types";

const searchUsers: User[] = [
  { id: "su-1", username: "miacrypto", displayName: "Mia Crypto", initials: "MC" },
  { id: "su-2", username: "quantjuno", displayName: "Quant Juno", initials: "QJ" },
  { id: "su-3", username: "kadanster", displayName: "Kaden Sterling", initials: "KS" },
];

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Market[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    if (!open || !debouncedQuery.trim()) return;
    let cancelled = false;
    // Setting loading synchronously when a search begins is intentional here;
    // the fetch runs async below and this effect only tracks the debounced query.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    marketService
      .searchMarkets(debouncedQuery)
      .then((m) => {
        if (!cancelled) setResults(m);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  const matchedUsers = query.trim()
    ? searchUsers.filter((u) =>
        (u.displayName + u.username).toLowerCase().includes(query.toLowerCase())
      )
    : [];
  const matchedGroups = query.trim()
    ? groups
        .filter((g: Group) =>
          g.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3)
    : [];

  const hasResults =
    results.length > 0 || matchedUsers.length > 0 || matchedGroups.length > 0;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <div className="relative min-w-0 w-full max-w-md flex-1">
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              if (!next.trim()) setResults([]);
            }}
            placeholder="Search markets, events, users…"
            onFocus={() => setOpen(true)}
            onClear={() => {
              setQuery("");
              setResults([]);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }
              if (e.key === "Escape") setOpen(false);
            }}
            aria-label="Search markets, events, users"
            className="pr-12"
          />
          <kbd className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-text-muted lg:block">
            /
          </kbd>
        </div>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={8}
          className="z-50 w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[16px] border border-border bg-surface shadow-[var(--shadow-md)]"
        >
          <div className="max-h-[420px] overflow-y-auto p-2">
            {!query.trim() ? (
              <div className="flex flex-col items-center gap-1.5 px-4 py-10 text-center">
                <Search className="h-6 w-6 text-text-muted" />
                <p className="text-sm font-semibold text-text-primary">
                  Search markets, events & users
                </p>
                <p className="text-xs text-text-secondary">
                  Try “Bitcoin” or “gaming”
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <p className="text-sm text-text-secondary">Searching…</p>
              </div>
            ) : !hasResults ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm font-semibold text-text-primary">
                  No results for “{query}”
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Try a different search term or category.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.length > 0 && (
                  <SearchSection label="Markets">
                    {results.map((m) => (
                      <SearchRow
                        key={m.id}
                        href={`/markets/${m.id}`}
                        title={m.title}
                        sub={`${m.category} · ${m.probability}% YES`}
                        onSelect={() => setOpen(false)}
                      />
                    ))}
                  </SearchSection>
                )}
                {matchedUsers.length > 0 && (
                  <SearchSection label="Users">
                    {matchedUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-background"
                      >
                        <Avatar size="sm" initials={u.initials} />
                        <span className="text-sm font-medium text-text-primary">
                          {u.displayName}
                        </span>
                        <span className="text-xs text-text-muted">
                          @{u.username}
                        </span>
                      </button>
                    ))}
                  </SearchSection>
                )}
                {matchedGroups.length > 0 && (
                  <SearchSection label="Groups">
                    {matchedGroups.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-background"
                      >
                        <Avatar size="sm" initials={g.initials} />
                        <span className="text-sm font-medium text-text-primary">
                          {g.name}
                        </span>
                        <span className="text-xs text-text-muted">
                          {g.memberCount.toLocaleString()} members
                        </span>
                      </button>
                    ))}
                  </SearchSection>
                )}
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function SearchSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

function SearchRow({
  href,
  title,
  sub,
  onSelect,
}: {
  href: string;
  title: string;
  sub: string;
  onSelect: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onSelect}
      className="flex w-full flex-col gap-0.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-background"
    >
      <span className="text-sm font-medium text-text-primary">{title}</span>
      <span className="text-xs text-text-muted">{sub}</span>
    </Link>
  );
}