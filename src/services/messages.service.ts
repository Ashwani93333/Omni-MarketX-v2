import { conversations, messagesByConversation } from "@/mocks/messages";
import { mockRequest } from "@/services/client";
import type { Conversation, Message } from "@/types";

export const messageService = {
  async getConversations(): Promise<Conversation[]> {
    return mockRequest(conversations, 350);
  },
  async getMessages(conversationId: string): Promise<Message[]> {
    return mockRequest(messagesByConversation[conversationId] ?? [], 300);
  },
  async sendMessage(
    conversationId: string,
    content: string
  ): Promise<Message> {
    const message: Message = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: "user-me",
      content,
      timestamp: new Date().toISOString(),
    };
    return mockRequest(message, 150);
  },
};