// Local storage utility for managing like states
class LikeStateManager {
  private likedPosts = new Set<string>();
  private likedComments = new Set<string>();

  // Check if a post is liked
  isPostLiked(postId: string): boolean {
    return this.likedPosts.has(postId);
  }

  // Check if a comment is liked
  isCommentLiked(commentId: string): boolean {
    return this.likedComments.has(commentId);
  }

  // Toggle post like state
  togglePostLike(postId: string): boolean {
    if (this.likedPosts.has(postId)) {
      this.likedPosts.delete(postId);
      return false;
    } else {
      this.likedPosts.add(postId);
      return true;
    }
  }

  // Toggle comment like state
  toggleCommentLike(commentId: string): boolean {
    if (this.likedComments.has(commentId)) {
      this.likedComments.delete(commentId);
      return false;
    } else {
      this.likedComments.add(commentId);
      return true;
    }
  }

  // Set initial states (useful when loading from API if available)
  setPostLiked(postId: string, liked: boolean) {
    if (liked) {
      this.likedPosts.add(postId);
    } else {
      this.likedPosts.delete(postId);
    }
  }

  setCommentLiked(commentId: string, liked: boolean) {
    if (liked) {
      this.likedComments.add(commentId);
    } else {
      this.likedComments.delete(commentId);
    }
  }

  // Clear all states (useful for logout)
  clear() {
    this.likedPosts.clear();
    this.likedComments.clear();
  }
}

export const likeStateManager = new LikeStateManager();
