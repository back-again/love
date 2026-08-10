import { create } from 'zustand';

export interface CreateFormState {
  questionTitle: string;
  detailSituation: string;
  images: string[];
  voteO: string;
  voteX: string;
  isVoteEnabled: boolean;
}

export interface CreateFormAction {
  setQuestionTitle: (title: string) => void;
  setDetailSituation: (detail: string) => void;
  setImages: (images: string[] | ((prev: string[]) => string[])) => void;
  setVoteO: (voteO: string) => void;
  setVoteX: (voteX: string) => void;
  setIsVoteEnabled: (enabled: boolean) => void;
  addImage: (url: string) => void;
  removeImage: (index: number) => void;
  reset: () => void;
}

const initialState: CreateFormState = {
  questionTitle: '',
  detailSituation: '',
  images: [],
  voteO: '',
  voteX: '',
  isVoteEnabled: false,
};

export const useCreateForm = create<CreateFormState & CreateFormAction>((set) => ({
  ...initialState,
  setQuestionTitle: (questionTitle) => set({ questionTitle }),
  setDetailSituation: (detailSituation) => set({ detailSituation }),
  setVoteO: (voteO) => set({ voteO }),
  setVoteX: (voteX) => set({ voteX }),
  setIsVoteEnabled: (isVoteEnabled) => set({ isVoteEnabled }),
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
