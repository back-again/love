import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AiVoteRecommendAction } from '../_action/AiVoteRecommend.action';
import { VoteOptionInputAction } from '../_action/VoteOptionInput.action';

export function VoteOptionSettingArea() {
  return (
    <View style={styles.createSection}>
      <View style={styles.titleWrap}>
        <Text style={styles.createSectionTitle}>OX로 빠른 의견 받기</Text>
        <Text style={styles.createSectionSub}>
          AI가 사연을 분석해 맞춤 선택지를 제안합니다.
        </Text>
      </View>
      <AiVoteRecommendAction />
      <VoteOptionInputAction />
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
    position: 'relative',
  },
  titleWrap: {
    paddingRight: 90,
    marginBottom: 12,
  },
  createSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  createSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    letterSpacing: -0.3,
  },
});
