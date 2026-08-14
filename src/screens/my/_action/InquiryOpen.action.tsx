'use client';

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import InquiryScreen from '@/screens/inquiry/InquiryScreen';

export function InquiryOpenAction() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.myMenuTileCard}
        onPress={() => setVisible(true)}
        activeOpacity={0.75}
      >
        <Text style={styles.myMenuTileTitle}>문의 사항</Text>
      </TouchableOpacity>

      {visible && (
        <InquiryScreen visible={visible} onClose={() => setVisible(false)} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  myMenuTileCard: {
    flex: 1,
    height: 46,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMenuTileTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8F8F8F',
    letterSpacing: -0.3,
  },
});
