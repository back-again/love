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
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  myMenuTileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#727272',
    letterSpacing: -0.3,
  },
});
