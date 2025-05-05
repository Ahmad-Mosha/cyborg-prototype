import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ChatHeaderProps {
  onMenuPress: () => void;
  onNewChatPress: () => void;
  isDark?: boolean;
}

const ChatHeader = ({
  onMenuPress,
  onNewChatPress,
  isDark = true,
}: ChatHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Header */}
      <View style={{ paddingTop: insets.top + 30 }} className="px-6 pt-6 pb-4">
        <View className="flex-row justify-between items-center">
          <Text
            className={
              isDark
                ? "text-white text-2xl font-bold"
                : "text-dark-900 text-2xl font-bold"
            }
          >
            Cyborg AI
          </Text>
          <TouchableOpacity
            className={
              isDark
                ? "w-10 h-10 rounded-full bg-dark-800 items-center justify-center"
                : "w-10 h-10 rounded-full bg-light-200 items-center justify-center"
            }
            onPress={onMenuPress}
          >
            <Ionicons
              name="ellipsis-horizontal"
              size={22}
              color={isDark ? "white" : "#121212"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Chat Button */}
      <View className="px-6 mb-4">
        <TouchableOpacity
          className={
            isDark
              ? "bg-dark-800 rounded-full py-3 px-4 flex-row items-center justify-center border border-dark-700"
              : "bg-white rounded-full py-3 px-4 flex-row items-center justify-center border border-light-300 shadow"
          }
          onPress={onNewChatPress}
        >
          <Ionicons name="add-circle-outline" size={20} color="#BBFD00" />
          <Text className="text-primary font-medium ml-2">New Chat</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChatHeader;
