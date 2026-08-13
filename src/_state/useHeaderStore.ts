import { Animated } from 'react-native';
import { create } from 'zustand';

interface HeaderState {
  scrollYAnim: Animated.Value;
}

export const useHeaderStore = create<HeaderState>(() => ({
  scrollYAnim: new Animated.Value(0),
}));
