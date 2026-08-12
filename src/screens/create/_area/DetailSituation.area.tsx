import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { DetailSituationInputAction } from '../_action/DetailSituationInput.action';

export function DetailSituationArea() {
  return (
    <View style={styles.createSection}>
      <Text style={styles.createSectionTitle}>
        구체적인 상황을 알려주세요
        <Text style={styles.requiredAsterisk}> *</Text>
      </Text>
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
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  requiredAsterisk: {
    color: '#FF5D7B',
    fontWeight: '800',
  },
  createSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
});
