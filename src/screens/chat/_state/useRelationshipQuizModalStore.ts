import { create } from 'zustand';

interface RelationshipQuizModalState {
  visible: boolean;
  openQuizModal: () => void;
  closeQuizModal: () => void;
}

export const useRelationshipQuizModalStore = create<RelationshipQuizModalState>(
  set => ({
    visible: false,
    openQuizModal: () => set({ visible: true }),
    closeQuizModal: () => set({ visible: false }),
  }),
);
