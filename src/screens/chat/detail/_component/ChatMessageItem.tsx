import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Message } from '../_model/chatDetail.model';

interface ChatMessageItemProps {
  message: Message;
}

function renderParsedText(text: string, isUser: boolean) {
  if (!text) return '';
  const parts = text.split('**');
  if (parts.length === 1) {
    return text;
  }
  return parts.map((part, index) => {
    const isBold = index % 2 === 1;
    return (
      <Text
        key={index}
        style={isBold ? (isUser ? styles.boldTextUser : styles.boldText) : undefined}
      >
        {part}
      </Text>
    );
  });
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === 'user';

  return (
    <View
      style={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowAi,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.messageBubbleUser : styles.messageBubbleAi,
        ]}
      >
        <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
          {renderParsedText(message.text, isUser)}
        </Text>
        <Text style={[styles.timestampText, isUser && styles.timestampUser]}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
    maxWidth: '86%',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  aiAvatarImg: {
    width: 38,
    height: 38,
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  messageBubbleUser: {
    backgroundColor: '#FF5D7B',
    borderBottomRightRadius: 4,
  },
  messageBubbleAi: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14.5,
    color: '#1E293B',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  boldText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  boldTextUser: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'right',
  },
  timestampUser: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
