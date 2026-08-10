import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform, Alert, View } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { createPost } from '../_lib/createPost.lib';
import { inspectPostQualityWithAi } from '../_lib/aiModeration.lib';
import { AiInspectionModal } from '@/components/modal/AiInspectionModal';

export function CreateSubmitAction() {
  const { questionTitle, detailSituation, images, voteO, voteX, isVoteEnabled, reset } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      images: state.images,
      voteO: state.voteO,
      voteX: state.voteX,
      isVoteEnabled: state.isVoteEnabled,
      reset: state.reset,
    }))
  );

  const [aiModal, setAiModal] = useState<{
    visible: boolean;
    reason?: string;
    suggestion?: string;
  }>({
    visible: false,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createPost({
        title: questionTitle.trim(),
        content: detailSituation.trim(),
        images,
        voteO: isVoteEnabled ? voteO.trim() : '',
        voteX: isVoteEnabled ? voteX.trim() : '',
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
    },
  });

  const isFormValid =
    questionTitle.trim().length > 0 && detailSituation.trim().length > 0;
  const isLoading = createMutation.isPending;

  const handleSubmit = () => {
    if (!isFormValid || isLoading) return;

    // AI Post Quality Moderation Check
    const inspection = inspectPostQualityWithAi(questionTitle, detailSituation);
    if (!inspection.isValid) {
      setAiModal({
        visible: true,
        reason: inspection.reason,
        suggestion: inspection.suggestion,
      });
      return;
    }

    createMutation.mutate();
  };

  return (
    <>
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

      <AiInspectionModal
        visible={aiModal.visible}
        reason={aiModal.reason}
        suggestion={aiModal.suggestion}
        onClose={() => setAiModal(prev => ({ ...prev, visible: false }))}
      />
    </>
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
