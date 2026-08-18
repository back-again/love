import { create } from 'zustand';
import { Post } from '@/screens/feed/_model/feed.model';

interface PostOptionsState {
  visible: boolean;
  targetPost: Post | null;
  openPostOptions: (post: Post) => void;
  closePostOptions: () => void;
}

const initialState = {
  visible: false,
  targetPost: null,
};

export const usePostOptionsStore = create<PostOptionsState>(set => ({
  ...initialState,
  openPostOptions: (post: Post) => {
    set({
      visible: true,
      targetPost: post,
    });
  },
  closePostOptions: () => set(initialState),
}));
