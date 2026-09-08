"use client";

import { Bell, CheckCheck, Settings as SettingsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { NotificationItemRow } from "@/components/notifications/notification-item";
import { NotificationSummary } from "@/components/notifications/notification-summary";
import { getNotificationRoute } from "@/components/notifications/notification-utils";
import { FeedbackTab } from "@/components/support/feedback-tab";
import { SupportChatButton } from "@/components/support/support-chat-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  selectUnreadCount,
  useNotificationsStore,
} from "@/store/notifications-store";
import type { NotificationCategory, NotificationItem } from "@/types";

const NOTIFICATION_TABS = [
  "All",
  "Trades",
  "Social",
  "Rewards",
  "Announcements",
  "System",
] as const;

type NotificationTab = (typeof NOTIFICATION_TABS)[number];

const CATEGORY_BY_TAB: Partial<Record<NotificationTab, NotificationCategory>> = {
  Trades: "TRADE",
  Social: "SOCIAL",
  Rewards: "REWARD",
  Announcements: "ANNOUNCEMENT",
  System: "SYSTEM",
};

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationTab>("All");

  const notifications = useNotificationsStore((s) => s.notifications);
  const loading = useNotificationsStore((s) => s.loading);
  const error = useNotificationsStore((s) => s.error);
  const load = useNotificationsStore((s) => s.load);
  const unread = useNotificationsStore(selectUnreadCount);
  const markAsRead = useNotificationsStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationsStore((s) => s.markAllAsRead);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = (
    CATEGORY_BY_TAB[activeTab]
      ? notifications.filter(
          (n) => n.category === CATEGORY_BY_TAB[activeTab]
        )
      : [...notifications]
  ).sort((a, b) => Number(a.read) - Number(b.read));

  const openNotification = (n: NotificationItem) => {
    if (!n.read) markAsRead(n.id);
    router.push(getNotificationRoute(n));
  };

  const handleMarkAllRead = () => {
    if (unread === 0) return;
    markAllAsRead();
    toast.success("All notifications marked as read");
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <PageHeader
            eyebrow="Inbox"
            title="Notifications"
            description="Stay on top of your trades, rewards, and social activity."
          >
            {unread > 0 ? (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="h-4 w-4 text-primary" />
                Mark all as read
              </Button>
            ) : (
              <Button variant="ghost" size="sm" disabled>
                <CheckCheck className="h-4 w-4" />
                All caught up
              </Button>
            )}
          </PageHeader>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NotificationTab)}>
            <div className="scrollbar-thin -mx-1 overflow-x-auto px-1 pb-1">
              <TabsList className="min-w-max">
                {NOTIFICATION_TABS.map((tab) => (
                  <TabsTrigger key={tab} value={tab}>
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              <Card className="overflow-hidden">
                {loading && notifications.length === 0 ? (
                  <div className="space-y-2 p-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-[68px]" />
                    ))}
                  </div>
                ) : error && notifications.length === 0 ? (
                  <CardContent>
                    <ErrorState onRetry={() => void load()} />
                  </CardContent>
                ) : filtered.length === 0 ? (
                  <CardContent>
                    <EmptyState
                      icon={Bell}
                      title="No notifications here"
                      description="Check back later for updates."
                    />
                  </CardContent>
                ) : (
                  <>
                    {filtered.map((n, i) => (
                      <NotificationItemRow
                        key={n.id}
                        item={n}
                        onSelect={openNotification}
                        className={
                          i < filtered.length - 1
                            ? "border-b border-border-light"
                            : undefined
                        }
                      />
                    ))}
                  </>
                )}
              </Card>

              {notifications.length > 0 && !loading ? (
                <p className="mt-3 text-xs text-text-muted">
                  Showing{" "}
                  {filtered.length === notifications.length ? (
                    "all"
                  ) : (
                    <strong>{filtered.length}</strong>
                  )}{" "}
                  notifications
                  {filtered.length !== notifications.length
                    ? ` of ${notifications.length}`
                    : ""}
                  {" "}·{" "}
                  <span className="font-medium text-text-secondary">
                    {unread} unread
                  </span>
                </p>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-5">
          <NotificationSummary notifications={notifications} />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <SettingsIcon className="h-4 w-4 text-text-muted" />
                Manage Notifications
              </CardTitle>
              <CardDescription>
                Use the tabs above to filter this list. Choose which alerts you
                receive by push, email, or SMS in Settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => router.push("/settings")}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <FeedbackTab />
      <SupportChatButton />
    </>
  );
}