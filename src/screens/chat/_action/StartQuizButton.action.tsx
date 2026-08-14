'use client';

import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRelationshipQuizModalStore } from '../_state/useRelationshipQuizModalStore';

export function StartQuizButtonAction() {
  const openQuizModal = useRelationshipQuizModalStore(
    state => state.openQuizModal,
  );

  return (
    <TouchableOpacity
      style={styles.startQuizBtnWrapper}
      onPress={openQuizModal}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={['#FF5D7B', '#FE92AC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.startQuizBtnGradient}
      >
        <Text style={styles.startQuizBtnText}>나의 연애 성향 분석하기</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  startQuizBtnWrapper: {
    alignSelf: 'center',
  },
  startQuizBtnGradient: {
    paddingHorizontal: 24,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startQuizBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
