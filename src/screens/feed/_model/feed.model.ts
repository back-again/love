export interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
}

export interface Post {
  id: string;
  category?: string;
  isHot?: boolean;
  isMyPost?: boolean;
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
  voteOCount?: number;
  voteXCount?: number;
  totalVoteCount?: number;
  percentO?: number;
  percentX?: number;
  totalVotes?: number;
  myVote?: 'O' | 'X' | null;
  hasFired?: boolean;
  hasFacepalmed?: boolean;
  hasRequestedReview?: boolean;
}
