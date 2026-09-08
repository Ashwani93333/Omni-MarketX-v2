"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { messageService } from "@/services/messages.service";
import type { Conversation, Message } from "@/types";

interface MessagesState {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  loading: boolean;
  error: boolean;
  loaded: boolean;
  load: () => Promise<void>;
  markConversationRead: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messagesByConversation: {},
      loading: false,
      error: false,
      loaded: false,
      load: async () => {
        if (get().loaded || get().loading) return;
        set({ loading: true, error: false });
        try {
          const conversations = await messageService.getConversations();
          const threads = await Promise.all(
            conversations.map((c) => messageService.getMessages(c.id))
          );
          const messagesByConversation = conversations.reduce<
            Record<string, Message[]>
          >((acc, c, i) => {
            acc[c.id] = threads[i];
            return acc;
          }, {});
          set({
            conversations,
            messagesByConversation,
            loaded: true,
            loading: false,
          });
        } catch {
          set({ error: true, loading: false });
        }
      },
      markConversationRead: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, unreadCount: 0 } : c
          ),
        })),
      sendMessage: (conversationId, content) => {
        const message: Message = {
          id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          conversationId,
          senderId: "user-me",
          content,
          timestamp: new Date().toISOString(),
        };
        set((state) => {
          const thread = state.messagesByConversation[conversationId] ?? [];
          const conversation = state.conversations.find(
            (c) => c.id === conversationId
          );
          const now = message.timestamp;
          return {
            messagesByConversation: {
              ...state.messagesByConversation,
              [conversationId]: [...thread, message],
            },
            conversations: state.conversations.map((c) =>
              c.id === conversationId
                ? {
                    ...c,
                    lastMessage: content,
                    timestamp: now,
                    unreadCount: conversation ? 0 : c.unreadCount,
                  }
                : c
            ),
          };
        });
      },
    }),
    {
      name: "omx-messages",
      partialize: (state) => ({
        conversations: state.conversations,
        messagesByConversation: state.messagesByConversation,
        loaded: state.loaded,
      }),
    }
  )
);

export function selectUnreadCount(state: MessagesState): number {
  return state.conversations.reduce((total, c) => total + c.unreadCount, 0);
}