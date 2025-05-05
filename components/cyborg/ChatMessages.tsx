import React, { useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { MessageType } from "@/types/cyborg";
import MessageBubble from "./MessageBubble";

interface ChatMessagesProps {
  messages: MessageType[];
  isProcessing: boolean;
  isDark?: boolean;
}

const ChatMessages = ({
  messages,
  isProcessing,
  isDark = true,
}: ChatMessagesProps) => {
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Memoize the message list to prevent re-renders when typing
  const MemoizedMessageList = React.useMemo(() => {
    return messages.map((message, index) => (
      <MessageBubble
        key={`message-${index}-${message.time}`}
        message={message}
        index={index}
        isDark={isDark}
      />
    ));
  }, [messages, isDark]);

  // Memoize the typing indicator to prevent re-renders
  const TypingIndicator = React.useMemo(() => {
    if (!isProcessing) return null;

    return (
      <View
        className={
          isDark
            ? "self-start bg-dark-800 rounded-2xl rounded-tl-none p-4 mb-4"
            : "self-start bg-light-200 rounded-2xl rounded-tl-none p-4 mb-4 shadow"
        }
      >
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
  }, [isProcessing, isDark]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1 px-6"
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {MemoizedMessageList}
      {TypingIndicator}
    </ScrollView>
  );
};

export default ChatMessages;
