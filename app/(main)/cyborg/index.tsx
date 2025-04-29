import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeInDown,
} from "react-native-reanimated";
import * as ImagePicker from "expo-image-picker";

import { MessageType } from "@/types/cyborg";
import chatService from "@/api/chatService";
import { ChatConversation, ChatMessage } from "@/types/chat";

const { width, height } = Dimensions.get("window");

export default function CyborgScreen() {
  const insets = useSafeAreaInsets();
  const [question, setQuestion] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentConversation, setCurrentConversation] =
    useState<ChatConversation | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([
    {
      type: "cyborg",
      text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    },
  ]);

  // Pulse animation for the cyborg brain visualization
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

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
      const apiMessages: MessageType[] =
        fullConversation.messages?.map((msg: ChatMessage) => ({
          type: msg.role === "ai" ? "cyborg" : "user",
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        })) || [];

      setMessages(
        apiMessages.length > 0
          ? apiMessages
          : [
              {
                type: "cyborg",
                text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
                time: new Date().toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              },
            ]
      );

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
        // Try to get all conversations to check if we have an active one
        const conversations = await chatService.getAllConversations();
        let activeConv = conversations.find((conv) => conv.isActive);

        if (!activeConv) {
          // Create a new conversation if none exists or none is active
          const newConv = await chatService.createConversation();
          activeConv = newConv;
        } else if (activeConv.id && activeConv.messages?.length) {
          // If we have an active conversation with messages, load them
          const fullConversation = await chatService.getConversationById(
            activeConv.id
          );

          // Convert API messages to our UI message format
          const apiMessages: MessageType[] =
            fullConversation.messages?.map((msg: ChatMessage) => ({
              type: msg.role === "ai" ? "cyborg" : "user",
              text: msg.content,
              time: new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              }),
            })) || [];

          if (apiMessages.length > 0) {
            setMessages(apiMessages);
          }
        }

        // Only set the conversation if it exists
        if (activeConv) {
          setCurrentConversation(activeConv);
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

  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: pulseOpacity.value,
    };
  });

  const handleSendMessage = async () => {
    if (!question.trim()) return;

    // Create new user message for UI
    const newUserMessage: MessageType = {
      type: "user",
      text: question,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setQuestion("");
    setIsProcessing(true);

    try {
      // Ensure we have a conversation
      if (!currentConversation?.id) {
        const newConv = await chatService.createConversation();
        setCurrentConversation(newConv);
      }

      // Send message to API
      const response = await chatService.sendMessage(
        currentConversation?.id || "",
        { content: question }
      );

      // Add AI response to UI
      const newCyborgMessage: MessageType = {
        type: "cyborg",
        text: response.content,
        time: new Date(response.createdAt).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, newCyborgMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert(
        "Message Error",
        "Failed to send your message. Please try again."
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
        Alert.alert(
          "Permission Required",
          "Please allow access to your media library to upload videos."
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
        const newUserMessage: MessageType = {
          type: "user",
          text: "I've uploaded a video for analysis.",
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setIsProcessing(true);

        // In a real implementation, you would upload the video to your backend here
        // For now, we'll simulate an API response
        try {
          if (!currentConversation?.id) {
            const newConv = await chatService.createConversation();
            setCurrentConversation(newConv);
          }

          // Send message about video upload to API
          const response = await chatService.sendMessage(
            currentConversation?.id || "",
            { content: "I've uploaded a video for analysis." }
          );

          // Since this is a simulation, we'll provide a more detailed response than what might come from the API
          const videoAnalysisResponse: MessageType = {
            type: "cyborg",
            text: "I've analyzed your form in the video. Your squat depth is good, but try to keep your knees aligned with your toes. Also, maintain a neutral spine throughout the movement for better results and to prevent injury.",
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            }),
          };

          setMessages((prev) => [...prev, videoAnalysisResponse]);
        } catch (error) {
          console.error("Error processing video:", error);
          Alert.alert(
            "Video Processing Error",
            "Failed to process your video. Please try again."
          );

          // Remove the last user message if API call fails
          setMessages((prev) => prev.slice(0, -1));
        } finally {
          setIsProcessing(false);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload video. Please try again.");
      console.error("Video upload error:", error);
    }
  };

  // Create a new conversation
  const handleNewConversation = async () => {
    try {
      setIsProcessing(true);
      const newConv = await chatService.createConversation();
      setCurrentConversation(newConv);
      setMessages([
        {
          type: "cyborg",
          text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
          time: new Date().toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          }),
        },
      ]);
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
  const handleDeleteConversation = async (conversationId: string) => {
    try {
      // Confirm deletion with the user
      Alert.alert(
        "Delete Conversation",
        "Are you sure you want to delete this conversation? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
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
                  setMessages([
                    {
                      type: "cyborg",
                      text: "Hello, I'm your Cyborg AI Personal Trainer. How can I help you with your fitness journey today?",
                      time: new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      }),
                    },
                  ]);
                }
              } catch (error) {
                console.error("Error deleting conversation:", error);
                Alert.alert(
                  "Error",
                  "Failed to delete the conversation. Please try again."
                );
              } finally {
                setIsProcessing(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error in delete conversation flow:", error);
    }
  };

  React.useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Custom message bubble component - memoized to prevent re-renders
  const MessageBubble = React.memo(
    ({ message, index }: { message: MessageType; index: number }) => {
      const isCyborg = message.type === "cyborg";

      return (
        <Animated.View
          entering={FadeInDown.delay(index * 100).duration(400)}
          className={`mb-4 max-w-[85%] ${isCyborg ? "self-start" : "self-end"}`}
        >
          <View
            className={`rounded-2xl p-4 ${
              isCyborg
                ? "bg-dark-800 rounded-tl-none"
                : "bg-primary rounded-tr-none"
            }`}
          >
            <Text className={isCyborg ? "text-white" : "text-dark-900"}>
              {message.text}
            </Text>
          </View>
          <Text className="text-gray-500 text-xs mt-1 ml-1">
            {message.time}
          </Text>
        </Animated.View>
      );
    }
  );

  // Memoize the message list to prevent re-renders when typing
  const MemoizedMessageList = React.useMemo(() => {
    return messages.map((message, index) => (
      <MessageBubble
        key={`message-${index}-${message.time}`}
        message={message}
        index={index}
      />
    ));
  }, [messages]);

  // Memoize the typing indicator to prevent re-renders
  const TypingIndicator = React.useMemo(() => {
    if (!isProcessing) return null;

    return (
      <View className="self-start bg-dark-800 rounded-2xl rounded-tl-none p-4 mb-4">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse" />
          <View
            className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse"
            style={{ animationDelay: "0.2s" }}
          />
          <View
            className="w-2 h-2 bg-primary rounded-full mx-1 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          />
        </View>
      </View>
    );
  }, [isProcessing]);

  return (
    <View className="flex-1 bg-dark-900" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-2xl font-bold">Cyborg AI</Text>
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
            onPress={toggleSidebar}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Chat Button */}
      <View className="px-6 mb-4">
        <TouchableOpacity
          className="bg-dark-800 rounded-full py-3 px-4 flex-row items-center justify-center border border-dark-700"
          onPress={handleNewConversation}
        >
          <Ionicons name="add-circle-outline" size={20} color="#BBFD00" />
          <Text className="text-primary font-medium ml-2">New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Cyborg Brain Visualization */}
      <View className="w-full items-center justify-center py-2">
        <View className="relative w-20 h-20 items-center justify-center">
          <Animated.View
            style={pulseStyle}
            className="absolute w-20 h-20 rounded-full bg-primary opacity-30"
          />
          <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
            <Ionicons name="fitness" size={24} color="#121212" />
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {MemoizedMessageList}
        {TypingIndicator}
      </ScrollView>

      {/* Input Box */}
      <View
        className="flex-row items-center px-4 py-2 bg-dark-800 border-t border-dark-700"
        style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
      >
        <TouchableOpacity
          className="w-10 h-10 items-center justify-center"
          onPress={handleVideoUpload}
        >
          <Ionicons name="videocam-outline" size={24} color="#A0A0A0" />
        </TouchableOpacity>

        <TextInput
          className="flex-1 bg-dark-700 rounded-full px-4 py-2 mx-2 text-white"
          placeholder="Ask your Cyborg AI trainer..."
          placeholderTextColor="#A0A0A0"
          value={question}
          onChangeText={setQuestion}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSendMessage}
        />

        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center ${
            question.trim() ? "bg-primary" : "bg-dark-700"
          }`}
          onPress={handleSendMessage}
          disabled={!question.trim()}
        >
          <Ionicons
            name="arrow-up"
            size={20}
            color={question.trim() ? "#121212" : "#A0A0A0"}
          />
        </TouchableOpacity>
      </View>

      {/* Conversations Sidebar */}
      <Animated.View
        style={[
          sidebarAnimatedStyle,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "85%",
            backgroundColor: "#121212",
            zIndex: 999,
            borderLeftWidth: 1,
            borderLeftColor: "#333",
          },
        ]}
      >
        {/* Sidebar Header */}
        <View
          style={{ paddingTop: insets.top }}
          className="border-b border-dark-700 px-6 pt-6 pb-4"
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-white text-xl font-bold">
              Your Conversations
            </Text>
            <TouchableOpacity
              onPress={toggleSidebar}
              className="w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
            >
              <Ionicons name="close" size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Chat Button */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className="bg-dark-800 rounded-full py-3 px-4 flex-row items-center justify-center border border-dark-700"
            onPress={() => {
              handleNewConversation();
              toggleSidebar();
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#BBFD00" />
            <Text className="text-primary font-medium ml-2">New Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <ScrollView className="flex-1 px-3">
          {conversations.length === 0 ? (
            <View className="py-6 items-center justify-center">
              <Text className="text-gray-400 text-center">
                No past conversations yet
              </Text>
            </View>
          ) : (
            conversations.map((conversation) => (
              <View
                key={conversation.id}
                className="flex-row items-center mb-1"
              >
                <TouchableOpacity
                  className={`flex-row items-center flex-1 p-3 rounded-lg border-l-4 ${
                    currentConversation?.id === conversation.id
                      ? "bg-dark-700 border-primary"
                      : "bg-dark-800 border-dark-800"
                  }`}
                  onPress={() => selectConversation(conversation)}
                >
                  <View className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center mr-3">
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={20}
                      color="#BBFD00"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-medium" numberOfLines={1}>
                      {conversation.title || "Conversation"}
                    </Text>
                    <Text className="text-gray-400 text-xs" numberOfLines={1}>
                      {new Date(conversation.updatedAt).toLocaleString()}
                    </Text>
                  </View>
                  {conversation.isActive && (
                    <View className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className="p-3 ml-1 bg-dark-800 rounded-lg"
                  onPress={() => handleDeleteConversation(conversation.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4545" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Overlay for when sidebar is open */}
      {showSidebar && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </View>
  );
}
