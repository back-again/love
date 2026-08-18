'use client';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRelationshipQuizStore } from '../_state/useRelationshipQuizStore';
import { QUIZ_QUESTIONS } from '../_lib/quizData.lib';

export function QuizStepBadgeAction() {
  const currentStep = useRelationshipQuizStore(state => state.currentStep);

  return (
    <Text style={styles.stepBadge}>
      {currentStep + 1} / {QUIZ_QUESTIONS.length}
    </Text>
  );
}

const styles = StyleSheet.create({
  stepBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5D7B',
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
