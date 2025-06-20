import React, { useState, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { CreatePostData } from "@/types/community";

interface NewPostInputProps {
  onAddPost: (postData: CreatePostData) => void;
}

const POST_TYPES = [
  { value: "general", label: "General", icon: "chatbubble", color: "#6B7280" },
  {
    value: "question",
    label: "Question",
    icon: "help-circle",
    color: "#3B82F6",
  },
  {
    value: "achievement",
    label: "Achievement",
    icon: "trophy",
    color: "#10B981",
  },
  { value: "motivation", label: "Motivation", icon: "flame", color: "#8B5CF6" },
] as const;

const NewPostInput = memo(({ onAddPost }: NewPostInputProps) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<
    "general" | "question" | "achievement" | "motivation"
  >("general");
  const [tags, setTags] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const selectedType = POST_TYPES.find((type) => type.value === postType);

  const handleSubmit = useCallback(() => {
    if (!title.trim() || !content.trim()) return;

    const postData: CreatePostData = {
      title: title.trim(),
      content: content.trim(),
      type: postType,
      tags: tags.trim()
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
      attachments: [],
    };

    onAddPost(postData);
    setTitle("");
    setContent("");
    setTags("");
    setPostType("general");
    setShowModal(false);
    Keyboard.dismiss();
  }, [title, content, postType, tags, onAddPost]);

  const handleTypeSelect = useCallback((type: typeof postType) => {
    setPostType(type);
    setShowTypeSelector(false);
  }, []);

  return (
    <>
      {/* Quick Post Input */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(500)}
        className={`rounded-3xl mb-6 p-4 border ${
          isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200"
        }`}
      >
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="flex-row items-center"
        >
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
          <Text
            className={`flex-1 ml-3 px-4 py-3 rounded-full ${
              isDark ? "bg-dark-700 text-gray-400" : "bg-gray-100 text-gray-500"
            }`}
          >
            Share your fitness journey...
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Full Post Creation Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-white"}>
          {/* Modal Header */}
          <View
            className={`flex-row items-center justify-between p-4 border-b ${
              isDark ? "border-dark-700" : "border-gray-200"
            }`}
          >
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text className={isDark ? "text-gray-400" : "text-gray-600"}>
                Cancel
              </Text>
            </TouchableOpacity>
            <Text
              className={
                isDark
                  ? "text-white text-lg font-bold"
                  : "text-gray-900 text-lg font-bold"
              }
            >
              Create Post
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className={`px-4 py-2 rounded-full ${
                title.trim() && content.trim()
                  ? "bg-primary"
                  : isDark
                  ? "bg-dark-600"
                  : "bg-gray-300"
              }`}
            >
              <Text
                className={`font-bold ${
                  title.trim() && content.trim()
                    ? "text-white"
                    : isDark
                    ? "text-gray-500"
                    : "text-gray-400"
                }`}
              >
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {/* Post Type Selector */}
            <TouchableOpacity
              onPress={() => setShowTypeSelector(true)}
              className={`flex-row items-center justify-between p-4 rounded-2xl mb-4 ${
                isDark ? "bg-dark-800" : "bg-gray-50"
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={selectedType?.icon as any}
                  size={20}
                  color={selectedType?.color}
                />
                <Text
                  className={`ml-3 font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {selectedType?.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-down"
                size={16}
                color={isDark ? "#A0A0A0" : "#939393"}
              />
            </TouchableOpacity>

            {/* Title Input */}
            <View className="mb-4">
              <Text
                className={`mb-2 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Title
              </Text>
              <TextInput
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-dark-800 border-dark-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="Enter post title..."
                placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
                value={title}
                onChangeText={setTitle}
                maxLength={200}
              />
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text
                className={`mb-2 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Content
              </Text>
              <TextInput
                className={`p-4 rounded-2xl border h-32 ${
                  isDark
                    ? "bg-dark-800 border-dark-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="Share your thoughts..."
                placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
                multiline
                textAlignVertical="top"
                value={content}
                onChangeText={setContent}
                maxLength={2000}
              />
            </View>

            {/* Tags Input */}
            <View className="mb-4">
              <Text
                className={`mb-2 font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tags (optional)
              </Text>
              <TextInput
                className={`p-4 rounded-2xl border ${
                  isDark
                    ? "bg-dark-800 border-dark-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
                placeholder="fitness, workout, nutrition (comma separated)"
                placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
                value={tags}
                onChangeText={setTags}
              />
            </View>
          </ScrollView>
        </View>

        {/* Post Type Selection Modal */}
        <Modal visible={showTypeSelector} animationType="fade" transparent>
          <View className="flex-1 bg-black/50 justify-center items-center p-4">
            <View
              className={`w-full max-w-sm rounded-3xl p-6 ${
                isDark ? "bg-dark-800" : "bg-white"
              }`}
            >
              <Text
                className={`text-center text-lg font-bold mb-4 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Select Post Type
              </Text>

              {POST_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => handleTypeSelect(type.value)}
                  className={`flex-row items-center p-4 rounded-2xl mb-2 ${
                    postType === type.value
                      ? "bg-primary/20"
                      : isDark
                      ? "bg-dark-700"
                      : "bg-gray-50"
                  }`}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={type.color}
                  />
                  <Text
                    className={`ml-3 font-medium ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {type.label}
                  </Text>
                  {postType === type.value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color="#FF4B26"
                      style={{ marginLeft: "auto" }}
                    />
                  )}
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={() => setShowTypeSelector(false)}
                className="mt-4 p-3 rounded-2xl bg-gray-200 dark:bg-dark-700"
              >
                <Text
                  className={`text-center font-medium ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Modal>
    </>
  );
});

export default NewPostInput;
