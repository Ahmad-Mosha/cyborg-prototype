import React, { useState, useCallback, memo } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { Post as PostType, PostProps } from "@/types/community";
import Comment from "./Comment";

// Memoized Post Component to prevent unnecessary re-renders
const Post = memo(({ post, onLike }: PostProps) => {
  const { isDark } = useTheme();
  const [commentText, setCommentText] = useState("");
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  const toggleExpandComments = useCallback(() => {
    setIsCommentsExpanded((prev) => !prev);
  }, []);

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(500)}
      className={`mb-4 p-4 border rounded-3xl ${
        isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Post header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: post.user.avatar }}
          className="w-10 h-10 rounded-full"
        />
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text
              className={
                isDark ? "text-white font-bold" : "text-gray-900 font-bold"
              }
            >
              {post.user.name}
            </Text>
            {post.user.isVerified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#BBFD00"
                className="ml-1"
              />
            )}
          </View>
          <Text
            className={
              isDark ? "text-gray-400 text-xs" : "text-gray-500 text-xs"
            }
          >
            {post.time}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={isDark ? "white" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Post content */}
      <Text className={isDark ? "text-white mb-3" : "text-gray-800 mb-3"}>
        {post.content}
      </Text>

      {/* Post image if any */}
      {post.image && (
        <Image
          source={{ uri: post.image }}
          className="w-full h-48 rounded-2xl mb-3"
          resizeMode="cover"
        />
      )}

      {/* Post actions */}
      <View
        className={`flex-row items-center justify-between pt-2 border-t ${
          isDark ? "border-dark-700" : "border-gray-200"
        }`}
      >
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onLike(post.id)}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={post.isLiked ? "#F44336" : isDark ? "white" : "#333"}
          />
          <Text className={isDark ? "text-white ml-1" : "text-gray-800 ml-1"}>
            {post.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={toggleExpandComments}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? "white" : "#333"}
          />
          <Text className={isDark ? "text-white ml-1" : "text-gray-800 ml-1"}>
            {post.comments.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons
            name="share-social-outline"
            size={20}
            color={isDark ? "white" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Comments section */}
      {isCommentsExpanded && (
        <View className="mt-4">
          {post.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.id}
              onLike={(commentId) => onLike(post.id, commentId)}
              onReply={(commentId, content) =>
                onLike(post.id, commentId, content)
              }
            />
          ))}

          {/* Add comment input */}
          <View
            className={`flex-row items-center mt-3 p-2 rounded-full ${
              isDark ? "bg-dark-700" : "bg-gray-100"
            }`}
          >
            <TextInput
              className={`flex-1 px-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
              placeholder="Write a comment..."
              placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity
              onPress={() => {
                if (commentText.trim()) {
                  onLike(post.id, null, commentText);
                  setCommentText("");
                }
              }}
              disabled={!commentText.trim()}
              className={`p-2 rounded-full ${
                commentText.trim()
                  ? "bg-primary"
                  : isDark
                  ? "bg-dark-600"
                  : "bg-gray-300"
              }`}
            >
              <Ionicons
                name="send"
                size={18}
                color={isDark ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
});

export default Post;
