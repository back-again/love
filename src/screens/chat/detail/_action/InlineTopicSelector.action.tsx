'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useChatDetailStore } from '../_state/useChatDetailStore';
import { COMPREHENSIVE_TOPICS } from '../_lib/getDoorimiResponse.lib';

export function InlineTopicSelectorAction() {
  const sendMessage = useChatDetailStore(state => state.sendMessage);

  return (
    <View style={styles.topicsContainer}>
      <Text style={styles.headerText}>추천 상담 주제 선택</Text>
      <View style={styles.listWrap}>
        {COMPREHENSIVE_TOPICS.map((topic, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.topicBtn}
            onPress={() => sendMessage(topic)}
            activeOpacity={0.8}
          >
            <Text style={styles.topicText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topicsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
    marginBottom: 16,
    alignSelf: 'flex-end',
    width: '86%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  listWrap: {
    gap: 8,
  },
  topicBtn: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
  },
  topicText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
  },
});
