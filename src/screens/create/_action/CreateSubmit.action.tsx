import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Alert, View } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { createPost } from '../_lib/createPost.lib';
import { updatePost } from '../_lib/updatePost.lib';
import { useLocalPostsStore } from '@/screens/feed/_state/useLocalPostsStore';

export function CreateSubmitAction() {
  const queryClient = useQueryClient();
  const {
    questionTitle,
    category,
    detailSituation,
    images,
    voteO,
    voteX,
    isVoteEnabled,
    isEditMode,
    editPostId,
    reset,
  } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      category: state.category,
      detailSituation: state.detailSituation,
      images: state.images,
      voteO: state.voteO,
      voteX: state.voteX,
      isVoteEnabled: state.isVoteEnabled,
      isEditMode: state.isEditMode,
      editPostId: state.editPostId,
      reset: state.reset,
    }))
  );

  const createMutation = useMutation({
    mutationFn: () => {
      if (isEditMode && editPostId) {
        return updatePost({
          id: editPostId,
          title: questionTitle.trim(),
          category,
          content: detailSituation.trim(),
          images,
          voteO: isVoteEnabled ? voteO.trim() : '',
          voteX: isVoteEnabled ? voteX.trim() : '',
        });
      }
      return createPost({
        title: questionTitle.trim(),
        category,
        content: detailSituation.trim(),
        images,
        voteO: isVoteEnabled ? voteO.trim() : '',
        voteX: isVoteEnabled ? voteX.trim() : '',
      });
    },
    onSuccess: (newPostData) => {
      if (newPostData) {
        useLocalPostsStore.getState().addPost({
          id: newPostData.id || String(Date.now()),
          category: category || '고민',
          isHot: false,
          title: questionTitle.trim(),
          storySummary: detailSituation.trim(),
          fullStory: detailSituation.trim(),
          images: newPostData.images || images || [],
          voteO: voteO.trim() || '괜찮은데?',
          voteX: voteX.trim() || '난 싫어',
          topComments: [],
          reviewStatus: '후기 요청',
          reviewContent: '',
          hasReview: false,
          fireCount: 0,
          facepalmCount: 0,
          commentCount: 0,
          voteOCount: 0,
          voteXCount: 0,
          totalVoteCount: 0,
          totalVotes: 0,
          percentO: 50,
          percentX: 50,
          myVote: null,
          createdAt: new Date().toISOString(),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      if (Platform.OS === 'web') {
        alert(
          isEditMode
            ? '오답노트에 사연이 성공적으로 수정되었습니다!'
            : '오답노트에 사연이 성공적으로 등록되었습니다!'
        );
      } else {
        Alert.alert(
          '완료',
          isEditMode
            ? '오답노트에 사연이 성공적으로 수정되었습니다!'
            : '오답노트에 사연이 성공적으로 등록되었습니다!'
        );
      }
      reset();
    },
    onError: (error) => {
      console.error('Submit post error:', error);
      if (Platform.OS === 'web') {
        alert(isEditMode ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.');
      } else {
        Alert.alert('오류', isEditMode ? '수정 중 오류가 발생했습니다.' : '등록 중 오류가 발생했습니다.');
      }
    },
  });

  const isFormValid =
    questionTitle.trim().length > 0 &&
    category.trim().length > 0 &&
    detailSituation.trim().length > 0;
  const isLoading = createMutation.isPending;

  const handleSubmit = () => {
    if (!isFormValid || isLoading) return;
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
        {isLoading ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '수정 완료' : '작성 완료')}
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
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
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
    color: '#8F8F8F',
    fontWeight: '700',
  },
});
