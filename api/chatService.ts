import api from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChatConversation,
  ChatMessage,
  CreateMessageDTO,
  CreateConversationResponse,
  SendMessageResponse,
} from "../types/chat";

export const chatService = {
  /**
   * Get all user conversations
   */
  async getAllConversations(): Promise<ChatConversation[]> {
    try {
      const response = await api.get<ChatConversation[]>(
        "/ai-chat/conversations"
      );
      return response.data;
    } catch (error: any) {
      console.error("Get all conversations error:", error);
      throw error;
    }
  },

  /**
   * Get a specific conversation by ID with messages
   */
  async getConversationById(conversationId: string): Promise<ChatConversation> {
    try {
      const response = await api.get<ChatConversation>(
        `/ai-chat/conversations/${conversationId}`
      );
      return response.data;
    } catch (error: any) {
      console.error(`Get conversation ${conversationId} error:`, error);
      throw error;
    }
  },

  /**
   * Create a new conversation
   */
  async createConversation(): Promise<ChatConversation> {
    try {
      const response = await api.post<CreateConversationResponse>(
        "/ai-chat/conversations"
      );

      // Convert the CreateConversationResponse to ChatConversation format
      const conversation: ChatConversation = {
        id: response.data.id,
        title: response.data.title,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
        isActive: response.data.isActive,
        messages: [],
        // Only include minimal user data that we have
        user: response.data.user
          ? {
              id: response.data.user.id,
              // The following properties are required by User type but not available in the response
              email: "",
              firstName: "",
              lastName: "",
              roles: [],
              profileImage: "",
              createdAt: "",
              updatedAt: "",
            }
          : undefined,
      };

      return conversation;
    } catch (error: any) {
      console.error("Create conversation error:", error);
      throw error;
    }
  },

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    conversationId: string,
    message: CreateMessageDTO
  ): Promise<SendMessageResponse> {
    try {
      const response = await api.post<SendMessageResponse>(
        `/ai-chat/conversations/${conversationId}/messages`,
        message
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `Send message to conversation ${conversationId} error:`,
        error
      );
      throw error;
    }
  },

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await api.delete(`/ai-chat/conversations/${conversationId}`);
    } catch (error: any) {
      console.error(`Delete conversation ${conversationId} error:`, error);
      throw error;
    }
  },
};

export default chatService;
