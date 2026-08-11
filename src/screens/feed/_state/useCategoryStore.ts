import { create } from 'zustand';

export interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: '전체',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
}));
