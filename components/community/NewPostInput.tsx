import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";

interface NewPostInputProps {
  onAddPost: (text: string) => void;
}

const NewPostInput = memo(({ onAddPost }: NewPostInputProps) => {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState("");

  const handleSubmit = useCallback(() => {
    if (inputText.trim()) {
      onAddPost(inputText);
      setInputText("");
      Keyboard.dismiss();
    }
  }, [inputText, onAddPost]);

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      className={`rounded-3xl mb-6 p-4 border ${
        isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200"
      }`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isDark ? "bg-dark-700" : "bg-gray-100"
          }`}
        >
          <Ionicons
            name="person"
            size={18}
            color={isDark ? "#A0A0A0" : "#939393"}
          />
        </View>
        <TextInput
          className={`flex-1 ml-3 px-4 py-3 rounded-full ${
            isDark ? "bg-dark-700 text-white" : "bg-gray-100 text-gray-800"
          }`}
          placeholder="Share your fitness journey..."
          placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
      </View>

      <View className="flex-row justify-end mt-4">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${
            inputText.trim()
              ? "bg-primary"
              : isDark
              ? "bg-dark-600"
              : "bg-gray-300"
          }`}
          disabled={!inputText.trim()}
          onPress={handleSubmit}
        >
          <Text
            className={`font-bold ${isDark ? "text-dark-900" : "text-white"}`}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

export default NewPostInput;
