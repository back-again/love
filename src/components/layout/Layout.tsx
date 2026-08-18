import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderTitleAction } from './_action/HeaderTitle.action';
import { NotificationBellButtonAction } from './_action/NotificationBellButton.action';
import { OpenSettingBottomSheetAction } from '@/screens/setting/_action/OpenSettingBottomSheet.action';
import { BottomNavArea } from './_area/BottomNav.area';
import { ToastProvider } from '@/_provider/ToastProvider';
import { PushNotificationProvider } from '@/_provider/PushNotificationProvider';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { CommentScreen } from '@/screens/feed/comment/CommentScreen';
import ReviewScreen from '@/screens/review/ReviewScreen';

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
  const isFeed = activeTab === 'feed';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerContainer,
          { paddingTop: insets.top },
          isFeed && styles.absoluteHeaderContainer,
        ]}
      >
        <View style={styles.header}>
          <HeaderTitleAction activeTab={activeTab} />

          {activeTab === 'my' ? (
            <OpenSettingBottomSheetAction onSettingsPress={onSettingsPress} />
          ) : activeTab === 'create' || activeTab === 'chat' ? null : (
            <NotificationBellButtonAction onTabChange={onTabChange} />
          )}
        </View>
      </View>

      <View style={styles.contentArea}>{children}</View>

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
