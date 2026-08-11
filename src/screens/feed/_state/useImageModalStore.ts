import { create } from 'zustand';

interface ImageModalState {
  visible: boolean;
  images: string[];
  initialIndex: number;
  openImageModal: (images: string[], initialIndex?: number) => void;
  closeImageModal: () => void;
  resetImageModal: () => void;
}

const initialState = {
  visible: false,
  images: [],
  initialIndex: 0,
};

export const useImageModalStore = create<ImageModalState>(set => ({
  ...initialState,
  openImageModal: (images: string[], initialIndex: number = 0) =>
    set({ visible: true, images, initialIndex }),
  closeImageModal: () => set(initialState),
  resetImageModal: () => set(initialState),
}));
