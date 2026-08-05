export interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
}

export interface Post {
  id: string;
  variantName?: string;
  title: string;
  storySummary: string;
  fullStory: string;
  images: string[];
  voteO: string;
  voteX: string;
  topComments: CommentItem[];
  reviewStatus: string;
  hasReview?: boolean;
  fireCount: number;
  facepalmCount: number;
  commentCount: number;
}
