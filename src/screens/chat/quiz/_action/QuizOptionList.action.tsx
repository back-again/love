'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useRelationshipQuizStore } from '../_state/useRelationshipQuizStore';
import { useRelationshipQuizModalStore } from '../../_state/useRelationshipQuizModalStore';
import { QUIZ_QUESTIONS } from '../_lib/quizData.lib';

export function QuizOptionListAction() {
  const queryClient = useQueryClient();
  const closeQuizModal = useRelationshipQuizModalStore(
    state => state.closeQuizModal,
  );

  const { currentStep, selectOption } = useRelationshipQuizStore(
    useShallow(state => ({
      currentStep: state.currentStep,
      selectOption: state.selectOption,
    })),
  );

  const currentQ = QUIZ_QUESTIONS[currentStep];

  const handleSelect = (trait: string) => {
    selectOption(trait, () => {
      queryClient.invalidateQueries({ queryKey: ['relationshipProfile'] });
      closeQuizModal();
    });
  };

  return (
    <View style={styles.optionsWrap}>
      {currentQ.options.map((opt, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.optionBtn}
          onPress={() => handleSelect(opt.trait)}
          activeOpacity={0.8}
        >
          <Text style={styles.optionText}>{opt.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  optionsWrap: {
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
  },
});
