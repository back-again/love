'use client';

import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useChatDetailStore } from '../_state/useChatDetailStore';
import { ChatMessageItem } from '../_component/ChatMessageItem';
import { InlinePostDiagnosisAction } from '../_action/InlinePostDiagnosis.action';

export function ChatMessageListArea() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { messages, isTyping, hasDiagnosedPosts } = useChatDetailStore(
    useShallow(state => ({
      messages: state.messages,
      isTyping: state.isTyping,
      hasDiagnosedPosts: state.hasDiagnosedPosts,
    })),
  );

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.chatScrollView}
      contentContainerStyle={styles.chatContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {messages.map(msg => (
        <View key={msg.id} style={styles.messageBlockWrap}>
          <ChatMessageItem message={msg} />

          {msg.isPostSelectorPrompt && !hasDiagnosedPosts && (
            <InlinePostDiagnosisAction />
          )}
        </View>
      ))}

      {isTyping && (
        <View style={styles.typingRow}>
          <Image
            source={require('../../../../assets/counselor_momo.png')}
            style={styles.aiAvatarImg}
            resizeMode="contain"
          />
          <View style={styles.typingBubble}>
            <Text style={styles.typingText}>답변을 생각하는 중입니다...</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chatScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  messageBlockWrap: {
    width: '100%',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  aiAvatarImg: {
    width: 38,
    height: 38,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  typingText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
  },
});
