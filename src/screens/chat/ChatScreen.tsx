'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatScreenProps {
  onGoToCreate?: () => void;
}

export default function ChatScreen({ onGoToCreate }: ChatScreenProps) {
  const handleNotifyRequest = () => {
    Alert.alert('알림 신청 완료 🔔', 'AI 연애 상담 서비스가 오픈되면 가장 먼저 알려드릴게요!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Top Floating Badge */}
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonBadgeText}>✨ COMING SOON</Text>
        </View>

        {/* Robot Illustration Card */}
        <View style={styles.illustrationCircleOuter}>
          <LinearGradient
            colors={['#FFEBF0', '#FFF5F7']}
            style={styles.illustrationCircleInner}
          >
            <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
              <Rect x={3} y={4} width={18} height={13} rx={5} fill="#FF4D7B" />
              <Circle cx={8.5} cy={10.5} r={1.8} fill="#FFFFFF" />
              <Circle cx={15.5} cy={10.5} r={1.8} fill="#FFFFFF" />
              <Path
                d="M9 13.8c.8 1 2.2 1 3 0"
                stroke="#FFFFFF"
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Path
                d="M12 17v4M9 21h6"
                stroke="#FF4D7B"
                strokeWidth={2.2}
                strokeLinecap="round"
              />
            </Svg>
          </LinearGradient>
        </View>

        {/* Main Headings */}
        <Text style={styles.mainTitle}>AI 연애 상담사 🤖</Text>
        <Text style={styles.subTitle}>
          혼자 끙끙 앓던 연애 고민,{'\n'}스마트한 AI 카운슬러가 준비 중입니다!
        </Text>

        {/* Info Box */}
        <View style={styles.infoBoxCard}>
          <Text style={styles.infoBoxTitle}>🛠️ 서비스 준비 중입니다</Text>
          <Text style={styles.infoBoxText}>
            더 정확하고 따뜻한 맞춤형 연애 솔루션을 제공하기 위해 AI 상담 모델을 다듬고 있어요.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.notifyButtonTouch}
            onPress={handleNotifyRequest}
            activeOpacity={0.88}
          >
            <LinearGradient
              colors={['#FF4D7B', '#FF758F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.notifyButtonGradient}
            >
              <Text style={styles.notifyButtonText}>오픈 알림 신청하기 🔔</Text>
            </LinearGradient>
          </TouchableOpacity>

          {onGoToCreate && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onGoToCreate}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>먼저 고민 사연 작성하기 ✍️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  comingSoonBadge: {
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 20,
  },
  comingSoonBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FF4D7B',
    letterSpacing: 0.5,
  },
  illustrationCircleOuter: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  illustrationCircleInner: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  infoBoxCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 19,
  },
  actionRow: {
    width: '100%',
    gap: 10,
  },
  notifyButtonTouch: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  notifyButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});
