'use client';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useUserStore } from '@/_state/useUserStore';
import { MainTabType } from '../Layout';

interface HeaderTitleActionProps {
  activeTab: MainTabType;
}

export function HeaderTitleAction({ activeTab }: HeaderTitleActionProps) {
  const datingStartedAt = useUserStore(state => state.user?.dating_started_at);

  let ddayText = 'D+1';
  if (datingStartedAt) {
    try {
      const startDate = new Date(datingStartedAt);
      const today = new Date();
      startDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 0) {
        ddayText = `D+${diffDays}`;
      } else {
        ddayText = `D${diffDays}`;
      }
    } catch (e) {
      console.warn('Failed to calculate D-day:', e);
    }
  } else {
    ddayText = 'D+365';
  }

  return (
    <Text
      style={[
        styles.headerTitle,
        activeTab === 'feed' && styles.feedHeaderTitle,
      ]}
    >
      {activeTab === 'feed' && ddayText}
      {activeTab === 'create' && '작성'}
      {activeTab === 'chat' && '상담'}
      {activeTab === 'my' && '마이'}
    </Text>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    transform: [{ scaleX: 1.05 }],
  },
  feedHeaderTitle: {
    fontWeight: '700',
    transform: undefined,
  },
});
