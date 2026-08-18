import { create } from 'zustand';

interface NotificationState {
  visible: boolean;
  openNotification: () => void;
  closeNotification: () => void;
}

export const useNotificationStore = create<NotificationState>(set => ({
  visible: false,
  openNotification: () => set({ visible: true }),
  closeNotification: () => set({ visible: false }),
}));
