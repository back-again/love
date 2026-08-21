import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { VoteOptionInputAction } from '../_action/VoteOptionInput.action';
import { AiVoteRecommendAction } from '../_action/AiVoteRecommend.action';

export function VoteOptionSettingArea() {
  return (
    <View style={styles.createSection}>
      <View style={styles.titleRow}>
        <View style={styles.titleTextWrap}>
          <Text style={styles.createSectionTitle}>
            OX
            <Text style={styles.requiredAsterisk}> *</Text>
          </Text>
          <Text style={styles.createSectionSub}>
            선택지를 직접 입력해 피드백을 받아보세요.
          </Text>
        </View>
        <AiVoteRecommendAction />
      </View>

      <View style={styles.optionsContent}>
        <VoteOptionInputAction />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
    position: 'relative',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleTextWrap: {
    flex: 1,
    paddingRight: 16,
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
  },
  optionsContent: {
    marginTop: 4,
  },
});
