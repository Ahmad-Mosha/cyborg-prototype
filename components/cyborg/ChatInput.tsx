import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  question: string;
  setQuestion: (text: string) => void;
  onSend: () => void;
  onVideoUpload: () => void;
}

const ChatInput = ({
  question,
  setQuestion,
  onSend,
  onVideoUpload,
}: ChatInputProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row items-center px-4 py-2 bg-dark-800 border-t border-dark-700"
      style={{ paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }}
    >
      <TouchableOpacity
        className="w-10 h-10 items-center justify-center"
        onPress={onVideoUpload}
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
        onSubmitEditing={onSend}
      />

      <TouchableOpacity
        className={`w-10 h-10 rounded-full items-center justify-center ${
          question.trim() ? "bg-primary" : "bg-dark-700"
        }`}
        onPress={onSend}
        disabled={!question.trim()}
      >
        <Ionicons
          name="arrow-up"
          size={20}
          color={question.trim() ? "#121212" : "#A0A0A0"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
