import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { QuizStepBadgeAction } from '../_action/QuizStepBadge.action';
import { QuizCloseButtonAction } from '../_action/QuizCloseButton.action';

export function QuizHeaderArea() {
  return (
    <View style={styles.modalHeaderRow}>
      <View style={styles.headerTitleWrap}>
        <Text style={styles.modalTitle}>내 연애 추구미 분석</Text>
        <QuizStepBadgeAction />
      </View>

      <QuizCloseButtonAction />
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
});
