"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { notificationsService } from "@/services/notifications.service";
import type { NotificationItem } from "@/types";

interface NotificationsState {
  notifications: NotificationItem[];
  loading: boolean;
  error: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      loading: false,
      error: false,
      loaded: false,
      load: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true, error: false });
        try {
          const notifications = await notificationsService.getNotifications();
          set({ notifications, loaded: true, loading: false });
        } catch {
          set({ error: true, loading: false });
        }
      },
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.read ? n : { ...n, read: true }
          ),
        })),
    }),
    {
      name: "omx-notifications",
      partialize: (state) => ({
        notifications: state.notifications,
        loaded: state.loaded,
      }),
    }
  )
);

export function selectUnreadCount(state: NotificationsState): number {
  return state.notifications.filter((n) => !n.read).length;
}