'use client';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { createPost } from '../_lib/createPost.lib';
import { updatePost } from '../_lib/updatePost.lib';
import { inspectPostQualityLib } from '../_lib/inspectPostQuality.lib';
import { navigate } from '@/_lib/navigation';
import { useFeedStore } from '@/screens/feed/_state/useFeedStore';
import { useToastStore } from '@/_state/useToastStore';

export function CreateSubmitAction() {
  const queryClient = useQueryClient();

  const {
    questionTitle,
    category,
    detailSituation,
    images,
    voteO,
    voteX,
    isEditMode,
    editPostId,
    reset,
  } = useCreateForm(
    useShallow(state => ({
      questionTitle: state.questionTitle,
      category: state.category,
      detailSituation: state.detailSituation,
      images: state.images,
      voteO: state.voteO,
      voteX: state.voteX,
      isEditMode: state.isEditMode,
      editPostId: state.editPostId,
      reset: state.reset,
    })),
  );

  const isFormValid =
    questionTitle.trim().length > 0 &&
    category.trim().length > 0 &&
    detailSituation.trim().length > 0;

  const createMutation = useMutation({
    mutationFn: async () => {
      const inspection = await inspectPostQualityLib(
        questionTitle,
        detailSituation,
      );

      if (!inspection.isApproved) {
        throw new Error(
          inspection.message || '등록할 수 없는 사연 내용입니다.',
        );
      }

      const finalVoteO = voteO.trim();
      const finalVoteX = voteX.trim();

      if (isEditMode && editPostId) {
        return updatePost({
          id: editPostId,
          title: questionTitle.trim(),
          category,
          content: detailSituation.trim(),
          images,
          voteO: finalVoteO,
          voteX: finalVoteX,
        });
      }

      return createPost({
        title: questionTitle.trim(),
        category,
        content: detailSituation.trim(),
        images,
        voteO: finalVoteO,
        voteX: finalVoteX,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      useToastStore.showToast(
        isEditMode
          ? '사연이 성공적으로 수정되었습니다!'
          : '사연이 성공적으로 등록되었습니다!',
      );

      reset();
      useFeedStore.getState().setSelectedCategoryId(null);
      navigate('Feed');
    },
    onError: (error: any) => {
      console.error('Submit post error:', error);
      useToastStore.showToast(
        error?.message ||
          (isEditMode
            ? '수정 중 오류가 발생했습니다.'
            : '등록 중 오류가 발생했습니다.'),
      );
    },
  });

  const isLoading = createMutation.isPending;

  return (
    <TouchableOpacity
      style={[
        styles.submitButton,
        (!isFormValid || isLoading) && styles.submitButtonDisabled,
      ]}
      onPress={() => createMutation.mutate()}
      disabled={!isFormValid || isLoading}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.submitButtonText,
          (!isFormValid || isLoading) && styles.submitButtonTextDisabled,
        ]}
      >
        {isLoading
          ? isEditMode
            ? '수정 중...'
            : '등록 중...'
          : isEditMode
            ? '수정 완료'
            : '작성 완료'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFFFFF',
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
    color: '#8F8F8F',
    fontWeight: '700',
  },
});
