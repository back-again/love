import { create } from 'zustand';
import { QUIZ_QUESTIONS, calculateProfileMatch } from '../_lib/quizData.lib';
import { saveRelationshipProfileLib } from '../../_lib/relationshipProfile.lib';

interface RelationshipQuizState {
  currentStep: number;
  answers: Record<number, string>;
  selectOption: (trait: string, onSuccess?: () => void) => Promise<void>;
  resetQuiz: () => void;
}

export const useRelationshipQuizStore = create<RelationshipQuizState>(
  (set, get) => ({
    currentStep: 0,
    answers: {},

    selectOption: async (trait, onSuccess) => {
      const { currentStep, answers } = get();
      const updatedAnswers = { ...answers, [currentStep]: trait };
      set({ answers: updatedAnswers });

      if (currentStep < QUIZ_QUESTIONS.length - 1) {
        set({ currentStep: currentStep + 1 });
      } else {
        const resultProfile = calculateProfileMatch(updatedAnswers);
        await saveRelationshipProfileLib(resultProfile);
        set({ currentStep: 0, answers: {} });
        if (onSuccess) onSuccess();
      }
    },

    resetQuiz: () => set({ currentStep: 0, answers: {} }),
  }),
);
