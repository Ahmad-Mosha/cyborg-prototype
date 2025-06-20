export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  profilePictureKey: string | null;
  roles: (string | null)[];
  isActive: boolean;
  isFirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  authorId: string;
  postId: string;
  parentCommentId: string | null;
  parentComment: Comment | null;
  likesCount: number;
  isLiked?: boolean;
  isEdited: boolean;
  author: User;
  post?: Post;
  replies?: Comment[];
}

export interface Post {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  title: string;
  content: string;
  type: "general" | "question" | "achievement" | "motivation";
  status: "draft" | "published" | "archived";
  tags: string[];
  authorId: string;
  likesCount: number;
  commentsCount: number;
  attachments: string[];
  isPinned: boolean;
  isLocked: boolean;
  isLiked?: boolean;
  author: User;
  comments?: Comment[];
}

export interface CreatePostData {
  title: string;
  content: string;
  type: "general" | "question" | "achievement" | "motivation";
  tags?: string[];
  attachments?: string[];
}

export interface CreateCommentData {
  content: string;
  parentCommentId?: string;
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
  onLike: (postId: string) => void;
  onComment: (
    postId: string,
    content: string,
    parentCommentId?: string
  ) => void;
  onToggleComments?: (postId: string) => void;
}

export interface CommentProps {
  comment: Comment;
  postId: string;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

export interface ChallengeCardProps {
  challenge: Challenge;
}

export interface GroupCardProps {
  group: Group;
}
