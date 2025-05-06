export interface User {
  name: string;
  avatar: string;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  user: User;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

export interface Post {
  id: string;
  title: string;
  user: User;
  time: string;
  content: string;
  likes: number;
  isLiked: boolean;
  image?: string;
  comments: Comment[];
}

export interface Challenge {
  id: string;
  title: string;
  participants: number;
  daysLeft: number;
  progress: number;
  status?: "Not Started" | "In Progress" | "Completed";
  banner: string;
}

export interface Group {
  id: string;
  name: string;
  members: number;
  posts: number;
  banner: string;
  isJoined: boolean;
}

// Props interfaces for components
export interface PostProps {
  post: Post;
  onLike: (
    postId: string,
    commentId?: string | null,
    content?: string | null
  ) => void;
}

export interface CommentProps {
  comment: Comment;
  postId: string;
  onLike: (
    commentId: string,
    isReply?: boolean,
    parentCommentId?: string
  ) => void;
  onReply: (commentId: string, content: string) => void;
}

export interface ChallengeCardProps {
  challenge: Challenge;
}

export interface GroupCardProps {
  group: Group;
}

export type PostData = Pick<Post, "title" | "content">
