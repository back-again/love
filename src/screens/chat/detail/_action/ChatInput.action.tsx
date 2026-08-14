'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useChatDetailStore } from '../_state/useChatDetailStore';
import { SendPlaneSvg } from '../_svg';

export function ChatInputAction() {
  const { inputText, setInputText, sendMessage, isTyping } = useChatDetailStore(
    useShallow(state => ({
      inputText: state.inputText,
      setInputText: state.setInputText,
      sendMessage: state.sendMessage,
      isTyping: state.isTyping,
    })),
  );

  const canSend = inputText.trim().length > 0 && !isTyping;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage();
  };

  return (
    <View style={styles.inputContainerInline}>
      <TextInput
        style={styles.input}
        placeholder="상담하실 내용을 자유롭게 입력하세요..."
        placeholderTextColor="#8F8F8F"
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleSend}
      />

      <TouchableOpacity
        style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        onPress={handleSend}
        disabled={!canSend}
        activeOpacity={0.8}
      >
        <SendPlaneSvg color={canSend ? '#FFFFFF' : '#C0C0C0'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainerInline: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
});
