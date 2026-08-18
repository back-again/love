export interface ReplyItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  isMyComment?: boolean;
  votedChoice?: 'O' | 'X';
}

export interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  isMyComment?: boolean;
  votedChoice?: 'O' | 'X';
  replies?: ReplyItem[];
}
