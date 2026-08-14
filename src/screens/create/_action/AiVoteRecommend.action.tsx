'use client';

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { generateAiVoteOptions } from '../_lib/generateVoteOptions.lib';

export function AiVoteRecommendAction() {
  const {
    questionTitle,
    detailSituation,
    setVoteO,
    setVoteX,
  } = useCreateForm(
    useShallow(state => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
    }))
  );

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleRunAiRecommendation = () => {
    if (isLoadingAi) return;

    setIsLoadingAi(true);
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 850,
      useNativeDriver: false,
    }).start(async () => {
      const generated = await generateAiVoteOptions(
        questionTitle,
        detailSituation,
      );
      if (generated.oText) setVoteO(generated.oText);
      if (generated.xText) setVoteX(generated.xText);

      setIsLoadingAi(false);
    });
  };

  const progressPercent = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <>
      <TouchableOpacity
        style={[styles.aiButton, isLoadingAi && styles.aiButtonDisabled]}
        onPress={handleRunAiRecommendation}
        activeOpacity={0.75}
        disabled={isLoadingAi}
      >
        <Text style={styles.aiButtonText}>✨ AI 추천</Text>
      </TouchableOpacity>

      {isLoadingAi && (
        <View style={styles.loadingProgressWrap}>
          <View style={styles.loadingTextRow}>
            <Text style={styles.loadingTitleText}>
              AI가 사연에 어울리는 선택지를 분석하고 있어요...
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressBarFill, { width: progressPercent }]}
            />
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  aiButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 34,
    paddingHorizontal: 12,
    backgroundColor: '#FFF0F3',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD6DF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
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
  loadingProgressWrap: {
    marginBottom: 12,
    marginTop: 4,
  },
  loadingTextRow: {
    marginBottom: 6,
  },
  loadingTitleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF5D7B',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FF5D7B',
  },
});
