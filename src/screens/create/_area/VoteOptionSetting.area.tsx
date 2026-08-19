import React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { VoteOptionInputAction } from '../_action/VoteOptionInput.action';

export function VoteOptionSettingArea() {
  const { hasVote, setHasVote } = useCreateForm(
    useShallow(state => ({
      hasVote: state.hasVote,
      setHasVote: state.setHasVote,
    }))
  );

  return (
    <View style={styles.createSection}>
      <View style={styles.titleRow}>
        <View style={styles.titleTextWrap}>
          <Text style={styles.createSectionTitle}>OX로 빠른 의견 받기</Text>
          <Text style={styles.createSectionSub}>
            선택지를 직접 입력해 피드백을 받아보세요.
          </Text>
        </View>
        <Switch
          value={hasVote}
          onValueChange={setHasVote}
          trackColor={{ false: '#E2E8F0', true: '#FFB5C5' }}
          thumbColor={hasVote ? '#FF5D7B' : '#F4F4F5'}
          ios_backgroundColor="#E2E8F0"
        />
      </View>

      {hasVote && (
        <View style={styles.optionsContent}>
          <VoteOptionInputAction />
        </View>
      )}
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
