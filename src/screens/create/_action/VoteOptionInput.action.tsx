'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { getDefaultVoteOptions } from '../_lib/getDefaultVoteOptions.lib';

export function VoteOptionInputAction() {
  const {
    questionTitle,
    detailSituation,
    voteO,
    voteX,
    setVoteO,
    setVoteX,
  } = useCreateForm(
    useShallow(state => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      voteO: state.voteO,
      voteX: state.voteX,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
    }))
  );

  const [focusedField, setFocusedField] = useState<'O' | 'X' | null>(null);
  const isManuallyEditedRef = useRef(false);

  useEffect(() => {
    if (!isManuallyEditedRef.current && !voteO && !voteX) {
      const defaults = getDefaultVoteOptions(questionTitle, detailSituation);
      setVoteO(defaults.voteO);
      setVoteX(defaults.voteX);
    }
  }, [questionTitle, detailSituation, voteO, voteX, setVoteO, setVoteX]);

  return (
    <View style={styles.container}>
      {/* Option O Input Row */}
      <View style={styles.inputRow}>
        <View style={styles.badgeO}>
          <Text style={styles.badgeTextO}>O</Text>
        </View>
        <TextInput
          style={[
            styles.optionInput,
            focusedField === 'O' && styles.optionInputActiveO,
            Platform.OS === 'web' && focusedField === 'O'
              ? ({ boxShadow: '0 0 0 3px rgba(139, 117, 249, 0.15)' } as any)
              : {},
          ]}
          placeholder="O 선택지 직접 입력 (예: 괜찮은 것 같아)"
          placeholderTextColor="#8F8F8F"
          value={voteO}
          onChangeText={text => {
            isManuallyEditedRef.current = true;
            setVoteO(text);
          }}
          onFocus={() => setFocusedField('O')}
          onBlur={() => setFocusedField(null)}
          maxLength={20}
        />
      </View>

      {/* Option X Input Row */}
      <View style={styles.inputRow}>
        <View style={styles.badgeX}>
          <Text style={styles.badgeTextX}>X</Text>
        </View>
        <TextInput
          style={[
            styles.optionInput,
            focusedField === 'X' && styles.optionInputActiveX,
            Platform.OS === 'web' && focusedField === 'X'
              ? ({ boxShadow: '0 0 0 3px rgba(249, 117, 141, 0.15)' } as any)
              : {},
          ]}
          placeholder="X 선택지 직접 입력 (예: 난 별로야)"
          placeholderTextColor="#8F8F8F"
          value={voteX}
          onChangeText={text => {
            isManuallyEditedRef.current = true;
            setVoteX(text);
          }}
          onFocus={() => setFocusedField('X')}
          onBlur={() => setFocusedField(null)}
          maxLength={20}
        />
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
    color: '#F9758D',
  },
  optionInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  optionInputActiveO: {
    borderColor: '#8B75F9',
    borderWidth: 1,
  },
  optionInputActiveX: {
    borderColor: '#F9758D',
    borderWidth: 1,
  },
});
