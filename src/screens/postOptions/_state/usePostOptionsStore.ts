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
    const isMy = post.isMyPost !== undefined ? post.isMyPost : true;
    set({
      visible: true,
      targetPost: {
        ...post,
        isMyPost: isMy,
      },
    });
  },
  closePostOptions: () => set(initialState),
}));
