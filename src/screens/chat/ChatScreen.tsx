'use client';

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  '주말에 게임느라 연락 안 오는 남친',
  '권태기 극복하는 대화법',
  '헤어진 전애인 인스타 보는 심리',
];

export default function ChatScreen({ onGoToCreate }: { onGoToCreate?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: '안녕하세요! XOXO AI 연애 상담소입니다 💕\n연애나 사람 문제로 고민되는 일이나 궁금한 것이 있다면 무엇이든 편하게 이야기해주세요.',
      timestamp: '오후 1:20',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    // AI Simulated Response
    setTimeout(() => {
      let responseText = '고민이 많으시겠어요. 상대방과의 대화에서 서운한 점을 솔직하게 나누어보시는 건 어떨까요? 커뮤니티 피드에 투표 사연으로 올려서 다른 분들의 솔직한 반응을 확인해볼 수도 있어요!';
      
      if (textToSend.includes('연락')) {
        responseText = '연락 문제는 연애에서 정말 흔하지만 중요한 부분이에요. 서로의 라이프스타일 차이를 인정하면서, "주말에도 최소한의 안부 연락"이라는 규칙을 부드럽게 협의해보는 걸 추천해요.';
      } else if (textToSend.includes('권태기')) {
        responseText = '권태기에는 익숙함에서 오는 소홀함을 새로운 경험으로 바꾸는 것이 도움 돼요. 평소 가보지 않은 곳으로 데이트 코스를 바꾸거나 소소한 감사의 마음을 표현해보세요!';
      } else if (textToSend.includes('인스타') || textToSend.includes('전애인')) {
        responseText = '전애인의 SNS를 확인하는 심리는 단순 미련일 수도 있고, 미련 없이 그냥 호기심 때문일 수도 있어요. 하지만 내 마음의 평화를 위해 차츰 시선을 내 생활로 돌려보는 것이 가장 좋습니다.';
      }

      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        style={styles.chatScrollView}
        contentContainerStyle={styles.chatContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Suggested Prompts Banner */}
        <View style={styles.promptBannerContainer}>
          <Text style={styles.promptBannerTitle}>💡 이런 주제로 이야기해볼까요?</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.promptScroll}>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.promptChip}
                onPress={() => handleSend(prompt)}
                activeOpacity={0.8}
              >
                <Text style={styles.promptChipText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Message Bubbles */}
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowAi,
              ]}
            >
              {!isUser && (
                <View style={styles.aiAvatar}>
                  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={12} r={10} fill="#FF4D7B" />
                    <Path d="M8 12h8M12 8v8" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" />
                  </Svg>
                </View>
              )}
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.messageBubbleUser : styles.messageBubbleAi,
                ]}
              >
                <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
                  {msg.text}
                </Text>
                <Text style={[styles.timestampText, isUser && styles.timestampUser]}>
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowAi]}>
            <View style={styles.aiAvatar}>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} fill="#FF4D7B" />
              </Svg>
            </View>
            <View style={[styles.messageBubble, styles.messageBubbleAi]}>
              <Text style={styles.typingText}>AI가 답변을 작성 중입니다...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="AI에게 연애 고민을 물어보세요..."
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => handleSend()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={() => handleSend()}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
              stroke={inputText.trim() ? '#FFFFFF' : '#CBD5E1'}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatScrollView: {
    flex: 1,
  },
  chatContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  promptBannerContainer: {
    marginBottom: 20,
    backgroundColor: '#FEEBED',
    borderRadius: 16,
    padding: 14,
  },
  promptBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F9758D',
    marginBottom: 10,
  },
  promptScroll: {
    flexDirection: 'row',
  },
  promptChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FEB5C9',
  },
  promptChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#727272',
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEEBED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#F9758D',
    borderBottomRightRadius: 4,
  },
  messageBubbleAi: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#0F172A',
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 10,
    color: '#8F8F8F',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  typingText: {
    fontSize: 13,
    color: '#8F8F8F',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    marginBottom: Platform.OS === 'ios' ? 70 : 60,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
    marginRight: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
});
