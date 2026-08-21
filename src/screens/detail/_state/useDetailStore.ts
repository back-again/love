import { create } from 'zustand';

interface ReplyTarget {
  commentId: string;
  userName: string;
}

interface EditTarget {
  commentId: string;
  text: string;
}

interface DetailState {
  visible: boolean;
  postId: string | null;
  replyTarget: ReplyTarget | null;
  editTarget: EditTarget | null;
  openDetail: (postId: string) => void;
  closeDetail: () => void;
  setReplyTarget: (target: ReplyTarget | null) => void;
  setEditTarget: (target: EditTarget | null) => void;
}

export const useDetailStore = create<DetailState>((set) => ({
  visible: false,
  postId: null,
  replyTarget: null,
  editTarget: null,
  openDetail: (postId: string) =>
    set({
      visible: true,
      postId,
      replyTarget: null,
      editTarget: null,
    }),
  closeDetail: () =>
    set({
      visible: false,
      postId: null,
      replyTarget: null,
      editTarget: null,
    }),
  setReplyTarget: (replyTarget) => set({ replyTarget, editTarget: null }),
  setEditTarget: (editTarget) => set({ editTarget, replyTarget: null }),
}));
