import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { QuestionHeartSvg } from '../_svg';
import { StatSegmentRow } from '../_component/StatSegmentRow';
import { StartQuizButtonAction } from '../_action/StartQuizButton.action';

export function ProfileQuizPromptArea() {
  return (
    <View style={styles.singleProfileCard}>
      {/* 1. Main Archetype Title */}
      <Text
        style={[
          styles.archetypeMainTitle,
          { color: '#8F8F8F', textAlign: 'center' },
        ]}
      >
        나의 연애 유형
      </Text>

      {/* 2. Catchphrase */}
      <Text style={[styles.archetypeSubText, { textAlign: 'center' }]}>
        아직 분석된 연애 성향이 없어요
      </Text>

      {/* 3. Center Graphic Illustration */}
      <View
        style={[
          styles.archetypeGraphicWrap,
          { marginVertical: 12, alignItems: 'center' },
        ]}
      >
        <QuestionHeartSvg />
      </View>

      {/* 4. Grayed Out Tendency Segmented Progress Bars */}
      <View style={[styles.statsContainer, { marginBottom: 20 }]}>
        {[
          { label: '표현 솔직도' },
          { label: '애정 집착도' },
          { label: '감정 포용력' },
          { label: '갈등 해결력' },
        ].map((stat, idx) => (
          <StatSegmentRow key={idx} label={stat.label} level={0} />
        ))}
      </View>

      <View style={[styles.profileDividerLight, { marginVertical: 16 }]} />

      {/* 5. Start Quiz Button Action */}
      <StartQuizButtonAction />
    </View>
  );
}

const styles = StyleSheet.create({
  singleProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    marginBottom: 28,
    position: 'relative',
  },
  archetypeMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FF5D7B',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  archetypeSubText: {
    fontSize: 13,
    color: '#8F8F8F',
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  archetypeGraphicWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  statsContainer: {
    marginTop: 14,
    gap: 8,
  },
  profileDividerLight: {
    width: '100%',
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
});
