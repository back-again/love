import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MainTabType } from '../Layout';
import { FeedTabSvg } from '../_svg/FeedTabSvg';
import { ChatTabSvg } from '../_svg/ChatTabSvg';
import { CreateTabSvg } from '../_svg/CreateTabSvg';
import { MyTabSvg } from '../_svg/MyTabSvg';

interface NavItemProps {
  type: MainTabType;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

export function NavItem({ type, label, isActive, onPress }: NavItemProps) {
  const activeColor = '#0F172A';
  const inactiveColor = '#8F8F8F';
  const iconColor = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {type === 'feed' && <FeedTabSvg isActive={isActive} color={iconColor} />}
      {type === 'chat' && <ChatTabSvg isActive={isActive} color={iconColor} />}
      {type === 'create' && <CreateTabSvg isActive={isActive} color={iconColor} />}
      {type === 'my' && <MyTabSvg isActive={isActive} color={iconColor} />}

      <Text style={[styles.navText, isActive && styles.navTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  navItem: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8F8F8F',
    letterSpacing: -0.2,
  },
  navTextActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
});
