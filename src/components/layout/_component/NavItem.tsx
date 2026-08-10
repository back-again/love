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
  const activeColor = '#FF4D7B';
  const inactiveColor = '#BCBCBC';
  const iconColor = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={[styles.navItem, isActive && styles.navItemActiveCapsule]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {type === 'feed' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x={4} y={2} width={16} height={2.5} rx={1.25} fill={iconColor} />
          <Rect x={2} y={6} width={20} height={13} rx={4.5} fill={iconColor} />
          <Rect x={4} y={20} width={16} height={2.5} rx={1.25} fill={iconColor} />
        </Svg>
      )}

      {type === 'chat' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x={3} y={4} width={18} height={13} rx={5} fill={iconColor} />
          <Circle cx={8.5} cy={10.5} r={1.5} fill={isActive ? '#FFEBF0' : '#FFFFFF'} />
          <Circle cx={15.5} cy={10.5} r={1.5} fill={isActive ? '#FFEBF0' : '#FFFFFF'} />
          <Path d="M12 17v4M9 21h6" stroke={iconColor} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      )}

      {type === 'create' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Rect x={7} y={1} width={2.2} height={4} rx={1.1} fill={iconColor} />
          <Rect x={14.8} y={1} width={2.2} height={4} rx={1.1} fill={iconColor} />
          <Rect x={2} y={3.5} width={20} height={19.5} rx={5.5} fill={iconColor} />
          <Rect
            x={6}
            y={10.5}
            width={10}
            height={2.8}
            rx={1.4}
            fill={isActive ? '#FFEBF0' : '#FFFFFF'}
          />
          <Rect
            x={6}
            y={15.5}
            width={6.5}
            height={2.8}
            rx={1.4}
            fill={isActive ? '#FFEBF0' : '#FFFFFF'}
          />
        </Svg>
      )}

      {type === 'my' && (
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={6.5} r={5} fill={iconColor} />
          <Ellipse cx={12} cy={18} rx={9.5} ry={5} fill={iconColor} />
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
    backgroundColor: '#FFEBF0',
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#BCBCBC',
    letterSpacing: -0.3,
  },
  navTextActive: {
    color: '#FF4D7B',
    fontWeight: '700',
  },
});
