'use client';

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useDetailStore } from '../_state/useDetailStore';

export function DetailBackAction() {
  const closeDetail = useDetailStore(state => state.closeDetail);

  return (
    <TouchableOpacity
      style={styles.backButton}
      onPress={closeDetail}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      activeOpacity={0.7}
    >
      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
          d="M15 19l-7-7 7-7"
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
  backButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
