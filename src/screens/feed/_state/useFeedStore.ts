import { create } from 'zustand';

export interface FeedState {
  selectedCategoryId: string | null;
  imageModalVisible: boolean;
  imageModalImages: string[];
  imageModalInitialIndex: number;
}

export interface FeedAction {
  setSelectedCategoryId: (categoryId: string | null) => void;
  openImageModal: (images: string[], initialIndex?: number) => void;
  closeImageModal: () => void;
  resetImageModal: () => void;
  reset: () => void;
}

const initialState: FeedState = {
  selectedCategoryId: null,
  imageModalVisible: false,
  imageModalImages: [],
  imageModalInitialIndex: 0,
};

export const useFeedStore = create<FeedState & FeedAction>((set) => ({
  ...initialState,
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),
  openImageModal: (images: string[], initialIndex: number = 0) =>
    set({
      imageModalVisible: true,
      imageModalImages: images,
      imageModalInitialIndex: initialIndex,
    }),
  closeImageModal: () =>
    set({
      imageModalVisible: false,
      imageModalImages: [],
      imageModalInitialIndex: 0,
    }),
  resetImageModal: () =>
    set({
      imageModalVisible: false,
      imageModalImages: [],
      imageModalInitialIndex: 0,
    }),
  reset: () => set(initialState),
}));
