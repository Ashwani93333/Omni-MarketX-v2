import { notifications } from "@/mocks/notifications";
import { mockRequest } from "@/services/client";
import type { NotificationItem } from "@/types";

export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    return mockRequest(notifications, 300);
  },
  async markAsRead(id: string): Promise<void> {
    await mockRequest({ id }, 120);
  },
  async markAllAsRead(): Promise<void> {
    await mockRequest(true, 120);
  },
};