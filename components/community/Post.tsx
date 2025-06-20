import React, { useState, memo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/contexts/ThemeContext";
import { PostProps, Comment as CommentType } from "@/types/community";
import { communityService } from "@/api/communityService";
import Comment from "./Comment";

// Helper function to format date
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

// Helper function to get initials
const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

const Post = memo(({ post, onLike, onComment }: PostProps) => {
  const { isDark } = useTheme();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(post.commentsCount);

  const authorName = `${post.author.firstName} ${post.author.lastName}`;
  const authorInitials = getInitials(
    post.author.firstName,
    post.author.lastName
  );
  const avatarUrl =
    post.author.profilePictureUrl ||
    `https://via.placeholder.com/100/121212/BBFD00?text=${authorInitials}`;

  // Update local comment count when post.commentsCount changes
  useEffect(() => {
    setLocalCommentsCount(post.commentsCount);
  }, [post.commentsCount]);

  // Load comments for the post
  const loadComments = useCallback(async () => {
    if (loadingComments) return;
    
    try {
      setLoadingComments(true);
      const commentsData = await communityService.getComments(post.id);
      setComments(commentsData);
    } catch (error) {
      console.error("Error loading comments:", error);
      Alert.alert("Error", "Failed to load comments");
    } finally {
      setLoadingComments(false);
    }
  }, [post.id, loadingComments]);

  // Toggle comments visibility
  const handleToggleComments = useCallback(() => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  }, [showComments, comments.length, loadComments]);

  // Handle adding a comment
  const handleAddComment = useCallback(async () => {
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const newComment = await communityService.createComment(post.id, {
        content: commentText.trim(),
      });
      
      // Add the new comment to the list and update local count
      setComments(prev => [...prev, newComment]);
      setLocalCommentsCount(prev => prev + 1);
      setCommentText("");
      
      // Call the parent callback to update post comment count
      onComment(post.id, commentText.trim());
    } catch (error) {
      console.error("Error adding comment:", error);
      Alert.alert("Error", "Failed to add comment");
      // Revert the local count increment on error
      setLocalCommentsCount(prev => prev - 1);
    } finally {
      setSubmittingComment(false);
    }
  }, [commentText, submittingComment, post.id, onComment]);

  // Handle liking a comment
  const handleLikeComment = useCallback(async (commentId: string) => {
    try {
      // Optimistic update
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            const wasLiked = comment.isLiked;
            return {
              ...comment,
              isLiked: !wasLiked,
              likesCount: wasLiked ? comment.likesCount - 1 : comment.likesCount + 1,
            };
          }
          return comment;
        })
      );

      // API call - backend returns { "liked": true/false }
      const result = await communityService.toggleLike('comments', commentId);
      
      // Update with actual server response
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: result.liked,
              // Keep the optimistic like count since backend doesn't return updated count
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error("Error toggling comment like:", error);
      // Revert optimistic update
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            const wasLiked = !comment.isLiked;
            return {
              ...comment,
              isLiked: !wasLiked,
              likesCount: wasLiked ? comment.likesCount - 1 : comment.likesCount + 1,
            };
          }
          return comment;
        })
      );
      Alert.alert("Error", "Failed to update like");
    }
  }, []);

  // Handle replying to a comment
  const handleReplyToComment = useCallback(async (commentId: string, content: string) => {
    try {
      const newReply = await communityService.createComment(post.id, {
        content,
        parentCommentId: commentId,
      });
      
      // Increment local comment count for replies too
      setLocalCommentsCount(prev => prev + 1);
      
      // Since backend might not return nested structure, we need to handle this differently
      // For now, let's just reload the comments to get the updated structure
      await loadComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      Alert.alert("Error", "Failed to add reply");
      // Revert the count increment on error
      setLocalCommentsCount(prev => prev - 1);
    }
  }, [post.id, loadComments]);

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      className={`rounded-3xl mb-4 p-4 border ${
        isDark ? "bg-dark-800 border-dark-700" : "bg-white border-gray-200"
      }`}
    >
      {/* Post Header */}
      <View className="flex-row items-center mb-3">
        <Image
          source={{ uri: avatarUrl }}
          className="w-12 h-12 rounded-full"
          defaultSource={{
            uri: `https://via.placeholder.com/100/121212/BBFD00?text=${authorInitials}`,
          }}
        />
        <View className="flex-1 ml-3">
          <View className="flex-row items-center">
            <Text
              className={
                isDark ? "text-white font-bold" : "text-gray-900 font-bold"
              }
            >
              {authorName}
            </Text>
            {post.author.isActive && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#BBFD00"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text
            className={
              isDark ? "text-gray-400 text-sm" : "text-gray-500 text-sm"
            }
          >
            {formatTime(post.createdAt)}
          </Text>
        </View>

        {/* Post type badge */}
        <View
          className={`px-3 py-1 rounded-full ${
            post.type === "question"
              ? "bg-blue-100"
              : post.type === "achievement"
              ? "bg-green-100"
              : post.type === "motivation"
              ? "bg-purple-100"
              : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              post.type === "question"
                ? "text-blue-600"
                : post.type === "achievement"
                ? "text-green-600"
                : post.type === "motivation"
                ? "text-purple-600"
                : "text-gray-600"
            }`}
          >
            {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
          </Text>
        </View>
      </View>

      {/* Post Content */}
      <View className="mb-4">
        <Text
          className={
            isDark
              ? "text-white text-lg font-semibold mb-2"
              : "text-gray-900 text-lg font-semibold mb-2"
          }
        >
          {post.title}
        </Text>
        <Text
          className={
            isDark ? "text-gray-300 leading-5" : "text-gray-700 leading-5"
          }
        >
          {post.content}
        </Text>
      </View>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View className="flex-row flex-wrap mb-4">
          {post.tags.map((tag, index) => (
            <View
              key={index}
              className={`px-3 py-1 rounded-full mr-2 mb-2 ${
                isDark ? "bg-dark-700" : "bg-gray-100"
              }`}
            >
              <Text
                className={
                  isDark ? "text-gray-300 text-xs" : "text-gray-600 text-xs"
                }
              >
                #{tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Post Actions */}
      <View className="flex-row items-center justify-between pt-3 border-t border-gray-200 dark:border-dark-700">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => onLike(post.id)}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={20}
            color={post.isLiked ? "#FF4B26" : isDark ? "#A0A0A0" : "#939393"}
          />
          <Text
            className={`ml-2 text-sm ${
              post.isLiked
                ? "text-primary font-semibold"
                : isDark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {post.likesCount > 0 ? `${post.likesCount} likes` : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center"
          onPress={handleToggleComments}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? "#A0A0A0" : "#939393"}
          />
          <Text
            className={
              isDark
                ? "text-gray-400 ml-2 text-sm"
                : "text-gray-500 ml-2 text-sm"
            }
          >
            {localCommentsCount > 0
              ? `${localCommentsCount} comments`
              : "Comment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Ionicons
            name="share-outline"
            size={20}
            color={isDark ? "#A0A0A0" : "#939393"}
          />
          <Text
            className={
              isDark
                ? "text-gray-400 ml-2 text-sm"
                : "text-gray-500 ml-2 text-sm"
            }
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comment Input */}
      <View
        className={`flex-row items-center mt-3 p-2 rounded-full ${
          isDark ? "bg-dark-700" : "bg-gray-100"
        }`}
      >
        <TextInput
          className={`flex-1 px-3 py-2 text-sm ${
            isDark ? "text-white" : "text-gray-800"
          }`}
          placeholder="Write a comment..."
          placeholderTextColor={isDark ? "#A0A0A0" : "#939393"}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          onPress={handleAddComment}
          disabled={!commentText.trim() || submittingComment}
          className={`p-2 rounded-full ml-2 ${
            commentText.trim() && !submittingComment
              ? "bg-primary"
              : isDark
              ? "bg-dark-600"
              : "bg-gray-300"
          }`}
        >
          {submittingComment ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name="send"
              size={16}
              color={isDark ? "black" : "white"}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {showComments && (
        <View className="mt-4">
          {loadingComments ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" color="#FF4B26" />
            </View>
          ) : (
            <View>
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  postId={post.id}
                  onLike={handleLikeComment}
                  onReply={handleReplyToComment}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
});

export default Post;
