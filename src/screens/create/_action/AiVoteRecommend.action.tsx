'use client';

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { generateAiVoteOptions } from '../_lib/generateVoteOptions.lib';
import { useToastStore } from '@/_state/useToastStore';

export function AiVoteRecommendAction() {
  const { questionTitle, detailSituation, setVoteO, setVoteX } = useCreateForm(
    useShallow(state => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
    })),
  );

  const { mutate: runAiRecommend, isPending: isLoadingAi } = useMutation({
    mutationFn: async () => {
      return await generateAiVoteOptions(questionTitle, detailSituation);
    },
    onSuccess: generated => {
      if (generated.oText) setVoteO(generated.oText);
      if (generated.xText) setVoteX(generated.xText);
    },
    onError: () => {
      useToastStore.showToast('AI 추천 생성에 실패했습니다.');
    },
  });

  const handlePress = () => {
    if (!questionTitle.trim() || !detailSituation.trim()) {
      useToastStore.showToast('제목과 구체적인 상황을 먼저 입력해 주세요.');
      return;
    }
    runAiRecommend();
  };

  const isFormFilled = Boolean(questionTitle.trim() && detailSituation.trim());

  return (
    <TouchableOpacity
      style={[
        styles.aiButton,
        (isLoadingAi || !isFormFilled) && styles.aiButtonDisabled,
      ]}
      onPress={handlePress}
      activeOpacity={0.75}
      disabled={isLoadingAi}
    >
      {isLoadingAi ? (
        <ActivityIndicator size="small" color="#FF5D7B" />
      ) : (
        <Text style={styles.aiButtonText}>AI 추천</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  aiButton: {
    height: 34,
    minWidth: 76,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD6DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiButtonDisabled: {
    opacity: 0.6,
  },
  aiButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FF5D7B',
    letterSpacing: -0.2,
  },
});
