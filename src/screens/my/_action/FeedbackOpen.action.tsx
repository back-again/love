'use client';

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FeedbackScreen from '@/screens/feedback/FeedbackScreen';

export function FeedbackOpenAction() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.myMenuTileCard}
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.myMenuTileTitle}>피드백 보내기</Text>
      </TouchableOpacity>

      <FeedbackScreen visible={visible} onClose={() => setVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  myMenuTileCard: {
    flex: 1,
    height: 54,
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMenuTileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9C9C9C',
    letterSpacing: -0.3,
  },
});
