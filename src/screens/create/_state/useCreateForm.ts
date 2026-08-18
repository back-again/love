import { create } from 'zustand';

export interface CreateFormState {
  questionTitle: string;
  category: string;
  detailSituation: string;
  images: string[];
  voteO: string;
  voteX: string;
  isEditMode: boolean;
  editPostId: string | null;
}

export interface CreateFormAction {
  setQuestionTitle: (title: string) => void;
  setCategory: (category: string) => void;
  setDetailSituation: (detail: string) => void;
  setImages: (images: string[] | ((prev: string[]) => string[])) => void;
  setVoteO: (voteO: string) => void;
  setVoteX: (voteX: string) => void;
  setIsEditMode: (enabled: boolean) => void;
  setEditPostId: (id: string | null) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

const initialState: CreateFormState = {
  questionTitle: '',
  category: '',
  detailSituation: '',
  images: [],
  voteO: '',
  voteX: '',
  isEditMode: false,
  editPostId: null,
};

export const useCreateForm = create<CreateFormState & CreateFormAction>((set) => ({
  ...initialState,
  setQuestionTitle: (questionTitle) => set({ questionTitle }),
  setCategory: (category) => set({ category }),
  setDetailSituation: (detailSituation) => set({ detailSituation }),
  setVoteO: (voteO) => set({ voteO }),
  setVoteX: (voteX) => set({ voteX }),
  setIsEditMode: (isEditMode) => set({ isEditMode }),
  setEditPostId: (editPostId) => set({ editPostId }),
  setImages: (images) =>
    set((state) => ({
      images: typeof images === 'function' ? images(state.images) : images,
    })),
  addImage: (url) =>
    set((state) => ({
      images: state.images.length < 3 ? [url, ...state.images] : state.images,
    })),
  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  reset: () => set(initialState),
}));
