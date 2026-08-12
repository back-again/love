import React, { ReactNode, useEffect, useState } from 'react';
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

import { StatusBar } from 'expo-status-bar';
import { NavItem } from './_component/NavItem';
import { OpenSettingBottomSheetAction } from '@/screens/setting/_action/OpenSettingBottomSheet.action';
import { useCreateForm } from '@/screens/create/_state/useCreateForm';
import { ToastProvider } from '@/_provider/ToastProvider';
import { PushNotificationProvider } from '@/_provider/PushNotificationProvider';
import { NotificationItem, NotificationModal } from '@/components/modal/NotificationModal';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { Post } from '@/screens/feed/_model/feed.model';

export type MainTabType = 'feed' | 'chat' | 'create' | 'my';

const NAV_TABS: { type: MainTabType; label: string }[] = [
  { type: 'feed', label: 'OX' },
  { type: 'chat', label: 'AI 상담' },
  { type: 'create', label: '작성' },
  { type: 'my', label: '마이' },
];

interface LayoutProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onSettingsPress?: () => void;
  hideBottomNav?: boolean;
  children: ReactNode;
}

export function Layout({
  activeTab,
  onTabChange,
  onSettingsPress,
  hideBottomNav = false,
  children,
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  useEffect(() => {
    if (activeTab !== 'create') {
      useCreateForm.getState().reset();
    }
  }, [activeTab]);

  const handleSelectNotification = (item: NotificationItem) => {
    setIsNotificationOpen(false);

    if (item.type === 'comment') {
      const targetPost: Post = {
        id: item.postId || '11111111-1111-1111-1111-111111111111',
        title: item.postTitle,
        category: '연애고민',
        storySummary: item.postTitle,
        fullStory: item.postTitle,
        images: [],
        voteO: '예민해요',
        voteX: '안 예민해요',
        topComments: [],
        reviewStatus: 'none',
        fireCount: 0,
        facepalmCount: 0,
        commentCount: 5,
        voteOCount: 5,
        voteXCount: 2,
        totalVoteCount: 7,
        percentO: 71,
        percentX: 29,
        myVote: null,
        createdAt: new Date().toISOString(),
      };
      useCommentStore.getState().openComments(targetPost);
    } else {
      onTabChange('feed');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {activeTab !== 'chat' ? (
        <View style={[styles.topWhiteArea, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <View style={styles.headerLeftSpacer} />
            <Image
              source={require('../../assets/xoxo_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />

            {activeTab === 'my' ? (
              <OpenSettingBottomSheetAction onSettingsPress={onSettingsPress} />
            ) : (
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setIsNotificationOpen(true)}
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
        </View>
      ) : (
        <View style={{ paddingTop: insets.top, backgroundColor: '#FFFFFF' }} />
      )}

      <View style={styles.contentArea}>{children}</View>

      {!hideBottomNav && (
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
      )}

      <PushNotificationProvider />
      <ToastProvider />

      {/* Notification Bottom Sheet Modal */}
      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectNotification={handleSelectNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topWhiteArea: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F9758D',
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
