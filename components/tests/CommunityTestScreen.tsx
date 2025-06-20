import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { communityService } from "@/api/communityService";
import { CreatePostData } from "@/types/community";

const CommunityTestScreen = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    {
      name: "Get All Posts",
      action: async () => {
        try {
          setLoading(true);
          const posts = await communityService.getPosts({
            page: 1,
            limit: 10,
            status: "published",
          });
          Alert.alert("Success", `Retrieved ${posts.items.length} posts`);
          console.log("Posts:", posts);
        } catch (error) {
          Alert.alert("Error", "Failed to fetch posts");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Create General Post",
      action: async () => {
        try {
          setLoading(true);
          const postData: CreatePostData = {
            title: "Test General Post",
            content: "This is a test general post from the mobile app",
            type: "general",
            tags: ["test", "mobile"],
            attachments: [],
          };
          const post = await communityService.createPost(postData);
          Alert.alert("Success", "General post created successfully");
          console.log("Created post:", post);
        } catch (error) {
          Alert.alert("Error", "Failed to create post");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Create Question Post",
      action: async () => {
        try {
          setLoading(true);
          const postData: CreatePostData = {
            title: "Test Question Post",
            content: "How do I improve my bench press form?",
            type: "question",
            tags: ["question", "bench-press", "form"],
            attachments: [],
          };
          const post = await communityService.createPost(postData);
          Alert.alert("Success", "Question post created successfully");
          console.log("Created post:", post);
        } catch (error) {
          Alert.alert("Error", "Failed to create post");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Create Achievement Post",
      action: async () => {
        try {
          setLoading(true);
          const postData: CreatePostData = {
            title: "Hit a new PR!",
            content:
              "Just achieved a new personal record on deadlift - 300lbs! 💪",
            type: "achievement",
            tags: ["achievement", "deadlift", "PR"],
            attachments: [],
          };
          const post = await communityService.createPost(postData);
          Alert.alert("Success", "Achievement post created successfully");
          console.log("Created post:", post);
        } catch (error) {
          Alert.alert("Error", "Failed to create post");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Create Motivation Post",
      action: async () => {
        try {
          setLoading(true);
          const postData: CreatePostData = {
            title: "Monday Motivation",
            content:
              "Remember: Progress, not perfection. Every workout counts! 🔥",
            type: "motivation",
            tags: ["motivation", "monday", "progress"],
            attachments: [],
          };
          const post = await communityService.createPost(postData);
          Alert.alert("Success", "Motivation post created successfully");
          console.log("Created post:", post);
        } catch (error) {
          Alert.alert("Error", "Failed to create post");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Test Like Toggle",
      action: async () => {
        try {
          setLoading(true);
          // First get posts to find one to like
          const posts = await communityService.getPosts({ page: 1, limit: 1 });
          if (posts.items.length > 0) {
            const postId = posts.items[0].id;
            const result = await communityService.toggleLike("posts", postId);
            Alert.alert("Success", `Like toggled successfully. Liked: ${result.liked}`);
            console.log("Like result:", result);
          } else {
            Alert.alert("Info", "No posts available to like");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to toggle like");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Test Comment Creation",
      action: async () => {
        try {
          setLoading(true);
          // First get posts to find one to comment on
          const posts = await communityService.getPosts({ page: 1, limit: 1 });
          if (posts.items.length > 0) {
            const postId = posts.items[0].id;
            const newComment = await communityService.createComment(postId, {
              content: "Great post! Thanks for sharing. 👍",
            });
            Alert.alert("Success", "Comment created successfully");
            console.log("Created comment:", newComment);
          } else {
            Alert.alert("Info", "No posts available to comment on");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to create comment");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Test Get Comments",
      action: async () => {
        try {
          setLoading(true);
          // First get posts to find one with comments
          const posts = await communityService.getPosts({ page: 1, limit: 1 });
          if (posts.items.length > 0) {
            const postId = posts.items[0].id;
            const comments = await communityService.getComments(postId);
            Alert.alert("Success", `Retrieved ${comments.length} comments`);
            console.log("Comments:", comments);
          } else {
            Alert.alert("Info", "No posts available");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to get comments");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
    {
      name: "Test Comment Like Toggle",
      action: async () => {
        try {
          setLoading(true);
          // First get posts and then comments to find one to like
          const posts = await communityService.getPosts({ page: 1, limit: 1 });
          if (posts.items.length > 0) {
            const postId = posts.items[0].id;
            const comments = await communityService.getComments(postId);
            if (comments.length > 0) {
              const commentId = comments[0].id;
              const result = await communityService.toggleLike('comments', commentId);
              Alert.alert("Success", `Comment like toggled successfully. Liked: ${result.liked}`);
              console.log("Comment like result:", result);
            } else {
              Alert.alert("Info", "No comments available to like");
            }
          } else {
            Alert.alert("Info", "No posts available");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to toggle comment like");
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
    },
  ];

  return (
    <View className={isDark ? "flex-1 bg-dark-900" : "flex-1 bg-light-100"}>
      <ScrollView className="flex-1 p-4">
        <Text
          className={
            isDark
              ? "text-white text-2xl font-bold mb-6 text-center"
              : "text-dark-900 text-2xl font-bold mb-6 text-center"
          }
        >
          Community API Tests
        </Text>

        {testEndpoints.map((test, index) => (
          <TouchableOpacity
            key={index}
            onPress={test.action}
            disabled={loading}
            className={`p-4 rounded-2xl mb-4 ${
              isDark ? "bg-dark-800" : "bg-white"
            } ${loading ? "opacity-50" : ""}`}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className={
                  isDark
                    ? "text-white font-semibold"
                    : "text-dark-900 font-semibold"
                }
              >
                {test.name}
              </Text>
              {loading ? (
                <ActivityIndicator size="small" color="#FF4B26" />
              ) : (
                <Text className="text-primary font-bold">Test</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <View className="mt-8 p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/20">
          <Text className="text-blue-800 dark:text-blue-200 font-bold mb-2">
            Instructions:
          </Text>
          <Text className="text-blue-700 dark:text-blue-300 text-sm">
            1. Make sure your backend server is running{"\n"}
            2. Test the endpoints one by one{"\n"}
            3. Check the console logs for detailed responses{"\n"}
            4. Some tests depend on existing data (like liking/commenting)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default CommunityTestScreen;
