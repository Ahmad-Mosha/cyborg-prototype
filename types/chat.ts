import { User } from "../auth/user";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "ai";
  createdAt: string;
  conversation?: ChatConversation;
  user?: User;
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  messages?: ChatMessage[];
  user?: User;
}

export interface CreateMessageDTO {
  content: string;
}

export interface CreateConversationResponse {
  id: string;
  title: string;
  user: {
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  role: "ai";
  conversation: {
    id: string;
  };
  user: {
    id: string;
  };
  createdAt: string;
}
