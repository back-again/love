import { create } from 'zustand';
import { MainTabType } from '@/components/layout/Layout';

interface TabState {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
}

export const useTabStore = create<TabState>(set => ({
  activeTab: 'feed',
  setActiveTab: tab => set({ activeTab: tab }),
}));
