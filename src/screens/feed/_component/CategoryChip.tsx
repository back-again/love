import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface CategoryChipProps {
  category: string;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({
  category,
  isSelected,
  onPress,
}: CategoryChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        isSelected && styles.categoryChipActive,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text
        style={[
          styles.categoryChipText,
          isSelected && styles.categoryChipTextActive,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 36,
    minWidth: 56,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#727272',
    textAlign: 'center',
  },
  categoryChipTextActive: {
    color: '#FF5D7B',
    fontWeight: '700',
  },
});
