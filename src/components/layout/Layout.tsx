import React, { ReactNode } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { useHeaderStore } from '@/_state/useHeaderStore';

import { HeaderTitleAction } from './_action/HeaderTitle.action';
import { NotificationBellButtonAction } from './_action/NotificationBellButton.action';
import { OpenSettingBottomSheetAction } from '@/screens/setting/_action/OpenSetting/OpenSettingBottomSheet.action';
import { CreateSubmitHandler } from '@/screens/create/_handler/CreateSubmit.handler';
import { BottomNavArea } from './_area/BottomNav.area';
import { ToastProvider } from '@/_provider/ToastProvider';
import { PushNotificationProvider } from '@/_provider/PushNotificationProvider';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { CommentScreen } from '@/screens/feed/comment/CommentScreen';
import ReviewScreen from '@/screens/review/ReviewScreen';
import { NotificationModalAction } from '@/screens/notification/_action/NotificationModal.action';

export type MainTabType = 'feed' | 'chat' | 'create' | 'my';

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
  const scrollYAnim = useHeaderStore(state => state.scrollYAnim);
  const isFeed = activeTab === 'feed';

  const headerBgOpacity = scrollYAnim.interpolate({
    inputRange: [60, 90],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {!isFeed && (
        <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <HeaderTitleAction activeTab={activeTab} />
            {activeTab === 'my' ? (
              <OpenSettingBottomSheetAction onSettingsPress={onSettingsPress} />
            ) : activeTab === 'create' ? (
              <CreateSubmitHandler />
            ) : activeTab === 'chat' ? null : (
              <NotificationBellButtonAction onTabChange={onTabChange} />
            )}
          </View>
        </View>
      )}

      <View style={styles.contentArea}>{children}</View>

      {isFeed && (
        <Animated.View
          style={[
            styles.headerContainer,
            { paddingTop: insets.top },
            styles.absoluteHeaderContainer,
          ]}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: headerBgOpacity,
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
          >
            <BlurView
              intensity={80}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
          <View style={styles.header}>
            <HeaderTitleAction activeTab={activeTab} />
            <NotificationBellButtonAction onTabChange={onTabChange} />
          </View>
        </Animated.View>
      )}

      <BottomNavArea activeTab={activeTab} onTabChange={onTabChange} />

      <PushNotificationProvider
        onNavigate={tab => {
          onTabChange(tab);
        }}
      />
      <ToastProvider />
      <PostOptionsScreen />
      <CommentScreen />
      <ReviewScreen />
      <NotificationModalAction />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
  },
  absoluteHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 6,
  },
  contentArea: {
    flex: 1,
  },
});
