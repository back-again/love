import React, { ReactNode, useEffect, useState, useRef, Suspense } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { NavItem } from './_component/NavItem';
import { useUserStore } from '@/_state/useUserStore';
import { useHeaderStore } from '@/_state/useHeaderStore';
import { NotificationBellSvg } from './_svg/NotificationBellSvg';
import { OpenSettingBottomSheetAction } from '@/screens/setting/_action/OpenSettingBottomSheet.action';
import { useCreateForm } from '@/screens/create/_state/useCreateForm';
import { ToastProvider } from '@/_provider/ToastProvider';
import { PushNotificationProvider } from '@/_provider/PushNotificationProvider';
import {
  NotificationItem,
  NotificationModal,
} from '@/components/modal/NotificationModal';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { Post } from '@/screens/feed/_model/feed.model';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { CommentScreen } from '@/screens/feed/comment/CommentScreen';
import ReviewScreen from '@/screens/review/ReviewScreen';
import { CategoryHeaderArea } from '@/screens/feed/_area/CategoryHeader.area';
import { CategoryHydration } from '@/screens/feed/_component/CategoryHydration';
import { CategoryHeaderFallback } from '@/screens/feed/_component/CategoryHeaderFallback';

export type MainTabType = 'feed' | 'chat' | 'create' | 'my';

const NAV_TABS: { type: MainTabType; label: string }[] = [
  { type: 'feed', label: '커뮤니티' },
  { type: 'create', label: '작성' },
  { type: 'chat', label: '상담' },
  { type: 'my', label: '마이' },
];

interface LayoutProps {
  activeTab: MainTabType;
  onTabChange: (tab: MainTabType) => void;
  onSettingsPress?: () => void;
  hideBottomNav?: boolean;
  hideHeader?: boolean;
  children: ReactNode;
}

export function Layout({
  activeTab,
  onTabChange,
  onSettingsPress,
  hideBottomNav = false,
  hideHeader = false,
  children,
}: LayoutProps) {
  const insets = useSafeAreaInsets();
  const user = useUserStore(state => state.user);
  const scrollYAnim = useHeaderStore(state => state.scrollYAnim);
  const showBackground = activeTab !== 'feed';

  const headerOpacity = scrollYAnim.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);

  const tabIndexMap: Record<MainTabType, number> = {
    feed: 0,
    create: 1,
    chat: 2,
    my: 3,
  };

  const leftEdgeAnim = useRef(
    new Animated.Value(tabIndexMap[activeTab]),
  ).current;
  const rightEdgeAnim = useRef(
    new Animated.Value(tabIndexMap[activeTab] + 1),
  ).current;
  const prevTabRef = useRef<MainTabType>(activeTab);

  useEffect(() => {
    const prevIndex = tabIndexMap[prevTabRef.current];
    const targetIndex = tabIndexMap[activeTab];
    prevTabRef.current = activeTab;

    if (prevIndex === targetIndex) return;

    const isMovingRight = targetIndex > prevIndex;

    if (isMovingRight) {
      // Moving Right: Leading right edge shoots forward first, trailing left edge follows behind
      Animated.parallel([
        Animated.spring(rightEdgeAnim, {
          toValue: targetIndex + 1,
          tension: 190,
          friction: 14,
          useNativeDriver: true,
        }),
        Animated.spring(leftEdgeAnim, {
          toValue: targetIndex,
          tension: 100,
          friction: 13,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Moving Left: Leading left edge shoots backward first, trailing right edge follows behind
      Animated.parallel([
        Animated.spring(leftEdgeAnim, {
          toValue: targetIndex,
          tension: 190,
          friction: 14,
          useNativeDriver: true,
        }),
        Animated.spring(rightEdgeAnim, {
          toValue: targetIndex + 1,
          tension: 100,
          friction: 13,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [activeTab]);

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

  const centerAnim = Animated.multiply(
    Animated.add(Animated.add(leftEdgeAnim, rightEdgeAnim), -1),
    0.5,
  );
  const scaleXAnim = Animated.subtract(rightEdgeAnim, leftEdgeAnim);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {!hideHeader ? (
        (() => {
          let ddayText = 'D+1';
          if (user?.dating_started_at) {
            try {
              const startDate = new Date(user.dating_started_at);
              const today = new Date();
              startDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);
              const diffTime = today.getTime() - startDate.getTime();
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
              if (diffDays >= 0) {
                ddayText = `D+${diffDays}`;
              } else {
                ddayText = `D${diffDays}`;
              }
            } catch (e) {
              console.warn('Failed to calculate D-day:', e);
            }
          } else {
            ddayText = 'D+365';
          }

          return (
            <View
              style={[
                styles.topGlassHeaderWrapper,
                { paddingTop: insets.top },
                showBackground && {
                  borderBottomWidth: 1.5,
                  borderBottomColor: 'rgba(255, 255, 255, 0.45)',
                  backgroundColor:
                    Platform.OS === 'web'
                      ? 'rgba(255, 255, 255, 0.35)'
                      : 'rgba(255, 255, 255, 0.45)',
                },
              ]}
            >
              {/* Animated Dynamic Glassmorphism Background Layer */}
              <Animated.View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    opacity: showBackground ? 1 : headerOpacity,
                    borderBottomWidth: 1.5,
                    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
                    backgroundColor:
                      Platform.OS === 'web'
                        ? 'rgba(255, 255, 255, 0.35)'
                        : 'rgba(255, 255, 255, 0.45)',
                  },
                ]}
              >
                <BlurView
                  intensity={80}
                  tint="light"
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={[
                    'rgba(255, 255, 255, 0.45)',
                    'rgba(255, 255, 255, 0.15)',
                    'rgba(255, 255, 255, 0.05)',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </Animated.View>
              <View style={styles.header}>
                <Text
                  style={[
                    styles.headerTitle,
                    activeTab === 'feed' && styles.feedHeaderTitle,
                  ]}
                >
                  {activeTab === 'feed' && ddayText}
                  {activeTab === 'create' && '작성'}
                  {activeTab === 'chat' && '상담'}
                  {activeTab === 'my' && '마이'}
                </Text>

                {activeTab === 'my' ? (
                  <OpenSettingBottomSheetAction
                    onSettingsPress={onSettingsPress}
                  />
                ) : activeTab === 'create' || activeTab === 'chat' ? null : (
                  <TouchableOpacity
                    style={styles.notificationButton}
                    onPress={() => setIsNotificationOpen(true)}
                    activeOpacity={0.7}
                  >
                    <NotificationBellSvg color="#0F172A" />
                    <View style={styles.unreadBadgeDot} />
                  </TouchableOpacity>
                )}
              </View>
              {activeTab === 'feed' && (
                <CategoryHydration>
                  <Suspense fallback={<CategoryHeaderFallback />}>
                    <CategoryHeaderArea />
                  </Suspense>
                </CategoryHydration>
              )}
            </View>
          );
        })()
      ) : (
        <View style={{ paddingTop: insets.top, backgroundColor: '#FFFFFF' }} />
      )}

      <View style={styles.contentArea}>{children}</View>

      {!hideBottomNav && (
        <View
          style={[
            styles.bottomNavOuterWrapper,
            { bottom: Math.max(12, insets.bottom - 12) },
          ]}
        >
          <View style={styles.bottomNavInnerCapsule}>
            <BlurView
              intensity={80}
              tint="light"
              style={styles.glassBlurBackground}
            />
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.35)',
                'rgba(255, 255, 255, 0.12)',
                'rgba(255, 255, 255, 0.04)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            {/* Sliding Pill Background behind NavItems */}
            {containerWidth > 0 && (
              <Animated.View
                style={[
                  styles.activePillBackground,
                  {
                    width: (containerWidth - 16) / 4,
                    transform: [
                      {
                        translateX: centerAnim.interpolate({
                          inputRange: [0, 1, 2, 3],
                          outputRange: [
                            0,
                            (containerWidth - 16) / 4,
                            ((containerWidth - 16) / 4) * 2,
                            ((containerWidth - 16) / 4) * 3,
                          ],
                        }),
                      },
                      { scaleX: scaleXAnim },
                    ],
                  },
                ]}
              />
            )}

            <View
              style={styles.bottomNavContainer}
              onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}
            >
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

      <PushNotificationProvider
        onNavigate={tab => {
          onTabChange(tab);
        }}
      />
      <ToastProvider />
      <PostOptionsScreen />
      <CommentScreen />
      <ReviewScreen />

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
  topGlassHeaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(30px) saturate(210%)',
          WebkitBackdropFilter: 'blur(30px) saturate(210%)',
        }
      : {}),
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  headerLeftSpacer: {
    width: 32,
  },
  headerRightSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    transform: [{ scaleX: 1.05 }],
  },
  feedHeaderTitle: {
    fontWeight: '700',
    transform: undefined,
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
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
    backgroundColor: 'transparent',
  },
  bottomNavInnerCapsule: {
    width: '100%',
    height: '100%',
    borderRadius: 31.5,
    overflow: 'hidden',
    borderWidth: 1.8,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    backgroundColor:
      Platform.OS === 'web'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(255, 255, 255, 0.22)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(30px) saturate(210%)',
          WebkitBackdropFilter: 'blur(30px) saturate(210%)',
          boxShadow:
            'inset 1px 1px 2px 0px rgba(255, 255, 255, 0.8), inset -1px -1px 2px 0px rgba(0, 0, 0, 0.03), 0 12px 20px 0px rgba(0, 0, 0, 0.12)',
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
  activePillBackground: {
    position: 'absolute',
    left: 8,
    top: '50%',
    height: 52,
    marginTop: -26,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
  },
});
