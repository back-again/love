import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface CategoryChipProps {
  category: string;
  isSelected: boolean;
  onPress: () => void;
  variant?: 'black' | 'pink' | 'communityGlass';
}

export function CategoryChip({
  category,
  isSelected,
  onPress,
  variant = 'black',
}: CategoryChipProps) {
  const isActivePink = isSelected && variant === 'pink';
  const isActiveBlack = isSelected && variant === 'black';
  const isActiveCommunityGlass = isSelected && variant === 'communityGlass';
  const isCommunityGlass = variant === 'communityGlass';

  return (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        isActiveBlack && styles.categoryChipActiveBlack,
        isActivePink && styles.categoryChipActivePink,
        isCommunityGlass && styles.categoryChipCommunityGlass,
        isActiveCommunityGlass && styles.categoryChipActiveCommunityGlass,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.categoryChipText,
          isActiveBlack && styles.categoryChipTextActiveBlack,
          isActivePink && styles.categoryChipTextActivePink,
          isCommunityGlass && styles.categoryChipTextCommunityGlass,
          isActiveCommunityGlass && styles.categoryChipTextActiveCommunityGlass,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 36,
    minWidth: 44,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActiveBlack: {
    backgroundColor: '#0F172A',
    borderWidth: 0,
  },
  categoryChipActivePink: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  categoryChipCommunityGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  categoryChipActiveCommunityGlass: {
    backgroundColor: '#0F172A',
    borderWidth: 0,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#727272',
    textAlign: 'center',
  },
  categoryChipTextActiveBlack: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  categoryChipTextActivePink: {
    color: '#FF5D7B',
    fontWeight: '700',
  },
  categoryChipTextCommunityGlass: {
    color: '#727272',
    fontWeight: '500',
  },
  categoryChipTextActiveCommunityGlass: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
