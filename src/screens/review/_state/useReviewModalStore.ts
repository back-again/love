import { create } from 'zustand';

export type ReviewMode = 'view' | 'write';

interface ReviewModalState {
  visible: boolean;
  mode: ReviewMode;
  reviewText: string;
  postId?: string;
  openReviewModal: (params?: {
    mode?: ReviewMode;
    reviewText?: string;
    postId?: string;
  }) => void;
  closeReviewModal: () => void;
}

const defaultReviewText =
  '"결국 솔직하게 서운했던 부분 대화 나누고 서로 이해했어요! 다들 O 투표로 제 편을 들어주셔서 용기 얻고 대화할 수 있었습니다. 감사합니다!"';

const initialState = {
  visible: false,
  mode: 'view' as ReviewMode,
  reviewText: defaultReviewText,
  postId: undefined,
};

export const useReviewModalStore = create<ReviewModalState>(set => ({
  ...initialState,
  openReviewModal: (params = {}) =>
    set({
      visible: true,
      mode: params.mode ?? 'view',
      reviewText: params.reviewText ?? defaultReviewText,
      postId: params.postId,
    }),
  closeReviewModal: () => set(initialState),
}));
