import { create } from 'zustand';

export interface FeedbackFormState {
  feedbackText: string;
  feedbackSubmitted: boolean;
}

export interface FeedbackFormAction {
  setFeedbackText: (text: string) => void;
  setFeedbackSubmitted: (submitted: boolean) => void;
  reset: () => void;
}

const initialState: FeedbackFormState = {
  feedbackText: '',
  feedbackSubmitted: false,
};

export const useFeedbackForm = create<FeedbackFormState & FeedbackFormAction>(
  (set) => ({
    ...initialState,
    setFeedbackText: (feedbackText) => set({ feedbackText }),
    setFeedbackSubmitted: (feedbackSubmitted) => set({ feedbackSubmitted }),
    reset: () => set(initialState),
  }),
);
