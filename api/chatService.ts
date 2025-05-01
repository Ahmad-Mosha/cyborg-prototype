import api from "./apiConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChatConversation,
  ChatMessage,
  CreateMessageDTO,
  CreateConversationResponse,
  SendMessageResponse,
} from "../types/chat";
import { MessageType } from "../types/cyborg";

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

  /**
   * Convert chat messages from API format to UI format
   */
  convertToUiMessages(messages: ChatMessage[]): MessageType[] {
    return messages.map((msg: ChatMessage) => ({
      type: msg.role === "ai" ? "cyborg" : "user",
      text: msg.content,
      time: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    }));
  },

  /**
   * Get welcome message for new conversations
   */
  getWelcomeMessage(): MessageType {
    return {
      type: "cyborg",
      text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  },

  /**
   * Create user message object for UI
   */
  createUserMessage(content: string): MessageType {
    return {
      type: "user",
      text: content,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  },

  /**
   * Create AI message object for UI
   */
  createAiMessage(content: string, timestamp: string): MessageType {
    return {
      type: "cyborg",
      text: content,
      time: new Date(timestamp).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  },

  /**
   * Initialize conversation or create new one
   */
  async initializeConversation(): Promise<{
    conversation: ChatConversation | null;
    messages: MessageType[];
  }> {
    try {
      // Try to get all conversations to check if we have an active one
      const conversations = await this.getAllConversations();
      let activeConv = conversations.find((conv) => conv.isActive);
      let initialMessages: MessageType[] = [];

      if (!activeConv) {
        // Create a new conversation if none exists or none is active
        const newConv = await this.createConversation();
        activeConv = newConv;
        initialMessages = [this.getWelcomeMessage()];
      } else if (activeConv.id) {
        // If we have an active conversation with messages, load them
        const fullConversation = await this.getConversationById(activeConv.id);

        // Convert API messages to our UI message format if they exist
        if (fullConversation.messages && fullConversation.messages.length > 0) {
          initialMessages = this.convertToUiMessages(fullConversation.messages);
        } else {
          initialMessages = [this.getWelcomeMessage()];
        }
      }

      return {
        conversation: activeConv,
        messages: initialMessages,
      };
    } catch (error: any) {
      console.error("Error initializing chat:", error);
      throw error;
    }
  },

  /**
   * Send a chat message and handle all necessary API operations
   */
  async sendChatMessage(
    conversationId: string | undefined,
    messageContent: string
  ): Promise<{
    conversation: ChatConversation;
    aiMessage: MessageType;
  }> {
    try {
      let activeConversationId = conversationId;
      let conversation: ChatConversation;

      // Ensure we have a conversation
      if (!activeConversationId) {
        conversation = await this.createConversation();
        activeConversationId = conversation.id;
      } else {
        conversation = { id: activeConversationId } as ChatConversation;
      }

      // Send message to API
      const response = await this.sendMessage(activeConversationId, {
        content: messageContent,
      });

      // Create AI message from response
      const aiMessage = this.createAiMessage(
        response.content,
        response.createdAt
      );

      return {
        conversation,
        aiMessage,
      };
    } catch (error: any) {
      console.error("Error sending chat message:", error);
      throw error;
    }
  },

  /**
   * Process video upload and get AI analysis
   * Note: This is a simulated implementation that should be replaced with actual video upload code
   */
  async processVideoUpload(conversationId: string | undefined): Promise<{
    conversation: ChatConversation;
    aiMessage: MessageType;
  }> {
    try {
      let activeConversationId = conversationId;
      let conversation: ChatConversation;

      // Ensure we have a conversation
      if (!activeConversationId) {
        conversation = await this.createConversation();
        activeConversationId = conversation.id;
      } else {
        conversation = { id: activeConversationId } as ChatConversation;
      }

      // Send message about video upload to API
      const response = await this.sendMessage(activeConversationId, {
        content: "I've uploaded a video for analysis.",
      });

      // Simulated AI response for video analysis
      // In a real implementation, this would come from processing the actual video
      const aiMessage = {
        type: "cyborg" as const,
        text: "I've analyzed your form in the video. Your squat depth is good, but try to keep your knees aligned with your toes. Also, maintain a neutral spine throughout the movement for better results and to prevent injury.",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      return {
        conversation,
        aiMessage,
      };
    } catch (error: any) {
      console.error("Error processing video:", error);
      throw error;
    }
  },
};

export default chatService;
