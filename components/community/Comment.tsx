import React, { useState, memo } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { CommentProps } from "@/types/community";

// Memoized Comment Component
const Comment = memo(({ comment, postId, onLike, onReply }: CommentProps) => {
  const { isDark } = useTheme();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);

  return (
    <View
      className={`mb-3 pb-2 ${
        comment.replies && comment.replies.length > 0 && !showReplies
          ? "border-b"
          : ""
      } ${isDark ? "border-dark-700" : "border-gray-200"}`}
    >
      <View className="flex-row mt-2">
        <Image
          source={{ uri: comment.user.avatar }}
          className="w-8 h-8 rounded-full"
        />
        <View className="flex-1 ml-2">
          <View
            className={`p-3 rounded-2xl ${
              isDark ? "bg-dark-700" : "bg-gray-100"
            }`}
          >
            <View className="flex-row items-center">
              <Text
                className={
                  isDark ? "text-white font-bold" : "text-gray-900 font-bold"
                }
              >
                {comment.user.name}
              </Text>
              {comment.user.isVerified && (
                <Ionicons
                  name="checkmark-circle"
                  size={14}
                  color="#BBFD00"
                  className="ml-1"
                />
              )}
            </View>
            <Text className={isDark ? "text-white mt-1" : "text-gray-800 mt-1"}>
              {comment.content}
            </Text>
          </View>

          {/* Comment actions */}
          <View className="flex-row items-center mt-1">
            <Text
              className={
                isDark ? "text-gray-400 text-xs" : "text-gray-500 text-xs"
              }
            >
              {comment.time}
            </Text>
            <TouchableOpacity
              className="ml-3 flex-row items-center"
              onPress={() => onLike(comment.id)}
            >
              <Text
                className={
                  comment.isLiked
                    ? "text-primary font-semibold text-xs"
                    : isDark
                    ? "text-gray-400 text-xs"
                    : "text-gray-500 text-xs"
                }
              >
                Like
              </Text>
              {comment.likes > 0 && (
                <Text
                  className={
                    isDark
                      ? "text-gray-400 text-xs ml-1"
                      : "text-gray-500 text-xs ml-1"
                  }
                >
                  ({comment.likes})
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-3"
              onPress={() => setShowReplyInput(!showReplyInput)}
            >
              <Text
                className={
                  isDark ? "text-gray-400 text-xs" : "text-gray-500 text-xs"
                }
              >
                Reply
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reply input */}
          {showReplyInput && (
            <View
              className={`flex-row items-center mt-2 p-1 rounded-full ${
                isDark ? "bg-dark-700" : "bg-gray-100"
              }`}
            >
              <TextInput
                className={`flex-1 px-3 text-sm ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
                placeholder="Write a reply..."
                placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
                value={replyContent}
                onChangeText={setReplyContent}
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  onReply(comment.id, replyContent);
                  setReplyContent("");
                  setShowReplyInput(false);
                }}
                disabled={!replyContent.trim()}
                className={`p-1 rounded-full ${
                  replyContent.trim()
                    ? "bg-primary"
                    : isDark
                    ? "bg-dark-600"
                    : "bg-gray-300"
                }`}
              >
                <Ionicons
                  name="send"
                  size={16}
                  color={isDark ? "black" : "white"}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Show replies toggle */}
          {comment.replies && comment.replies.length > 0 && (
            <TouchableOpacity
              className="mt-1"
              onPress={() => setShowReplies(!showReplies)}
            >
              <Text className="text-primary text-xs font-medium">
                {showReplies
                  ? "Hide replies"
                  : `View ${comment.replies.length} ${
                      comment.replies.length === 1 ? "reply" : "replies"
                    }`}
              </Text>
            </TouchableOpacity>
          )}

          {/* Replies */}
          {showReplies && comment.replies && comment.replies.length > 0 && (
            <View className="mt-2">
              {comment.replies.map((reply) => (
                <View key={reply.id} className="flex-row mt-2">
                  <Image
                    source={{ uri: reply.user.avatar }}
                    className="w-6 h-6 rounded-full"
                  />
                  <View className="flex-1 ml-2">
                    <View
                      className={`p-2 rounded-2xl ${
                        isDark ? "bg-dark-700" : "bg-gray-100"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <Text
                          className={
                            isDark
                              ? "text-white font-bold text-xs"
                              : "text-gray-900 font-bold text-xs"
                          }
                        >
                          {reply.user.name}
                        </Text>
                        {reply.user.isVerified && (
                          <Ionicons
                            name="checkmark-circle"
                            size={12}
                            color="#BBFD00"
                            className="ml-1"
                          />
                        )}
                      </View>
                      <Text
                        className={
                          isDark
                            ? "text-white text-xs mt-1"
                            : "text-gray-800 text-xs mt-1"
                        }
                      >
                        {reply.content}
                      </Text>
                    </View>

                    {/* Reply actions */}
                    <View className="flex-row items-center mt-1">
                      <Text
                        className={
                          isDark
                            ? "text-gray-400 text-xs"
                            : "text-gray-500 text-xs"
                        }
                      >
                        {reply.time}
                      </Text>
                      <TouchableOpacity
                        className="ml-3 flex-row items-center"
                        onPress={() => onLike(reply.id, true, comment.id)}
                      >
                        <Text
                          className={
                            reply.isLiked
                              ? "text-primary font-semibold text-xs"
                              : isDark
                              ? "text-gray-400 text-xs"
                              : "text-gray-500 text-xs"
                          }
                        >
                          Like
                        </Text>
                        {reply.likes > 0 && (
                          <Text
                            className={
                              isDark
                                ? "text-gray-400 text-xs ml-1"
                                : "text-gray-500 text-xs ml-1"
                            }
                          >
                            ({reply.likes})
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

export default Comment;
