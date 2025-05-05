import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

import { Post as PostType, Comment as CommentType } from "@/types/community";

// Import our custom components
import { Header, Post, NewPostInput } from "@/components/community";

export default function CommunityScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const [posts, setPosts] = useState<PostType[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=SJ",
        isVerified: true,
      },
      time: "1h ago",
      content:
        "Just smashed my deadlift PR! 💪 The Cyborg workout program is really working for me after just 3 weeks. Anyone else seeing rapid gains?",
      likes: 48,
      isLiked: true,
      comments: [
        {
          id: "c1",
          user: {
            name: "Mike Torres",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=MT",
            isVerified: false,
          },
          time: "45m ago",
          content: "Awesome! What's your new PR?",
          likes: 5,
          isLiked: false,
          replies: [],
        },
        {
          id: "c2",
          user: {
            name: "Emma Wilson",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=EW",
            isVerified: true,
          },
          time: "30m ago",
          content: "Same here! My squat PR went up by 15lbs in just a month.",
          likes: 7,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "2",
      user: {
        name: "Mike Torres",
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=MT",
        isVerified: false,
      },
      time: "3h ago",
      content:
        "Morning HIIT session complete! Cyborg suggested adding mountain climbers and it destroyed me in the best way 🔥 Anyone have recommendations for post-workout recovery?",
      likes: 32,
      isLiked: false,
      comments: [
        {
          id: "c3",
          user: {
            name: "Sarah Johnson",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=SJ",
            isVerified: true,
          },
          time: "2h ago",
          content:
            "I've been using the recovery protocol in the app - works wonders!",
          likes: 4,
          isLiked: false,
          replies: [
            {
              id: "r1",
              user: {
                name: "Mike Torres",
                avatar: "https://via.placeholder.com/100/121212/BBFD00?text=MT",
                isVerified: false,
              },
              time: "1h ago",
              content: "Thanks! I'll check it out right away.",
              likes: 1,
              isLiked: false,
            },
          ],
        },
      ],
    },
    {
      id: "3",
      user: {
        name: "Emma Wilson",
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=EW",
        isVerified: true,
      },
      time: "5h ago",
      content:
        "Day 30 of the Cyborg Transformation Challenge! Before and after pics - can't believe the difference. The diet plan was key for me, especially the high protein breakfast options.",
      likes: 157,
      isLiked: true,
      comments: [
        {
          id: "c4",
          user: {
            name: "Sarah Johnson",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=SJ",
            isVerified: true,
          },
          time: "4h ago",
          content:
            "Wow! The results are incredible. Which breakfast option was your favorite?",
          likes: 12,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "4",
      user: {
        name: "Emma Wilson",
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=EW",
        isVerified: true,
      },
      time: "5h ago",
      content:
        "Day 30 of the Cyborg Transformation Challenge! Before and after pics - can't believe the difference. The diet plan was key for me, especially the high protein breakfast options.",
      likes: 157,
      isLiked: true,
      comments: [
        {
          id: "c4",
          user: {
            name: "Sarah Johnson",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=SJ",
            isVerified: true,
          },
          time: "4h ago",
          content:
            "Wow! The results are incredible. Which breakfast option was your favorite?",
          likes: 12,
          isLiked: true,
          replies: [],
        },
      ],
    },
    {
      id: "5",
      user: {
        name: "Emma Wilson",
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=EW",
        isVerified: true,
      },
      time: "5h ago",
      content:
        "Day 30 of the Cyborg Transformation Challenge! Before and after pics - can't believe the difference. The diet plan was key for me, especially the high protein breakfast options.",
      likes: 157,
      isLiked: true,
      comments: [
        {
          id: "c4",
          user: {
            name: "Sarah Johnson",
            avatar: "https://via.placeholder.com/100/121212/BBFD00?text=SJ",
            isVerified: true,
          },
          time: "4h ago",
          content:
            "Wow! The results are incredible. Which breakfast option was your favorite?",
          likes: 12,
          isLiked: true,
          replies: [],
        },
      ],
    },
  ]);

  // Handle liking a post - optimized with useCallback
  const handleLikePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const wasLiked = post.isLiked;
          return {
            ...post,
            isLiked: !wasLiked,
            likes: wasLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  }, []);

  // Handle liking a comment - optimized with useCallback
  const handleLikeComment = useCallback(
    (
      postId: string,
      commentId: string,
      isReply: boolean = false,
      parentCommentId?: string
    ) => {
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            if (isReply && parentCommentId) {
              // Handle liking a reply
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === parentCommentId && comment.replies) {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply) => {
                      if (reply.id === commentId) {
                        const wasLiked = reply.isLiked;
                        return {
                          ...reply,
                          isLiked: !wasLiked,
                          likes: wasLiked ? reply.likes - 1 : reply.likes + 1,
                        };
                      }
                      return reply;
                    }),
                  };
                }
                return comment;
              });
              return { ...post, comments: updatedComments };
            } else {
              // Handle liking a top-level comment
              const updatedComments = post.comments.map((comment) => {
                if (comment.id === commentId) {
                  const wasLiked = comment.isLiked;
                  return {
                    ...comment,
                    isLiked: !wasLiked,
                    likes: wasLiked ? comment.likes - 1 : comment.likes + 1,
                  };
                }
                return comment;
              });
              return { ...post, comments: updatedComments };
            }
          }
          return post;
        })
      );
    },
    []
  );

  // Handle adding a comment to a post - optimized with useCallback
  const handleAddComment = useCallback((postId: string, content: string) => {
    if (!content.trim()) return;

    const newComment: CommentType = {
      id: `c${Date.now()}`,
      user: {
        name: "Current User", // In a real app, this would be the logged-in user
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=ME",
        isVerified: false,
      },
      time: "Just now",
      content,
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  }, []);

  // Handle replying to a comment - optimized with useCallback
  const handleReplyToComment = useCallback(
    (postId: string, commentId: string, content: string) => {
      if (!content.trim()) return;

      const newReply: CommentType = {
        id: `r${Date.now()}`,
        user: {
          name: "Current User", // In a real app, this would be the logged-in user
          avatar: "https://via.placeholder.com/100/121212/BBFD00?text=ME",
          isVerified: false,
        },
        time: "Just now",
        content,
        likes: 0,
        isLiked: false,
      };

      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            const updatedComments = post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: [...(comment.replies || []), newReply],
                };
              }
              return comment;
            });
            return { ...post, comments: updatedComments };
          }
          return post;
        })
      );
    },
    []
  );

  // Combined handler for post interactions
  const handlePostInteraction = useCallback(
    (
      postId: string,
      commentId: string | null = null,
      content: string | null = null
    ) => {
      if (commentId === null && content === null) {
        // Like post
        handleLikePost(postId);
      } else if (commentId && content === null) {
        // Like comment
        handleLikeComment(postId, commentId);
      } else if (commentId && content) {
        // Reply to comment
        handleReplyToComment(postId, commentId, content);
      } else if (content) {
        // Add comment to post
        handleAddComment(postId, content);
      }
    },
    [handleLikePost, handleLikeComment, handleReplyToComment, handleAddComment]
  );

  // Handle adding a new post - optimized with useCallback
  const handleAddPost = useCallback((text: string) => {
    const newPost: PostType = {
      id: `p${Date.now()}`,
      user: {
        name: "Current User", // In a real app, this would be the logged-in user
        avatar: "https://via.placeholder.com/100/121212/BBFD00?text=ME",
        isVerified: false,
      },
      time: "Just now",
      content: text,
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  }, []);

  // Memoized posts list to prevent unnecessary re-renders
  const renderedPosts = useMemo(() => {
    return posts.map((post) => (
      <Post key={post.id} post={post} onLike={handlePostInteraction} />
    ));
  }, [posts, handlePostInteraction]);

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
      >
        {/* New post input */}
        <NewPostInput onAddPost={handleAddPost} />

        {/* Feed posts */}
        {renderedPosts}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
