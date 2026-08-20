import { create } from 'zustand';

export type SettingSubViewType =
  | 'terms'
  | 'privacy'
  | 'settings'
  | 'blocks'
  | null;

export interface SettingState {
  activeSubView: SettingSubViewType;
}

export interface SettingAction {
  setActiveSubView: (subView: SettingSubViewType) => void;
  reset: () => void;
}

const initialState: SettingState = {
  activeSubView: null,
};

export const useSettingStore = create<SettingState & SettingAction>((set) => ({
  ...initialState,
  setActiveSubView: (activeSubView) => set({ activeSubView }),
  reset: () => set(initialState),
}));
