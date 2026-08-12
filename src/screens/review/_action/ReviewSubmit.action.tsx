'use client';

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useReviewForm } from '../_state/useReviewForm';
import { createReview } from '../_lib/createReview.lib';

interface ReviewSubmitActionProps {
  onClose: () => void;
  postId?: string;
}

export function ReviewSubmitAction({
  onClose,
  postId = '11111111-1111-1111-1111-111111111111',
}: ReviewSubmitActionProps) {
  const queryClient = useQueryClient();
  const { reviewText, reset } = useReviewForm(
    useShallow(state => ({
      reviewText: state.reviewText,
      reset: state.reset,
    })),
  );

  const reviewMutation = useMutation({
    mutationFn: (content: string) =>
      createReview({ postId, reviewContent: content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['writtenPosts'] });

      if (Platform.OS === 'web') {
        alert('후기가 성공적으로 등록되었습니다!');
      } else {
        Alert.alert('완료', '후기가 성공적으로 등록되었습니다!');
      }

      reset();
      onClose();
    },
    onError: error => {
      console.error('Review submit error:', error);
      if (Platform.OS === 'web') {
        alert('후기 등록 중 오류가 발생했습니다.');
      } else {
        Alert.alert('오류', '후기 등록 중 오류가 발생했습니다.');
      }
    },
  });

  const isFormValid = reviewText.trim().length > 0;
  const isLoading = reviewMutation.isPending;

  const handleSubmit = () => {
    if (!reviewText.trim() || isLoading) return;
    reviewMutation.mutate(reviewText.trim());
  };

  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        (!isFormValid || isLoading) && styles.primaryButtonDisabled,
      ]}
      onPress={handleSubmit}
      disabled={!isFormValid || isLoading}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.primaryButtonText,
          (!isFormValid || isLoading) && styles.primaryButtonTextDisabled,
        ]}
      >
        {isLoading ? '등록 중...' : '후기 등록 완료'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  primaryButtonTextDisabled: {
    color: '#C0C0C0',
  },
});
