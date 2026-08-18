'use client';

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useRelationshipQuizModalStore } from '../../_state/useRelationshipQuizModalStore';
import { useRelationshipQuizStore } from '../_state/useRelationshipQuizStore';
import { CloseSvg } from '../_svg';

export function QuizCloseButtonAction() {
  const closeQuizModal = useRelationshipQuizModalStore(
    state => state.closeQuizModal,
  );
  const resetQuiz = useRelationshipQuizStore(state => state.resetQuiz);

  const handleClose = () => {
    resetQuiz();
    closeQuizModal();
  };

  return (
    <TouchableOpacity
      style={styles.closeBtn}
      onPress={handleClose}
      activeOpacity={0.7}
    >
      <CloseSvg />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
});
