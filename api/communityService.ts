import { Post, Comment } from "@/types/community";
import api from "./apiConfig";


export const communityService = {
  async createPost(postData: Post) {

    try {
      const post = api.post("/community/posts", postData)
      return post
    } catch (error: any) {
      console.log("An error occured while trying to create a post")
      throw error
    }

  },

  async getPosts() {
    try {
      const posts = api.get("/community/posts")
      return posts
    } catch (error: any) {
      console.log("An error occured while trying to fetch posts")
      throw error

    }
  },

  async getPost({ id }: Post) {
    try {
      const post = api.get(`/community/post/${id}`)
      return post
    } catch (error: any) {
      console.log("An error occured while trying to fetch post")
      throw error

    }
  },

  async updatePost({ postId, values }: { postId: string; values: Post }) {
    try {
      const updatedPost = api.put(`/community/posts/${postId}`, values)

    } catch (e) {
      throw new Error(`An Error occured while trying to update the post`)
    }
  },

  async deletePost({ id }: Post) {
    try {
      return api.delete(`/community/posts/${id}`)
    } catch (e) {
      throw new Error(`An Error occured while trying to delete the post`)
    }
  },

  async createComment({ id, values }: { id: string, values: Comment }) {
    try {
      return api.create(`/posts/${id}/comments`, values)
    } catch (e) {
      throw new Error("An Error occured while trying to create a comment")
    }

  },

  async getComments({ id }: Post) {
    try {
      return api.get(`/posts/${id}/comments`)
    } catch (e) {
      throw new Error(`An error occured while trying to fetch the posts`)
    }
  },

  async deleteComment({ id }: Post) {
    try {
      return api.delete(`comments/${id}`)

    } catch (e) {
      throw new Error(`An error occured while trying to delete the comment`)
    }
  }
}
