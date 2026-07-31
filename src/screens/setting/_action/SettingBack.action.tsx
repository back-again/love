'use client';

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSettingStore } from '../_state/useSettingStore';

export function SettingBackAction() {
  const activeSubView = useSettingStore((state) => state.activeSubView);
  const setActiveSubView = useSettingStore((state) => state.setActiveSubView);

  if (!activeSubView) return null;

  return (
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() => setActiveSubView(null)}
      activeOpacity={0.7}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 18l-6-6 6-6"
          stroke="#0F172A"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    padding: 2,
    marginRight: 4,
  },
});
