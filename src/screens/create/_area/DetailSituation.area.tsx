import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DetailSituationInputAction } from '../_action/DetailSituationInput.action';

export function DetailSituationArea() {
  return (
    <View style={styles.createSection}>
      <Text style={styles.createSectionTitle}>구체적인 상황을 알려주세요</Text>
      <Text style={styles.createSectionSub}>
        어떤 배경이 있었고, 당시 어떻게 대처했나요?
      </Text>
      <DetailSituationInputAction />
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
  },
  createSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  createSectionSub: {
    fontSize: 14,
    color: '#8F8F8F',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
});
