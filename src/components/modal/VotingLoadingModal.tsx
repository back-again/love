import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface VotingLoadingModalProps {
  visible: boolean;
  choice?: 'O' | 'X' | null;
}

export function VotingLoadingModal({ visible, choice }: VotingLoadingModalProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Continuous Rotation Animation
      spinAnim.setValue(0);
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Subtle Scale Pulse
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        <Animated.View style={[styles.modalCard, { transform: [{ scale: scaleAnim }] }]}>
          {/* Animated Spinner Icon Circle */}
          <View style={styles.iconCircleWrapper}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Svg width={44} height={44} viewBox="0 0 44 44" fill="none">
                <Circle
                  cx={22}
                  cy={22}
                  r={18}
                  stroke="#FFE2E8"
                  strokeWidth={4}
                />
                <Path
                  d="M22 4A18 18 0 0 1 40 22"
                  stroke="#FF5D7B"
                  strokeWidth={4}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>
            <View style={styles.centerBadgeTextWrap}>
              <Text style={[styles.centerBadgeText, choice === 'X' && styles.centerBadgeTextX]}>
                {choice || '✓'}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.loadingTitle}>투표 반영 중...</Text>

          {/* Subtitle */}
          <Text style={styles.loadingSub}>
            AI가 소중한 투표 의견을 기록하고 수치를 집계하는 중입니다.
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalCard: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircleWrapper: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  centerBadgeTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBadgeText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF5D7B',
  },
  centerBadgeTextX: {
    color: '#64748B',
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  loadingSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
});
