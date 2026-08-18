'use client';

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRelationshipQuizStore } from '../_state/useRelationshipQuizStore';
import { QUIZ_QUESTIONS } from '../_lib/quizData.lib';

export function QuizQuestionTextAction() {
  const currentStep = useRelationshipQuizStore(state => state.currentStep);
  const currentQ = QUIZ_QUESTIONS[currentStep];

  return <Text style={styles.questionText}>{currentQ.question}</Text>;
}

const styles = StyleSheet.create({
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 23,
    marginBottom: 20,
  },
});
