'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useChatDetailStore } from '../_state/useChatDetailStore';

export function InitialOptionsAction() {
  const selectInitialOption = useChatDetailStore(state => state.selectInitialOption);

  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.optionsWrap}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    padding: 14,
    width: '80%',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  promptText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF5D7B',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionsWrap: {
    gap: 8,
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF5D7B',
  },
});
