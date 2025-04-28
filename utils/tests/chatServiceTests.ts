import { chatService } from "@/api";

// This file contains test functions for the chat service
// Run these functions from your components temporarily to test the API integration

/**
 * Test function to create a conversation and send a message
 * Use this to test basic chat functionality
 */
export async function testChatFlow() {
  try {
    console.log("Creating new conversation...");
    const conversation = await chatService.createConversation();
    console.log("Conversation created:", conversation);

    console.log("Sending message...");
    const message = { content: "Help me create a workout plan" };
    const response = await chatService.sendMessage(conversation.id, message);
    console.log("AI response:", response);

    console.log("Getting conversation with messages...");
    const fullConversation = await chatService.getConversationById(
      conversation.id
    );
    console.log("Full conversation:", fullConversation);

    return { success: true, conversation: fullConversation };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error };
  }
}

/**
 * Test function to get all conversations
 */
export async function testGetAllConversations() {
  try {
    console.log("Getting all conversations...");
    const conversations = await chatService.getAllConversations();
    console.log("All conversations:", conversations);
    return { success: true, conversations };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error };
  }
}

/**
 * Test function to delete a conversation
 * @param conversationId The ID of the conversation to delete
 */
export async function testDeleteConversation(conversationId: string) {
  try {
    console.log(`Deleting conversation ${conversationId}...`);
    await chatService.deleteConversation(conversationId);
    console.log("Conversation deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Test failed:", error);
    return { success: false, error };
  }
}
