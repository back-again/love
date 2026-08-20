import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export interface VoteButtonProps {
  choice: 'O' | 'X';
  content: string;
  onPress: () => void;
}

export function VoteButton({ choice, content, onPress }: VoteButtonProps) {
  const isO = choice === 'O';
  return (
    <TouchableOpacity
      style={styles.votedBarWrapper}
      onPress={e => {
        e.stopPropagation();
        onPress();
      }}
      activeOpacity={0.88}
    >
      <View style={styles.votedBarTrack}>
        <Text
          style={styles.votedBarOptionTextUnvoted}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.6}
        >
          <Text style={isO ? styles.badgeOText : styles.badgeXText}>
            {choice}{' '}
          </Text>
          <Text style={styles.optionContentText}>{content}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  votedBarWrapper: {
    width: '100%',
  },
  votedBarTrack: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  votedBarOptionTextUnvoted: {
    position: 'absolute',
    left: 16,
    right: 16,
    fontSize: 15,
    zIndex: 2,
  },
  badgeOText: {
    color: '#8B75F9',
    fontWeight: '900',
    fontSize: 16,
  },
  badgeXText: {
    color: '#FF5D7B',
    fontWeight: '900',
    fontSize: 16,
  },
  optionContentText: {
    color: '#0F172A',
    fontWeight: '600',
    fontSize: 14.5,
  },
});
