import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

import { Post as PostType, CreatePostData } from "@/types/community";
import { communityService } from "@/api/communityService";

// Import our custom components
import { Header, Post, NewPostInput } from "@/components/community";

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Load posts from API
  const loadPosts = useCallback(
    async (pageNum: number = 1, refresh: boolean = false) => {
      if (loading && !refresh) return;

      try {
        setLoading(true);
        const response = await communityService.getPosts({
          page: pageNum,
          limit: 10,
          status: "published",
        });

        if (refresh) {
          setPosts(response.items);
        } else {
          setPosts((prev) => [...prev, ...response.items]);
        }

        setPage(pageNum);
        setTotalPages(response.totalPages);
        setHasMore(pageNum < response.totalPages);
      } catch (error) {
        console.error("Error loading posts:", error);
        Alert.alert("Error", "Failed to load posts");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading]
  );

  // Initial load
  useEffect(() => {
    loadPosts(1, true);
  }, []);

  // Refresh posts
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPosts(1, true);
  }, [loadPosts]);

  // Load more posts
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadPosts(page + 1, false);
    }
  }, [hasMore, loading, page, loadPosts]);

  // Handle liking a post
  const handleLikePost = useCallback(async (postId: string) => {
    try {
      // Optimistic update
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const wasLiked = post.isLiked;
            return {
              ...post,
              isLiked: !wasLiked,
              likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        })
      );

      // API call - backend returns { "liked": true/false }
      const result = await communityService.toggleLike("posts", postId);
      
      // Update with actual server response
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: result.liked,
              // Keep the optimistic like count since backend doesn't return updated count
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert optimistic update on error
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const wasLiked = !post.isLiked; // Revert
            return {
              ...post,
              isLiked: !wasLiked,
              likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
            };
          }
          return post;
        })
      );
      Alert.alert("Error", "Failed to update like");
    }
  }, []);

  // Handle adding a comment
  const handleAddComment = useCallback(
    async (postId: string, content: string, parentCommentId?: string) => {
      try {
        await communityService.createComment(postId, {
          content,
          parentCommentId,
        });

        // Refresh the specific post or reload comments
        // For now, we'll just increment the comment count
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: post.commentsCount + 1,
              };
            }
            return post;
          })
        );

        Alert.alert("Success", "Comment added successfully");
      } catch (error) {
        console.error("Error adding comment:", error);
        Alert.alert("Error", "Failed to add comment");
      }
    },
    []
  );  // Handle adding a new post
  const handleAddPost = useCallback(async (postData: CreatePostData) => {
    try {
      const newPost = await communityService.createPost(postData);
      
      // Add the new post to the beginning of the list
      setPosts((prev) => [newPost, ...prev]);
      Alert.alert("Success", "Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post");
    }
  }, []);

  // Memoized posts list to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <Post
        key={post.id}
        post={post}
        onLike={handleLikePost}
        onComment={handleAddComment}
      />
    ));
  }, [posts, handleLikePost, handleAddComment]);

  // Render loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#FF4B26" />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{
        backgroundColor: isDark ? "#121212" : "#F5F5F5",
      }}
    >
      {/* Header */}
      <Header toggleTheme={toggleTheme} />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 80,
          paddingHorizontal: 16,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#FF4B26"]}
            tintColor="#FF4B26"
          />
        }
        onMomentumScrollEnd={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            handleLoadMore();
          }
        }}
      >
        {/* New post input */}
        <NewPostInput onAddPost={handleAddPost} />

        {/* Feed posts */}
        {posts.length === 0 && !loading ? (
          <View
            className={`items-center py-12 ${
              isDark ? "bg-dark-800" : "bg-white"
            } rounded-3xl`}
          >
            <Text
              className={`text-lg font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome to the Community!
            </Text>
            <Text
              className={`text-center px-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Be the first to share your fitness journey. Create a post above to
              get started.
            </Text>
          </View>
        ) : (
          renderedPosts
        )}

        {/* Loading footer */}
        {renderFooter()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
