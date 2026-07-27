'use client';

import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { useReviewForm } from '../_state/useReviewForm';

export function ReviewInputAction() {
  const { reviewText, setReviewText } = useReviewForm(
    useShallow(state => ({
      reviewText: state.reviewText,
      setReviewText: state.setReviewText,
    })),
  );

  return (
    <BottomSheetTextInput
      style={styles.reviewInput}
      placeholder="결과나 당시 대화 내용, 현재 상태 등을 들려주세요."
      placeholderTextColor="#BCBCBC"
      multiline={true}
      numberOfLines={5}
      textAlignVertical="top"
      value={reviewText}
      onChangeText={setReviewText}
    />
  );
}

const styles = StyleSheet.create({
  reviewInput: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
});
