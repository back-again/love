import { create } from 'zustand';

interface ReviewFormState {
  reviewText: string;
  setReviewText: (text: string) => void;
  reset: () => void;
}

export const useReviewForm = create<ReviewFormState>(set => ({
  reviewText: '',
  setReviewText: reviewText => set({ reviewText }),
  reset: () => set({ reviewText: '' }),
}));
