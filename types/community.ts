export interface User {
  name: string;
  avatar: string;
  isVerified: boolean;
}

export interface Post {
  id: string;
  user: User;
  time: string;
  content: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  image?: string;
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
}

export interface ChallengeCardProps {
  challenge: Challenge;
}

export interface GroupCardProps {
  group: Group;
}
