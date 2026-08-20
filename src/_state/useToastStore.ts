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

const store = create<ToastState>(set => ({
  ...initialState,
  showToast: (message: string) => set({ visible: true, message }),
  hideToast: () => set(initialState),
}));

export const useToastStore = Object.assign(store, {
  showToast: (message: string) => store.getState().showToast(message),
  hideToast: () => store.getState().hideToast(),
});
