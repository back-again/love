export interface Post {
  id: string;
  userId: string;
  categoryId?: string;
  category: string;
  title: string;
  content: string;
  images: string[];
  voteO: string;
  voteX: string;
  reviewContent?: string;
  hasReview?: boolean;
  commentCount: number;
  voteOCount: number;
  voteXCount: number;
  createdAt: string;
}
