'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useChatDetailStore } from '../_state/useChatDetailStore';
import { COMPREHENSIVE_TOPICS } from '../_lib/getDoorimiResponse.lib';

export function ChatTopicChipsAction() {
  const sendMessage = useChatDetailStore(state => state.sendMessage);

  return (
    <View style={styles.chatTopicsBannerFloating}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chatTopicsScrollContent}
      >
        {COMPREHENSIVE_TOPICS.map((topic, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.chatTopicChip}
            onPress={() => sendMessage(topic)}
            activeOpacity={0.8}
          >
            <Text style={styles.chatTopicChipText}>{topic}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chatTopicsBannerFloating: {
    marginBottom: 8,
  },
  chatTopicsScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chatTopicChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  chatTopicChipText: {
    fontSize: 12.5,
    color: '#FF5D7B',
    fontWeight: '600',
  },
});
