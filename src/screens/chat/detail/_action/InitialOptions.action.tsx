'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useChatDetailStore } from '../_state/useChatDetailStore';

export function InitialOptionsAction() {
  const selectInitialOption = useChatDetailStore(state => state.selectInitialOption);

  return (
    <View style={styles.optionsContainer}>
      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => selectInitialOption('POSTS')}
        activeOpacity={0.8}
      >
        <Text style={styles.optionText}>작성한 고민에 대해 얘기할래</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => selectInitialOption('TOPICS')}
        activeOpacity={0.8}
      >
        <Text style={styles.optionText}>상담 추천 주제가 뭐야?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionBtn}
        onPress={() => selectInitialOption('CHAT')}
        activeOpacity={0.8}
      >
        <Text style={styles.optionText}>그냥 대화하고 싶어</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    alignSelf: 'flex-end',
    width: '86%',
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FFD1DC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FF5D7B',
  },
});
