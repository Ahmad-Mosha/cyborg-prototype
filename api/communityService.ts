import {
  Post,
  Comment,
  CreatePostData,
  CreateCommentData,
} from "@/types/community";
import api from "./apiConfig";
import { likeStateManager } from "@/utils/likeStateManager";

interface GetPostsParams {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const communityService = {
  async createPost(postData: CreatePostData) {
    try {
      const response = await api.post("/community/posts", postData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  async getPosts(params: GetPostsParams = {}) {
    try {
      const { page = 1, limit = 10, type, status } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(type && { type }),
        ...(status && { status }),
      });

      const response = await api.get(`/community/posts?${queryParams}`);
      console.log("Posts response sample:", response.data.items?.[0]); // Debug log
      
      // Add isLiked state to each post based on local state
      const postsWithLikeState = response.data.items.map((post: Post) => ({
        ...post,
        isLiked: post.isLiked ?? likeStateManager.isPostLiked(post.id),
      }));

      return {
        ...response.data,
        items: postsWithLikeState,
      } as PaginatedResponse<Post>;
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  async getPost(id: string) {
    try {
      const response = await api.get(`/community/posts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching post:", error);
      throw error;
    }
  },

  async updatePost(postId: string, values: Partial<CreatePostData>) {
    try {
      const response = await api.put(`/community/posts/${postId}`, values);
      return response.data;
    } catch (error: any) {
      console.error("Error updating post:", error);
      throw error;
    }
  },

  async deletePost(id: string) {
    try {
      const response = await api.delete(`/community/posts/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },

  async toggleLike(targetType: "posts" | "comments", id: string) {
    try {
      const response = await api.post(
        `/community/${targetType}/${id}/toggle-like`
      );
      
      // Update local state based on server response
      const liked = response.data.liked;
      if (targetType === "posts") {
        likeStateManager.setPostLiked(id, liked);
      } else {
        likeStateManager.setCommentLiked(id, liked);
      }
      
      console.log(`${targetType} ${id} like toggled to:`, liked); // Debug log
      return response.data;
    } catch (error: any) {
      console.error("Error toggling like:", error);
      throw error;
    }
  },

  async createComment(postId: string, commentData: CreateCommentData) {
    try {
      const response = await api.post(
        `/community/posts/${postId}/comments`,
        commentData
      );
      return response.data;
    } catch (error: any) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  async getComments(postId: string) {
    try {
      const response = await api.get(`/community/posts/${postId}/comments`);
      console.log("Comments response:", response.data); // Debug log
      
      let comments: Comment[] = [];
      
      // Handle different response structures
      if (Array.isArray(response.data)) {
        comments = response.data;
      } else if (response.data.items) {
        comments = response.data.items;
      } else if (response.data.comments) {
        comments = response.data.comments;
      } else {
        console.warn("Unexpected comments response structure:", response.data);
        return [];
      }

      // Add isLiked state to each comment based on local state
      const commentsWithLikeState = comments.map((comment: Comment) => ({
        ...comment,
        isLiked: comment.isLiked ?? likeStateManager.isCommentLiked(comment.id),
      }));

      return commentsWithLikeState;
    } catch (error: any) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  async deleteComment(id: string) {
    try {
      const response = await api.delete(`/community/comments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
