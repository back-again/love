import { create } from 'zustand';
import { CommentItem } from '../_model/comment.model';
import { Post } from '@/screens/feed/_model/feed.model';

export interface ReplyTarget {
  commentId: string;
  userName: string;
}

export interface EditTarget {
  commentId: string;
  text: string;
}

interface CommentState {
  visible: boolean;
  targetPost: Post | null;
  comments?: CommentItem[];
  replyTarget: ReplyTarget | null;
  editTarget: EditTarget | null;
  setReplyTarget: (target: ReplyTarget | null) => void;
  setEditTarget: (target: EditTarget | null) => void;
  openComments: (targetPost: Post, comments?: CommentItem[]) => void;
  closeComments: () => void;
}

const initialState = {
  visible: false,
  targetPost: null,
  comments: undefined,
  replyTarget: null,
  editTarget: null,
};

export const useCommentStore = create<CommentState>(set => ({
  ...initialState,
  setReplyTarget: (replyTarget: ReplyTarget | null) =>
    set({ replyTarget, editTarget: null }),
  setEditTarget: (editTarget: EditTarget | null) =>
    set({ editTarget, replyTarget: null }),
  openComments: (targetPost: Post, comments?: CommentItem[]) =>
    set({
      visible: true,
      targetPost,
      comments,
      replyTarget: null,
      editTarget: null,
    }),
  closeComments: () => set(initialState),
}));
