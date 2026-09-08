"use client";

import { useQuery } from "@tanstack/react-query";
import { MessageSquareText, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { GroupCard } from "@/components/groups/group-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FieldError, FieldLabel, Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groupService } from "@/services/domain.service";
import type { Group } from "@/types";

const GROUP_FILTERS = [
  "All",
  "Community",
  "Crypto",
  "Sports",
  "Politics",
  "Gaming",
  "Technology",
] as const;

export default function GroupsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Discover");
  const [filter, setFilter] = useState<(typeof GROUP_FILTERS)[number]>("All");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [extraGroups, setExtraGroups] = useState<Group[]>([]);

  const {
    data: allGroups,
    isLoading: loadingAll,
    isError: errorAll,
    refetch: refetchAll,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: groupService.getGroups,
  });

  const {
    data: myGroups,
    isLoading: loadingMy,
    isError: errorMy,
    refetch: refetchMy,
  } = useQuery({
    queryKey: ["groups", "my"],
    queryFn: groupService.getMyGroups,
  });

  const {
    data: popularGroups,
    isLoading: loadingPopular,
    isError: errorPopular,
    refetch: refetchPopular,
  } = useQuery({
    queryKey: ["groups", "popular"],
    queryFn: groupService.getPopularGroups,
  });

  const featured = useMemo(() => allGroups?.slice(0, 3) ?? [], [allGroups]);

  const filtered = useMemo(() => {
    const base = [...(allGroups ?? []), ...extraGroups];
    if (filter === "All") return base;
    return base.filter((g) => g.category === filter);
  }, [allGroups, extraGroups, filter]);

  const createGroup = () => {
    const name = newName.trim();
    if (name.length < 2) {
      toast.error("Group name must be at least 2 characters");
      return;
    }
    setCreating(true);
    setTimeout(() => {
      const group: Group = {
        id: `g-${Date.now()}`,
        name,
        description: newDescription.trim() || "A brand new community group.",
        memberCount: 1,
        category: filter === "All" ? "Community" : filter,
        initials: name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      };
      setExtraGroups((prev) => [group, ...prev]);
      setCreating(false);
      setCreateOpen(false);
      setNewName("");
      setNewDescription("");
      toast.success("Group created");
    }, 600);
  };

  function renderGrid(
    groups: Group[] | undefined,
    loading: boolean,
    error: boolean,
    refetch: () => void
  ) {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-[16px]" />
          ))}
        </div>
      );
    }
    if (error) {
      return <ErrorState onRetry={refetch} />;
    }
    if (!groups || groups.length === 0) {
      return (
        <EmptyState
          title="No groups found"
          description="Try a different category or create the first group."
        />
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            featured={featured.some((f) => f.id === group.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Community"
        title="Groups"
        description="Join communities around the markets you care about."
      >
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <UsersRound className="h-4 w-4" />
          Create Group
        </Button>
      </PageHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="Discover">Discover</TabsTrigger>
          <TabsTrigger value="My Groups">My Groups</TabsTrigger>
          <TabsTrigger value="Popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="Discover" className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">
              Featured Groups
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {loadingAll
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-[16px]" />
                  ))
                : featured.map((group) => (
                    <GroupCard key={group.id} group={group} featured />
                  ))}
            </div>
          </section>

          <div className="flex flex-wrap gap-2">
            {GROUP_FILTERS.map((f) => (
              <Chip
                key={f}
                active={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </Chip>
            ))}
          </div>

          {renderGrid(filtered, loadingAll, errorAll, refetchAll)}
        </TabsContent>

        <TabsContent value="My Groups">
          {renderGrid(
            [...(myGroups ?? []), ...extraGroups],
            loadingMy,
            errorMy,
            refetchMy
          )}
        </TabsContent>

        <TabsContent value="Popular">
          {renderGrid(popularGroups, loadingPopular, errorPopular, refetchPopular)}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Discussions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingAll
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-[12px]" />
              ))
            : (allGroups ?? []).slice(0, 4).map((group) => (
                <div
                  key={group.id}
                  className="flex items-center justify-between gap-3 rounded-[12px] border border-border-light bg-background px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-primary-light text-primary">
                      <MessageSquareText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {group.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {Math.floor(group.memberCount / 40)}+ active threads
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      router.push(`/social`);
                      toast.info(`Viewing discussions in ${group.name}`);
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
        </CardContent>
      </Card>

      <Modal open={createOpen} onOpenChange={setCreateOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Create Group</ModalTitle>
            <ModalDescription>
              Start a community around the markets you care about.
            </ModalDescription>
          </ModalHeader>
          <div className="space-y-4">
            <div>
              <FieldLabel htmlFor="group-name">Group name</FieldLabel>
              <Input
                id="group-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Bitcoin Maximalists"
                maxLength={50}
              />
              <FieldError>
                {newName.trim().length >= 2
                  ? undefined
                  : "Group name must be at least 2 characters"}
              </FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="group-description">Description</FieldLabel>
              <Input
                id="group-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What is this group about?"
                maxLength={120}
              />
            </div>
          </div>
          <ModalFooter>
            <Button
              variant="secondary"
              onClick={() => setCreateOpen(false)}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button onClick={createGroup} loading={creating}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
