'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';
import { RightSlideModal } from '@/components/modal/RightSlideModal';
import { useChatDetailStore } from './_state/useChatDetailStore';
import { ChatDetailHeaderArea } from './_area/ChatDetailHeader.area';
import { ChatMessageListArea } from './_area/ChatMessageList.area';
import { ChatTopicChipsAction } from './_action/ChatTopicChips.action';
import { ChatInputAction } from './_action/ChatInput.action';

export function ChatDetailScreen() {
  const insets = useSafeAreaInsets();
  const { visible, leaveChatRoom } = useChatDetailStore(
    useShallow(state => ({
      visible: state.visible,
      leaveChatRoom: state.leaveChatRoom,
    })),
  );

  return (
    <RightSlideModal
      visible={visible}
      onClose={leaveChatRoom}
      width="100%"
      hideBackdrop={false}
      enablePanGesture={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <ChatDetailHeaderArea />

        <ChatMessageListArea />

        <View
          style={[
            styles.bottomFixedArea,
            { paddingBottom: Math.max(insets.bottom, 12) },
          ]}
        >
          <ChatTopicChipsAction />
          <ChatInputAction />
        </View>
      </KeyboardAvoidingView>
    </RightSlideModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bottomFixedArea: {
    backgroundColor: '#FFFFFF',
  },
});
