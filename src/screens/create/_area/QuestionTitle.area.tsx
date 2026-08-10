import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { QuestionTitleInputAction } from '../_action/QuestionTitleInput.action';

export function QuestionTitleArea() {
  return (
    <View style={styles.createSection}>
      <Text style={styles.createSectionTitle}>무엇을 물어볼까요?</Text>
      <QuestionTitleInputAction />
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
  },
  createSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
});
