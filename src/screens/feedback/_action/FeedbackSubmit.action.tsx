'use client';

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useFeedbackForm } from '../_state/useFeedbackForm';
import { createFeedback } from '../_lib/createFeedback.lib';

interface FeedbackSubmitActionProps {
  onClose: () => void;
}

export function FeedbackSubmitAction({ onClose }: FeedbackSubmitActionProps) {
  const { feedbackText, feedbackSubmitted, setFeedbackSubmitted, reset } =
    useFeedbackForm(
      useShallow(state => ({
        feedbackText: state.feedbackText,
        feedbackSubmitted: state.feedbackSubmitted,
        setFeedbackSubmitted: state.setFeedbackSubmitted,
        reset: state.reset,
      })),
    );

  const feedbackMutation = useMutation({
    mutationFn: (content: string) => createFeedback({ content }),
    onSuccess: () => {
      if (Platform.OS === 'web') {
        alert('소중한 피드백이 전송되었습니다. 감사합니다!');
      } else {
        Alert.alert('완료', '소중한 피드백이 전송되었습니다. 감사합니다!');
      }

      reset();
      onClose();
    },
    onError: error => {
      console.error('Feedback submit error:', error);
      if (Platform.OS === 'web') {
        alert('피드백 전송 중 오류가 발생했습니다.');
      } else {
        Alert.alert('오류', '피드백 전송 중 오류가 발생했습니다.');
      }
      setFeedbackSubmitted(false);
    },
  });

  const isFormValid = feedbackText.trim().length > 0;
  const isLoading = feedbackSubmitted || feedbackMutation.isPending;

  const handleSendFeedback = () => {
    if (!feedbackText.trim() || isLoading) return;

    setFeedbackSubmitted(true);
    feedbackMutation.mutate(feedbackText.trim());
  };

  return (
    <TouchableOpacity
      style={[
        styles.submitButton,
        (!isFormValid || isLoading) && styles.submitButtonDisabled,
      ]}
      onPress={handleSendFeedback}
      disabled={!isFormValid || isLoading}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.submitButtonText,
          (!isFormValid || isLoading) && styles.submitButtonTextDisabled,
        ]}
      >
        {isLoading ? '전송 중...' : '피드백 전송하기'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 54,
    borderRadius: 16,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D6D6D6',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  submitButtonTextDisabled: {
    color: '#C0C0C0',
  },
});
