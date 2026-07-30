'use client';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { createPost } from '../_lib/createPost.lib';

export function CreateSubmitAction() {
  const {
    questionTitle,
    detailSituation,
    images,
    isSubmitting,
    setIsSubmitting,
    reset,
  } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      images: state.images,
      isSubmitting: state.isSubmitting,
      setIsSubmitting: state.setIsSubmitting,
      reset: state.reset,
    }))
  );

  const createMutation = useMutation({
    mutationFn: () =>
      createPost({
        title: questionTitle.trim(),
        content: detailSituation.trim(),
        images,
      }),
    onSuccess: () => {
      if (Platform.OS === 'web') {
        alert('오답노트에 사연이 성공적으로 등록되었습니다!');
      } else {
        Alert.alert('완료', '오답노트에 사연이 성공적으로 등록되었습니다!');
      }
      reset();
    },
    onError: (error) => {
      console.error('Create post error:', error);
      if (Platform.OS === 'web') {
        alert('등록 중 오류가 발생했습니다.');
      } else {
        Alert.alert('오류', '등록 중 오류가 발생했습니다.');
      }
      setIsSubmitting(false);
    },
  });

  const isFormValid =
    questionTitle.trim().length > 0 && detailSituation.trim().length > 0;
  const isLoading = isSubmitting || createMutation.isPending;

  const handleSubmit = () => {
    if (!isFormValid || isLoading) return;
    setIsSubmitting(true);
    createMutation.mutate();
  };

  return (
    <TouchableOpacity
      style={[
        styles.submitButton,
        (!isFormValid || isLoading) && styles.submitButtonDisabled,
      ]}
      onPress={handleSubmit}
      disabled={!isFormValid || isLoading}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.submitButtonText,
          (!isFormValid || isLoading) && styles.submitButtonTextDisabled,
        ]}
      >
        {isLoading ? '등록 중...' : '작성 완료'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8E7A',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#FF8E7A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  submitButtonTextDisabled: {
    color: '#9C9C9C',
    fontWeight: '700',
  },
});
