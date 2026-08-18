'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CenterModal } from '@/components/modal';
import { QuizHeaderArea } from './_area/QuizHeader.area';
import { QuizProgressArea } from './_area/QuizProgress.area';
import { QuizContentArea } from './_area/QuizContent.area';

interface RelationshipQuizScreenProps {
  onClose: () => void;
}

export function RelationshipQuizScreen({
  onClose,
}: RelationshipQuizScreenProps) {
  return (
    <CenterModal
      visible={true}
      onClose={onClose}
      maxWidth={420}
      width="92%"
      dismissOnBackdropPress={true}
    >
      <View style={styles.modalCard}>
        <QuizHeaderArea />
        <QuizProgressArea />
        <QuizContentArea />
      </View>
    </CenterModal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    padding: 24,
    maxHeight: 520,
  },
});
