import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  showToast: (message: string) => void;
  hideToast: () => void;
}

const initialState = {
  visible: false,
  message: '',
};

export const useToastStore = create<ToastState>(set => ({
  ...initialState,
  showToast: (message: string) => set({ visible: true, message }),
  hideToast: () => set(initialState),
}));
