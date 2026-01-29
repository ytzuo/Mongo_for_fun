export interface User {
  _id: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  author: string | User;
  createdAt: string;
}

export interface Post {
  id: string;
  author: string | User;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  likedBy?: string[];
  dislikedBy?: string[];
  comments: Comment[];
}
