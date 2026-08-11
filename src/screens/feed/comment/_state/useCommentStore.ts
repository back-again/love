import { create } from 'zustand';
import { CommentItem } from '../_model/comment.model';
import { Post } from '@/screens/feed/_model/feed.model';

export interface ReplyTarget {
  commentId: string;
  userName: string;
}

interface CommentState {
  visible: boolean;
  targetPost: Post | null;
  comments?: CommentItem[];
  replyTarget: ReplyTarget | null;
  setReplyTarget: (target: ReplyTarget | null) => void;
  openComments: (targetPost: Post, comments?: CommentItem[]) => void;
  closeComments: () => void;
}

const initialState = {
  visible: false,
  targetPost: null,
  comments: undefined,
  replyTarget: null,
};

export const useCommentStore = create<CommentState>(set => ({
  ...initialState,
  setReplyTarget: (replyTarget: ReplyTarget | null) => set({ replyTarget }),
  openComments: (targetPost: Post, comments?: CommentItem[]) =>
    set({ visible: true, targetPost, comments, replyTarget: null }),
  closeComments: () => set(initialState),
}));
