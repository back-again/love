'use client';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useSettingStore } from '../../_state/useSettingStore';

export function SettingTitleAction() {
  const activeSubView = useSettingStore((state) => state.activeSubView);

  const getTitle = () => {
    switch (activeSubView) {
      case 'terms':
        return '이용 약관';
      case 'privacy':
        return '개인정보처리방침';
      case 'settings':
        return '계정 설정';
      case 'blocks':
        return '차단 목록 관리';
      default:
        return '설정';
    }
  };

  return <Text style={styles.sheetTitle}>{getTitle()}</Text>;
}

const styles = StyleSheet.create({
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
});
