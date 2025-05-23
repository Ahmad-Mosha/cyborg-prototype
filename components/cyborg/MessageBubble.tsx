import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MessageType } from "@/types/cyborg";

interface MessageBubbleProps {
  message: MessageType;
  index: number;
  isDark?: boolean;
}

const MessageBubble = React.memo(
  ({ message, index, isDark = true }: MessageBubbleProps) => {
    const isCyborg = message.type === "cyborg";

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(400)}
        className={`mb-4 max-w-[85%] ${isCyborg ? "self-start" : "self-end"}`}
      >
        <View
          className={`rounded-2xl p-4 ${
            isCyborg
              ? isDark
                ? "bg-dark-800 rounded-tl-none"
                : "bg-light-200 rounded-tl-none shadow"
              : "bg-primary rounded-tr-none"
          }`}
        >
          <Text
            className={
              isCyborg
                ? isDark
                  ? "text-white"
                  : "text-dark-900"
                : "text-dark-900"
            }
          >
            {message.text}
          </Text>
        </View>
        <Text className="text-gray-500 text-xs mt-1 ml-1">{message.time}</Text>
      </Animated.View>
    );
  }
);

export default MessageBubble;
