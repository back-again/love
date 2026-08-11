import { create } from 'zustand';
import { VoteInfo, CommentItem } from '../_model/comment.model';

interface CommentState {
  visible: boolean;
  postTitle: string;
  voteInfo?: VoteInfo;
  comments?: CommentItem[];
  openComments: (
    postTitle: string,
    voteInfo?: VoteInfo,
    comments?: CommentItem[],
  ) => void;
  closeComments: () => void;
}

const initialState = {
  visible: false,
  postTitle: '',
  voteInfo: undefined,
  comments: undefined,
};

export const useCommentStore = create<CommentState>(set => ({
  ...initialState,
  openComments: (
    postTitle: string,
    voteInfo?: VoteInfo,
    comments?: CommentItem[],
  ) => set({ visible: true, postTitle, voteInfo, comments }),
  closeComments: () => set(initialState),
}));
