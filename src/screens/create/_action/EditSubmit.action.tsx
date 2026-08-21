'use client';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { updatePost } from '../_lib/updatePost.lib';
import { inspectPostQualityLib } from '../_lib/inspectPostQuality.lib';
import { navigate } from '@/_lib/navigation';
import { useFeedStore } from '@/screens/feed/_state/useFeedStore';
import { useToastStore } from '@/_state/useToastStore';

export function EditSubmitAction() {
  const queryClient = useQueryClient();

  const {
    questionTitle,
    category,
    detailSituation,
    images,
    voteO,
    voteX,
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
      editPostId: state.editPostId,
      reset: state.reset,
    })),
  );

  const isFormValid =
    questionTitle.trim().length > 0 &&
    category.trim().length > 0 &&
    detailSituation.trim().length > 0 &&
    voteO.trim().length > 0 &&
    voteX.trim().length > 0 &&
    Boolean(editPostId);

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editPostId) {
        throw new Error('수정할 게시글 정보를 찾을 수 없습니다.');
      }

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

      return updatePost({
        id: editPostId,
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
      queryClient.invalidateQueries({ queryKey: ['writtenPosts'] });
      useToastStore.showToast('사연이 성공적으로 수정되었습니다!');

      reset();
      useFeedStore.getState().setSelectedCategoryId(null);
      navigate('Feed');
    },
    onError: (error: any) => {
      console.error('Submit edit post error:', error);
      useToastStore.showToast(
        error?.message || '수정 중 오류가 발생했습니다.',
      );
    },
  });

  const isLoading = updateMutation.isPending;

  const handleSubmit = () => {
    if (!category.trim()) {
      useToastStore.showToast('카테고리를 선택해 주세요.');
      return;
    }
    if (!questionTitle.trim()) {
      useToastStore.showToast('질문 제목을 입력해 주세요.');
      return;
    }
    if (!detailSituation.trim()) {
      useToastStore.showToast('구체적인 상황을 입력해 주세요.');
      return;
    }
    if (!voteO.trim()) {
      useToastStore.showToast('O 선택지를 입력해 주세요.');
      return;
    }
    if (!voteX.trim()) {
      useToastStore.showToast('X 선택지를 입력해 주세요.');
      return;
    }
    if (!editPostId) {
      useToastStore.showToast('수정할 게시글 정보를 찾을 수 없습니다.');
      return;
    }
    updateMutation.mutate();
  };

  return (
    <TouchableOpacity
      style={[
        styles.submitButton,
        (!isFormValid || isLoading) && styles.submitButtonDisabled,
      ]}
      onPress={handleSubmit}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.submitButtonText,
          (!isFormValid || isLoading) && styles.submitButtonTextDisabled,
        ]}
      >
        {isLoading ? '수정 중...' : '완료'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  submitButtonTextDisabled: {
    color: '#94A3B8',
    fontWeight: '700',
  },
});
