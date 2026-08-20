import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export interface ResultBarProps {
  choice: 'O' | 'X';
  content: string;
  percent: number;
  isSelected: boolean;
}

export function ResultBar({
  choice,
  content,
  percent,
  isSelected,
}: ResultBarProps) {
  const isO = choice === 'O';

  return (
    <View style={styles.votedBarWrapper}>
      <View
        style={[
          styles.votedBarTrack,
          isSelected
            ? isO
              ? styles.votedBarTrackOSelected
              : styles.votedBarTrackXSelected
            : styles.votedBarTrackUnselected,
        ]}
      >
        <View
          style={[
            styles.votedBarFill,
            isSelected
              ? isO
                ? styles.votedBarFillOSelected
                : styles.votedBarFillXSelected
              : styles.votedBarFillUnselected,
            { width: `${percent}%` },
          ]}
        />
        <Text
          style={styles.votedBarOptionText}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.6}
        >
          <Text
            style={
              isSelected
                ? isO
                  ? styles.badgeOText
                  : styles.badgeXText
                : styles.badgeUnselectedText
            }
          >
            {choice}{' '}
          </Text>
          <Text
            style={
              isSelected
                ? isO
                  ? styles.optionContentTextSelectedO
                  : styles.optionContentTextSelectedX
                : styles.optionContentTextUnselected
            }
          >
            {content}
          </Text>
        </Text>
        <Text
          style={[
            styles.votedPercentText,
            isSelected
              ? isO
                ? styles.votedPercentTextOSelected
                : styles.votedPercentTextXSelected
              : styles.votedPercentTextUnselected,
          ]}
        >
          {percent}%
        </Text>
      </View>
    </View>
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
  votedBarTrackOSelected: {
    borderColor: '#E8E3FF',
  },
  votedBarTrackXSelected: {
    borderColor: '#FFE3E5',
  },
  votedBarTrackUnselected: {
    borderColor: '#E8E8E8',
  },
  votedBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 15,
  },
  votedBarOptionText: {
    position: 'absolute',
    left: 16,
    right: 64,
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
  badgeUnselectedText: {
    color: '#8F8F8F',
    fontWeight: '700',
    fontSize: 16,
  },
  optionContentTextUnselected: {
    color: '#8F8F8F',
    fontWeight: '600',
    fontSize: 14.5,
  },
  optionContentTextSelectedO: {
    color: '#8B75F9',
    fontWeight: '800',
    fontSize: 14.5,
  },
  optionContentTextSelectedX: {
    color: '#FF5D7B',
    fontWeight: '800',
    fontSize: 14.5,
  },
  votedBarFillOSelected: {
    backgroundColor: '#F5F1FF',
  },
  votedBarFillXSelected: {
    backgroundColor: '#FFF3F4',
  },
  votedBarFillUnselected: {
    backgroundColor: '#F5F5F5',
  },
  votedPercentText: {
    position: 'absolute',
    right: 16,
    fontSize: 15,
    fontWeight: '800',
    zIndex: 2,
  },
  votedPercentTextOSelected: {
    color: '#8B75F9',
  },
  votedPercentTextXSelected: {
    color: '#FF5D7B',
  },
  votedPercentTextUnselected: {
    color: '#8F8F8F',
  },
});
