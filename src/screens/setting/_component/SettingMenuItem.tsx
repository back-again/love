import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface SettingMenuItemProps {
  label: string;
  onPress: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function SettingMenuItem({
  label,
  onPress,
  isLast = false,
  style,
}: SettingMenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.hubMenuItem, isLast && styles.lastMenuItem, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.hubMenuText}>{label}</Text>
      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
        <Path
          d="M9 18l6-6-6-6"
          stroke="#9C9C9C"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hubMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  hubMenuText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0F172A',
  },
});
