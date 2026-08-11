export interface ReplyItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  votedChoice?: 'O' | 'X';
}

export interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  votedChoice?: 'O' | 'X';
  replies?: ReplyItem[];
}

export interface VoteInfo {
  selectedVote?: 'O' | 'X' | null;
  voteOText?: string;
  voteXText?: string;
  percentO?: number;
  percentX?: number;
  totalVotes?: number;
  hasReview?: boolean;
}
