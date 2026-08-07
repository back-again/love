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

  const isUnselected = hasVoted && !isSelected;

  return (
    <TouchableOpacity
      style={[
        isO ? styles.voteCardO : styles.voteCardX,
        isSelected && (isO ? styles.voteCardOSelected : styles.voteCardXSelected),
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {isO ? <VoteOSvg color="#AA6CFF" /> : <VoteXSvg color="#FF5E85" />}
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
    borderColor: '#E3CCFF', // 또렷하고 화사한 라벤더 보라 스트로크
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
    backgroundColor: '#F6EEFF',
    borderColor: '#AA6CFF',
    borderWidth: 2,
  },
  voteTextO: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextOSelected: {
    color: '#AA6CFF',
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
    borderColor: '#FFC4D2', // 또렷하고 화사한 로즈 핑크 스트로크
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
    backgroundColor: '#FFEBF0',
    borderColor: '#FF5E85',
    borderWidth: 2,
  },
  voteTextX: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextXSelected: {
    color: '#FF5E85',
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
  voteCardUnselectedDim: {
    opacity: 0.45,
    backgroundColor: '#FAFAFA',
    borderColor: '#E2E8F0',
  },
  voteTextUnselected: {
    color: '#94A3B8',
  },
});
