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

      <InquiryScreen visible={visible} onClose={() => setVisible(false)} />
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
