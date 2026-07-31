import React, { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavItem } from './_component/NavItem';
import { OpenSettingBottomSheetAction } from '@/screens/setting/_action/OpenSettingBottomSheet.action';

export type MainTabType = 'feed' | 'ranking' | 'create' | 'my';

const NAV_TABS: { type: MainTabType; label: string }[] = [
  { type: 'feed', label: '피드' },
  { type: 'create', label: '작성' },
  { type: 'my', label: '마이' },
];

interface LayoutProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onSettingsPress?: () => void;
  children: ReactNode;
}

export function Layout({
  activeTab,
  onTabChange,
  onSettingsPress,
  children,
}: LayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={
        activeTab === 'my' || activeTab === 'create'
          ? ['#FFFFFF', '#FFFFFF']
          : ['#FFFAFB', '#FFECDC']
      }
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      {/* Top Header Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeftSpacer} />
        <Image
          source={require('../../assets/xoxo_logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />

        {activeTab === 'create' ? (
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => onTabChange('feed')}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#9C9C9C"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        ) : activeTab === 'my' ? (
          <OpenSettingBottomSheetAction onSettingsPress={onSettingsPress} />
        ) : (
          <TouchableOpacity
            style={styles.notificationButton}
            activeOpacity={0.7}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                stroke="#0F172A"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <View style={styles.unreadBadgeDot} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>{children}</View>

      {/* Floating Glassmorphism Bottom Navigation Bar */}
      <View
        style={[
          styles.bottomNavOuterWrapper,
          { bottom: Math.max(22, insets.bottom + 8) },
        ]}
      >
        <View style={styles.bottomNavInnerCapsule}>
          <BlurView
            intensity={35}
            tint="light"
            style={styles.glassBlurBackground}
          />
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.75)',
              'rgba(255, 255, 255, 0.35)',
              'rgba(255, 255, 255, 0.15)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.bottomNavContainer}>
            {NAV_TABS.map(tab => (
              <NavItem
                key={tab.type}
                type={tab.type}
                label={tab.label}
                isActive={activeTab === tab.type}
                onPress={() => onTabChange(tab.type)}
              />
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerLeftSpacer: {
    width: 32,
  },
  logoImage: {
    height: 28,
    width: 88,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF858F',
  },
  contentArea: {
    flex: 1,
  },
  bottomNavOuterWrapper: {
    position: 'absolute',
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    height: 63,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  bottomNavInnerCapsule: {
    width: '100%',
    height: '100%',
    borderRadius: 31.5,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor:
      Platform.OS === 'web'
        ? 'rgba(255, 255, 255, 0.55)'
        : 'rgba(255, 255, 255, 0.7)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          boxShadow:
            'inset 1.5px 1.5px 3px 0px rgba(255, 255, 255, 0.9), inset -1.5px -1.5px 3px 0px rgba(0, 0, 0, 0.04), 0 -3px 10px 0px rgba(0, 0, 0, 0.05)',
        }
      : {}),
  },
  glassBlurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomNavContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
