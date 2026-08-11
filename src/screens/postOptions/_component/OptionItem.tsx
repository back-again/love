'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { EditSvg, DeleteSvg, BlockSvg, ReportSvg } from '../_svg';

export type OptionItemType = 'edit' | 'delete' | 'block' | 'report';

interface OptionItemProps {
  type: OptionItemType;
  label: string;
  onPress: () => void;
}

export function OptionItem({ type, label, onPress }: OptionItemProps) {
  const isDanger = type === 'delete' || type === 'report';

  const renderIcon = () => {
    switch (type) {
      case 'edit':
        return <EditSvg />;
      case 'delete':
        return <DeleteSvg />;
      case 'block':
        return <BlockSvg />;
      case 'report':
        return <ReportSvg />;
    }
  };

  return (
    <TouchableOpacity
      style={styles.optionRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconCircle, isDanger && styles.dangerIconCircle]}>
        {renderIcon()}
      </View>
      <Text style={[styles.optionText, isDanger && styles.dangerOptionText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    gap: 14,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerIconCircle: {
    backgroundColor: '#FEEBED',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  dangerOptionText: {
    color: '#F9758D',
  },
});
