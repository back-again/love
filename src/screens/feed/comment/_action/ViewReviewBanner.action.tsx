'use client';

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCommentStore } from '../_state/useCommentStore';

export function ViewReviewBannerAction() {
  const targetPost = useCommentStore(state => state.targetPost);
  const reviewContent = targetPost?.reviewContent || '';

  return (
    <View style={styles.reviewCardContainer}>
      <Text style={styles.reviewHeaderTitle}>📝 작성자 후기</Text>
      <View style={styles.reviewCardBox}>
        <Text style={styles.reviewCardBodyText}>{reviewContent}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewCardContainer: {
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
  },
  reviewHeaderTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F9758D',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  reviewCardBox: {
    width: '100%',
    backgroundColor: '#FFF8F8',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFE3E5',
  },
  reviewCardBodyText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
});
