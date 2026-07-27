'use client';

import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { useFeedbackForm } from '../_state/useFeedbackForm';

export function FeedbackInputAction() {
  const { feedbackText, setFeedbackText } = useFeedbackForm(
    useShallow((state) => ({
      feedbackText: state.feedbackText,
      setFeedbackText: state.setFeedbackText,
    })),
  );

  const [isFocused, setIsFocused] = useState(false);

  return (
    <BottomSheetTextInput
      style={[styles.feedbackInput, isFocused && styles.feedbackInputFocused]}
      placeholder="서비스 개선을 위한 의견을 자유롭게 적어주세요."
      placeholderTextColor="#BCBCBC"
      multiline={true}
      numberOfLines={5}
      textAlignVertical="top"
      value={feedbackText}
      onChangeText={setFeedbackText}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}

const styles = StyleSheet.create({
  feedbackInput: {
    width: '100%',
    minHeight: 160,
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  feedbackInputFocused: {
    borderColor: '#FF8E7A',
    backgroundColor: '#FFFFFF',
  },
});
