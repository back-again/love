import { create } from 'zustand';

interface OnboardingFormState {
  gender: 'male' | 'female';
  birthYear: string;
  datingStartedAt: string;
  notificationAllowed: boolean;
  termsAgreed: boolean;
}

interface OnboardingFormAction {
  setGender: (gender: 'male' | 'female') => void;
  setBirthYear: (year: string) => void;
  setDatingStartedAt: (date: string) => void;
  setNotificationAllowed: (allowed: boolean) => void;
  toggleNotificationAllowed: () => void;
  setTermsAgreed: (agreed: boolean) => void;
  toggleTermsAgreed: () => void;
  resetForm: () => void;
}

type OnboardingFormStore = OnboardingFormState & OnboardingFormAction;

export const useOnboardingForm = create<OnboardingFormStore>(set => ({
  gender: 'male',
  birthYear: '',
  datingStartedAt: '',
  notificationAllowed: false,
  termsAgreed: false,

  setGender: gender => set({ gender }),
  setBirthYear: birthYear => set({ birthYear }),
  setDatingStartedAt: datingStartedAt => set({ datingStartedAt }),
  setNotificationAllowed: notificationAllowed => set({ notificationAllowed }),
  toggleNotificationAllowed: () =>
    set(state => ({ notificationAllowed: !state.notificationAllowed })),
  setTermsAgreed: termsAgreed => set({ termsAgreed }),
  toggleTermsAgreed: () => set(state => ({ termsAgreed: !state.termsAgreed })),
  resetForm: () =>
    set({
      gender: 'male',
      birthYear: '',
      datingStartedAt: '',
      notificationAllowed: false,
      termsAgreed: false,
    }),
}));
