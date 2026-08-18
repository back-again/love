'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRelationshipQuizStore } from '../_state/useRelationshipQuizStore';
import { QUIZ_QUESTIONS } from '../_lib/quizData.lib';

export function QuizProgressBarAction() {
  const currentStep = useRelationshipQuizStore(state => state.currentStep);
  const progressPercent = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <View
      style={[
        styles.progressBarFill,
        { width: `${progressPercent}%` },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF5D7B',
    borderRadius: 2,
  },
});
