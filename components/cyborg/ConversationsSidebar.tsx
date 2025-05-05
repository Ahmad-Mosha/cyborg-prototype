import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { ChatConversation } from "@/types/chat";

interface ConversationsSidebarProps {
  visible: boolean;
  sidebarAnimatedStyle: any;
  conversations: ChatConversation[];
  currentConversationId?: string;
  onClose: () => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: ChatConversation) => void;
  onDeleteConversation: (id: string) => void;
  isDark?: boolean;
}

const ConversationsSidebar = ({
  visible,
  sidebarAnimatedStyle,
  conversations,
  currentConversationId,
  onClose,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isDark = true,
}: ConversationsSidebarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Sidebar */}
      <Animated.View
        style={[
          sidebarAnimatedStyle,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: "85%",
            backgroundColor: isDark ? "#121212" : "#FFFFFF",
            zIndex: 999,
            borderLeftWidth: 1,
            borderLeftColor: isDark ? "#333" : "#e0e0e0",
          },
        ]}
      >
        {/* Sidebar Header */}
        <View
          style={{ paddingTop: insets.top }}
          className={
            isDark
              ? "border-b border-dark-700 px-6 pt-6 pb-4"
              : "border-b border-light-300 px-6 pt-6 pb-4"
          }
        >
          <View className="flex-row justify-between items-center">
            <Text
              className={
                isDark
                  ? "text-white text-xl font-bold"
                  : "text-dark-900 text-xl font-bold"
              }
            >
              Your Conversations
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className={
                isDark
                  ? "w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
                  : "w-10 h-10 rounded-full bg-light-200 items-center justify-center"
              }
            >
              <Ionicons
                name="close"
                size={22}
                color={isDark ? "white" : "#121212"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Chat Button */}
        <View className="px-6 py-4">
          <TouchableOpacity
            className={
              isDark
                ? "bg-dark-800 rounded-full py-3 px-4 flex-row items-center justify-center border border-dark-700"
                : "bg-white rounded-full py-3 px-4 flex-row items-center justify-center border border-light-300 shadow"
            }
            onPress={() => {
              onNewChat();
              onClose();
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
              <Text
                className={
                  isDark
                    ? "text-gray-400 text-center"
                    : "text-gray-500 text-center"
                }
              >
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
                    currentConversationId === conversation.id
                      ? isDark
                        ? "bg-dark-700 border-primary"
                        : "bg-light-200 border-primary"
                      : isDark
                      ? "bg-dark-800 border-dark-800"
                      : "bg-white border-white"
                  }`}
                  onPress={() => onSelectConversation(conversation)}
                >
                  <View
                    className={
                      isDark
                        ? "w-10 h-10 rounded-full bg-dark-700 items-center justify-center mr-3"
                        : "w-10 h-10 rounded-full bg-light-300 items-center justify-center mr-3"
                    }
                  >
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={20}
                      color="#BBFD00"
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={
                        isDark
                          ? "text-white font-medium"
                          : "text-dark-900 font-medium"
                      }
                      numberOfLines={1}
                    >
                      {conversation.title || "Conversation"}
                    </Text>
                    <Text
                      className={
                        isDark
                          ? "text-gray-400 text-xs"
                          : "text-gray-500 text-xs"
                      }
                      numberOfLines={1}
                    >
                      {new Date(conversation.updatedAt).toLocaleString()}
                    </Text>
                  </View>
                  {conversation.isActive && (
                    <View className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  className={
                    isDark
                      ? "p-3 ml-1 bg-dark-800 rounded-lg"
                      : "p-3 ml-1 bg-white rounded-lg shadow"
                  }
                  onPress={() => onDeleteConversation(conversation.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FF4545" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* Overlay for when sidebar is open */}
      {visible && (
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
          onPress={onClose}
        />
      )}
    </>
  );
};

export default ConversationsSidebar;
