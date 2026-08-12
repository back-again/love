import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { supabase } from '@/api/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface NotificationItem {
  id: string;
  type: 'comment' | 'vote';
  postId?: string;
  postTitle: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectNotification?: (item: NotificationItem) => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'comment',
    postId: '11111111-1111-1111-1111-111111111111',
    postTitle: '남친이 카톡 텀이 3시간 이상인데 제가 예민한가요?',
    message: '"저 같으면 솔직하게 대화로 서운하다고 말해요!"',
    timestamp: '방금 전',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'vote',
    postId: '22222222-2222-2222-2222-222222222222',
    postTitle: '첫 데이트 비용 5:5 더치페이 제안받았는데 어떡하죠?',
    message: "'O'에 1표가 달렸어요!",
    timestamp: '15분 전',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'comment',
    postId: '11111111-1111-1111-1111-111111111111',
    postTitle: '남친이 카톡 텀이 3시간 이상인데 제가 예민한가요?',
    message: '"요즘 바빠서 그럴 수도 있어요 맘 편하게 가지세요."',
    timestamp: '1시간 전',
    isRead: true,
  },
  {
    id: 'n4',
    type: 'vote',
    postId: '33333333-3333-3333-3333-333333333333',
    postTitle: '기념일에 서로 원하는 선물 주고받기 vs 깜짝 선물',
    message: "'X'에 1표가 달렸어요!",
    timestamp: '어제',
    isRead: true,
  },
];

export function NotificationModal({
  visible,
  onClose,
  onSelectNotification,
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [mounted, setMounted] = useState(visible);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMounted(false);
      onClose();
    });
  };

  useEffect(() => {
    if (!visible) return;

    let isMounted = true;
    async function fetchNotifications() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';

        const { data, error } = await supabase
          .from('notifications')
          .select(`
            id,
            type,
            post_id,
            is_read,
            created_at,
            posts ( title, vote_o, vote_x )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching notifications:', error.message);
          return;
        }

        if (!data || data.length === 0) {
          if (isMounted) setNotifications([]);
          return;
        }

        const formatted: NotificationItem[] = data.map((item: any) => {
          const postTitle = item.posts?.title || '내 사연';
          const isVote =
            item.type === 'VOTE' ||
            item.type === 'VOTE_CREATED' ||
            item.type === 'VOTE_O' ||
            item.type === 'VOTE_X';

          let message = '';
          if (isVote) {
            const isChoiceX = item.type === 'VOTE_X';
            const choiceLabel = isChoiceX ? "'X'" : "'O'";
            message = `${choiceLabel}에 1표가 달렸어요!`;
          } else {
            message = item.content
              ? `"${item.content}"`
              : '"내 사연에 새로운 댓글이 남겨졌어요."';
          }

          return {
            id: item.id,
            type: isVote ? 'vote' : 'comment',
            postId: item.post_id,
            postTitle,
            message,
            timestamp: '방금 전',
            isRead: item.is_read ?? false,
          };
        });

        if (isMounted) {
          setNotifications(formatted);
        }
      } catch (err) {
        console.log('Notifications DB fetch skipped:', err);
      }
    }

    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [visible]);

  if (!visible && !mounted) return null;

  const handleItemPress = (item: NotificationItem) => {
    setNotifications(prev =>
      prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
    );
    if (onSelectNotification) {
      onSelectNotification(item);
    }
    handleDismiss();
  };

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
    } catch (e) {
      console.log('Mark all read error:', e);
    }
  };

  const handleDeleteAll = async () => {
    setNotifications([]);
    try {
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
      await supabase.from('notifications').delete().eq('user_id', userId);
    } catch (e) {
      console.log('Delete all notifications error:', e);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheetContainer,
                {
                  transform: [{ translateY }],
                },
              ]}
            >
              <View style={styles.handleBar} />

              {/* Header Row */}
              <View style={styles.headerRow}>
                <View style={styles.headerTitleWrap}>
                  <Text style={styles.sheetTitle}>알림</Text>
                  {unreadCount > 0 && (
                    <View style={styles.unreadCountBadge}>
                      <Text style={styles.unreadCountText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.headerActionsWrap}>
                  {notifications.length > 0 && (
                    <>
                      {unreadCount > 0 && (
                        <TouchableOpacity
                          onPress={handleMarkAllRead}
                          activeOpacity={0.7}
                          style={styles.actionBtn}
                        >
                          <Text style={styles.markReadText}>모두 읽음</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={handleDeleteAll}
                        activeOpacity={0.7}
                        style={styles.actionBtn}
                      >
                        <Text style={styles.deleteAllText}>전체 삭제</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    onPress={onClose}
                    activeOpacity={0.7}
                    style={styles.closeBtn}
                  >
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#8F8F8F"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Notification List */}
              <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                {notifications.length > 0 ? (
                  notifications.map(item => {
                    const isComment = item.type === 'comment';
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.notificationCard,
                          !item.isRead && styles.notificationCardUnread,
                        ]}
                        onPress={() => handleItemPress(item)}
                        activeOpacity={0.8}
                      >
                        {/* Text Container */}
                        <View style={styles.textContainer}>
                          <View style={styles.titleRow}>
                            <Text style={styles.postTitle} numberOfLines={1}>
                              {item.postTitle}
                            </Text>
                            {!item.isRead && <View style={styles.dotUnread} />}
                          </View>
                          <Text style={styles.messageText} numberOfLines={2}>
                            {item.message}
                          </Text>
                          <Text style={styles.timestampText}>{item.timestamp}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyTitle}>아직 도착한 알림이 없어요</Text>
                    <Text style={styles.emptySub}>
                      내 사연 글에 새로운 댓글이나 투표가 남겨지면알림을 전송해 드려요.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E8E8E8',
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  unreadCountBadge: {
    backgroundColor: '#FF5D7B',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadCountText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerActionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  markReadText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF5D7B',
  },
  deleteAllText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  closeBtn: {
    padding: 4,
  },
  scrollView: {
    width: '100%',
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    gap: 12,
  },
  notificationCardUnread: {
    backgroundColor: '#FFF8F9',
    borderColor: '#FFD1DC',
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  dotUnread: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5D7B',
  },
  messageText: {
    fontSize: 13.5,
    color: '#727272',
    lineHeight: 19,
  },
  timestampText: {
    fontSize: 11,
    color: '#C0C0C0',
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#8F8F8F',
    textAlign: 'center',
    lineHeight: 18,
  },
});
