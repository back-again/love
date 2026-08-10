import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle, Rect, Ellipse, Path } from 'react-native-svg';
import { MainTabType } from '../Layout';

interface NavItemProps {
  type: MainTabType;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function NavItem({ type, label, isActive, onPress }: NavItemProps) {
  const activeColor = '#F9758D';
  const inactiveColor = '#8F8F8F';
  const iconColor = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={[styles.navItem, isActive && styles.navItemActiveCapsule]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {type === 'feed' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect
            x={3}
            y={3}
            width={18}
            height={18}
            rx={4}
            fill={isActive ? iconColor : 'none'}
            stroke={iconColor}
            strokeWidth={2}
          />
          <Path
            d="M7 8H17M7 12H17M7 16H12"
            stroke={isActive ? '#FFFFFF' : iconColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      )}

      {type === 'chat' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5C21 15.6421 17.1944 19 12.5 19C11.1378 19 9.85177 18.7093 8.71077 18.1884L3 20L4.70757 15.8202C3.63007 14.5772 3 13.1026 3 11.5C3 7.35786 6.80558 4 11.5 4C16.1944 4 21 7.35786 21 11.5Z"
            fill={isActive ? iconColor : 'none'}
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}

      {type === 'create' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            fill={isActive ? iconColor : 'none'}
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}

      {type === 'my' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle
            cx={12}
            cy={7}
            r={4}
            fill={isActive ? iconColor : 'none'}
            stroke={iconColor}
            strokeWidth={2}
          />
          <Path
            d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
            fill={isActive ? iconColor : 'none'}
            stroke={iconColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}

      <Text style={[styles.navText, isActive && styles.navTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  navItemActiveCapsule: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEEBED',
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8F8F8F',
    letterSpacing: -0.3,
  },
  navTextActive: {
    color: '#F9758D',
    fontWeight: '700',
  },
});
