import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { VoteOSvg, VoteXSvg } from '../_svg';

import { View } from 'react-native';

interface FeedItemVoteCardProps {
  type: 'O' | 'X';
  text: string;
  isSelected: boolean;
  onPress: () => void;
  count?: number;
  totalCount?: number;
  hasVoted?: boolean;
}

export function FeedItemVoteCard({
  type,
  text,
  isSelected,
  onPress,
  count = 0,
  totalCount = 0,
  hasVoted = false,
}: FeedItemVoteCardProps) {
  const isO = type === 'O';
  const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

  return (
    <TouchableOpacity
      style={[
        isO ? styles.voteCardO : styles.voteCardX,
        isSelected && (isO ? styles.voteCardOSelected : styles.voteCardXSelected),
        hasVoted && styles.voteCardDisabled,
      ]}
      onPress={onPress}
      disabled={hasVoted}
      activeOpacity={hasVoted ? 1 : 0.85}
    >
      {isO ? <VoteOSvg /> : <VoteXSvg />}
      <View style={styles.textContainer}>
        <Text
          style={[
            isO ? styles.voteTextO : styles.voteTextX,
            isSelected && (isO ? styles.voteTextOSelected : styles.voteTextXSelected),
          ]}
          numberOfLines={1}
        >
          {text}
        </Text>
        {hasVoted && (
          <Text style={styles.countText}>
            {percentage}% ({count}명)
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  voteCardO: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#FFC8B3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  voteCardOSelected: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FF8E7A',
    borderWidth: 2,
  },
  voteTextO: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextOSelected: {
    color: '#FF8E7A',
    fontWeight: '700',
  },
  voteCardX: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#FFB4BB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  voteCardXSelected: {
    backgroundColor: '#FFF0F1',
    borderColor: '#FF858F',
    borderWidth: 2,
  },
  voteTextX: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextXSelected: {
    color: '#FF858F',
    fontWeight: '700',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  voteCardDisabled: {
    opacity: 0.95,
  },
});
