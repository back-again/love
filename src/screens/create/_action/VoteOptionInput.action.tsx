'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { AnimatedTextInputField } from '../_component/AnimatedTextInputField';

export function VoteOptionInputAction() {
  const { voteO, voteX, setVoteO, setVoteX } = useCreateForm(
    useShallow(state => ({
      voteO: state.voteO,
      voteX: state.voteX,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
    })),
  );

  return (
    <View style={styles.container}>
      {/* Option O Input Row */}
      <View style={styles.inputRow}>
        <View style={styles.badgeO}>
          <Text style={styles.badgeTextO}>O</Text>
        </View>
        <View style={styles.inputFlex}>
          <AnimatedTextInputField
            height={48}
            focusBorderColor="#8B75F9"
            focusShadowColor="rgba(139, 117, 249, 0.15)"
            placeholder="O 선택지 직접 입력 (최대 15자)"
            placeholderTextColor="#8F8F8F"
            value={voteO}
            onChangeText={setVoteO}
            maxLength={15}
          />
        </View>
      </View>

      {/* Option X Input Row */}
      <View style={styles.inputRow}>
        <View style={styles.badgeX}>
          <Text style={styles.badgeTextX}>X</Text>
        </View>
        <View style={styles.inputFlex}>
          <AnimatedTextInputField
            height={48}
            focusBorderColor="#FF5D7B"
            focusShadowColor="rgba(255, 93, 123, 0.15)"
            placeholder="X 선택지 직접 입력 (최대 15자)"
            placeholderTextColor="#8F8F8F"
            value={voteX}
            onChangeText={setVoteX}
            maxLength={15}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeO: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F5F1FF',
    borderWidth: 1,
    borderColor: '#E8E3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextO: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B75F9',
  },
  badgeX: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF3F4',
    borderWidth: 1,
    borderColor: '#FFE3E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextX: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF5D7B',
  },
  inputFlex: {
    flex: 1,
  },
});
