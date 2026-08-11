'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useReviewModalStore } from '../_state/useReviewModalStore';

export function ReviewDetailArea() {
  const reviewText = useReviewModalStore(state => state.reviewText);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>사연 후기</Text>
      </View>

      <View style={styles.reviewCardBox}>
        <Text style={styles.reviewCardBodyText}>{reviewText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  reviewCardBox: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewCardBodyText: {
    fontSize: 14.5,
    color: '#727272',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
});
