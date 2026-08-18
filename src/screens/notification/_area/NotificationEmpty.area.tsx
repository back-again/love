'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NotificationEmptyArea() {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>아직 도착한 알림이 없어요</Text>
      <Text style={styles.emptySub}>
        내 사연 글에 새로운 댓글이나 투표가 남겨지면 알림을 전송해 드려요.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#8F8F8F',
    textAlign: 'center',
    lineHeight: 18,
  },
});
