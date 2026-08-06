import React, { ReactNode } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface FeedItemReactionChipProps {
  emoji?: string;
  icon?: ReactNode;
  count: number | string;
  isActive?: boolean;
  onPress?: () => void;
}

export function FeedItemReactionChip({
  emoji,
  icon,
  count,
  isActive = false,
  onPress,
}: FeedItemReactionChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.reactionChip,
        isActive && styles.activeReactionChip,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={!onPress}
    >
      {Platform.OS !== 'web' && (
        <BlurView
          intensity={25}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {emoji ? <Text style={styles.chipEmoji}>{emoji}</Text> : icon}
      <Text style={[styles.chipCount, isActive && styles.activeChipCount]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  reactionChip: {
    width: 57,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activeReactionChip: {
    backgroundColor: 'rgba(255, 238, 235, 0.95)',
    borderColor: '#FF5A5F',
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipCount: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569',
  },
  activeChipCount: {
    color: '#FF5A5F',
    fontWeight: '700',
  },
});
