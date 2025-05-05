import React, { useState, useEffect } from "react";
import { View, Alert, Dimensions } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

import { MessageType } from "@/types/cyborg";
import chatService from "@/api/chatService";
import { ChatConversation } from "@/types/chat";
import {
  ChatHeader,
  ChatInput,
  ChatMessages,
  ConversationsSidebar,
  CyborgBrainVisualization,
} from "@/components/cyborg";
import { showAlert, destructiveAlert } from "@/utils/AlertUtil";

const { width } = Dimensions.get("window");

export default function CyborgScreen() {
  const { isDark } = useTheme();
  const [question, setQuestion] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([
    chatService.getWelcomeMessage(),
  ]);

  // Sidebar animation
  const sidebarTranslateX = useSharedValue(width);

  // Sidebar animation style
  const sidebarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: sidebarTranslateX.value }],
    };
  });

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    const isVisible = !showSidebar;
    sidebarTranslateX.value = withTiming(isVisible ? 0 : width, {
      duration: 300,
    });
    setShowSidebar(isVisible);
  };

  // Load all conversations
  const loadConversations = async () => {
    try {
      const allConversations = await chatService.getAllConversations();
      setConversations(allConversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  // Load conversations when opening the sidebar
  useEffect(() => {
    if (showSidebar) {
      loadConversations();
    }
  }, [showSidebar]);

  // Select a conversation from the sidebar
  const selectConversation = async (conversation: ChatConversation) => {
    try {
      setIsProcessing(true);

      // Get full conversation with messages
      const fullConversation = await chatService.getConversationById(
        conversation.id
      );

      // Convert API messages to UI format
      const apiMessages = fullConversation.messages?.length
        ? chatService.convertToUiMessages(fullConversation.messages)
        : [chatService.getWelcomeMessage()];

      setMessages(apiMessages);
      setCurrentConversation(fullConversation);
      toggleSidebar(); // Close sidebar after selection
    } catch (error) {
      console.error("Error loading conversation:", error);
      Alert.alert("Error", "Failed to load conversation. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize chat conversation or load existing one
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const { conversation, messages: initialMessages } =
          await chatService.initializeConversation();

        if (conversation) {
          setCurrentConversation(conversation);
        }

        if (initialMessages.length > 0) {
          setMessages(initialMessages);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        Alert.alert(
          "Connection Error",
          "Could not connect to Cyborg AI. Please try again later."
        );
      }
    };

    initializeChat();
  }, []);

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    // Create new user message for UI
    const newUserMessage = chatService.createUserMessage(question);
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setQuestion("");
    setIsProcessing(true);

    try {
      // Send message and get response using chatService
      const { conversation, aiMessage } = await chatService.sendChatMessage(
        currentConversation?.id,
        question
      );

      // Update current conversation if needed
      if (!currentConversation?.id) {
        setCurrentConversation(conversation);
      }

      // Add AI response to messages
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      showAlert(
        "Message Error",
        "Failed to send your message. Please try again.",
        [],
        "alert-circle",
        "#FF4757"
      );

      // Remove the last user message if API call fails
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVideoUpload = async () => {
    try {
      // Request permission for accessing media library
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        showAlert(
          "Permission Required",
          "Please allow access to your media library to upload videos.",
          [],
          "information-circle",
          "#2196F3"
        );
        return;
      }

      // Launch video picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedVideo = result.assets[0];

        // Add a user message indicating video upload
        const newUserMessage = chatService.createUserMessage(
          "I've uploaded a video for analysis."
        );
        setMessages((prev) => [...prev, newUserMessage]);
        setIsProcessing(true);

        try {
          // Process the video using chatService
          const { conversation, aiMessage } =
            await chatService.processVideoUpload(currentConversation?.id);

          // Update current conversation if needed
          if (!currentConversation?.id) {
            setCurrentConversation(conversation);
          }

          // Add AI analysis response to messages
          setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
          console.error("Error processing video:", error);
          showAlert(
            "Video Processing Error",
            "Failed to process your video. Please try again.",
            [],
            "alert-circle",
            "#FF4757"
          );

          // Remove the last user message if API call fails
          setMessages((prev) => prev.slice(0, -1));
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      showAlert(
        "Upload Failed",
        "There was a problem uploading your video. Please try again.",
        [],
        "alert-circle",
        "#FF4757"
      );
    }
  };

  // Create a new conversation
  const handleNewConversation = async () => {
    try {
      setIsProcessing(true);
      const newConv = await chatService.createConversation();
      setCurrentConversation(newConv);
      setMessages([chatService.getWelcomeMessage()]);
    } catch (error) {
      console.error("Error creating new conversation:", error);
      Alert.alert(
        "Error",
        "Failed to create a new conversation. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle conversation deletion
  const handleDeleteConversation = (conversationId: string) => {
    try {
      destructiveAlert(
        "Delete Conversation",
        "Are you sure you want to delete this conversation? This action cannot be undone.",
        async () => {
          setIsProcessing(true);

          try {
            // Call the API to delete the conversation
            await chatService.deleteConversation(conversationId);

            // Remove the conversation from the UI state
            setConversations((prevConversations) =>
              prevConversations.filter((conv) => conv.id !== conversationId)
            );

            // If the deleted conversation was the current one, create a new one
            if (currentConversation?.id === conversationId) {
              const newConv = await chatService.createConversation();
              setCurrentConversation(newConv);
              setMessages([chatService.getWelcomeMessage()]);
            }
          } catch (error) {
            console.error("Error deleting conversation:", error);
            showAlert(
              "Error",
              "Failed to delete the conversation. Please try again.",
              [],
              "alert-circle",
              "#FF4757"
            );
          } finally {
            setIsProcessing(false);
          }
        }
      );
    } catch (error) {
      console.error("Error in delete conversation flow:", error);
    }
  };

  return (
    <View
      className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}
      style={{ paddingBottom: 80 }}
    >
      {/* Header */}
      <ChatHeader
        onMenuPress={toggleSidebar}
        onNewChatPress={handleNewConversation}
        isDark={isDark}
      />

      {/* Cyborg Brain Visualization */}
      <CyborgBrainVisualization isDark={isDark} />

      {/* Chat Messages */}
      <ChatMessages
        messages={messages}
        isProcessing={isProcessing}
        isDark={isDark}
      />

      {/* Input Box */}
      <ChatInput
        question={question}
        setQuestion={setQuestion}
        onSend={handleSendMessage}
        onVideoUpload={handleVideoUpload}
        isDark={isDark}
      />

      {/* Conversations Sidebar */}
      <ConversationsSidebar
        visible={showSidebar}
        sidebarAnimatedStyle={sidebarAnimatedStyle}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onClose={toggleSidebar}
        onNewChat={handleNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={handleDeleteConversation}
        isDark={isDark}
      />
    </View>
  );
}
