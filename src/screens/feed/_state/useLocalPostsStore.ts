import { create } from 'zustand';
import { Post } from '../_model/feed.model';

interface LocalPostsState {
  localPosts: Post[];
  addPost: (post: Post) => void;
  clearLocalPosts: () => void;
}

export const useLocalPostsStore = create<LocalPostsState>(set => ({
  localPosts: [],
  addPost: newPost =>
    set(state => ({
      localPosts: [newPost, ...state.localPosts.filter(p => p.id !== newPost.id)],
    })),
  clearLocalPosts: () => set({ localPosts: [] }),
}));
