'use client';

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NotificationBellSvg } from '../_svg/NotificationBellSvg';
import { useNotificationStore } from '@/screens/notification/_state/useNotificationStore';
import { getNotificationsLib } from '@/screens/notification/_lib/getNotifications.lib';

interface NotificationBellButtonActionProps {
  onTabChange?: (tab: 'feed') => void;
}

export function NotificationBellButtonAction({
  onTabChange: _onTabChange,
}: NotificationBellButtonActionProps) {
  const openNotification = useNotificationStore(
    state => state.openNotification,
  );

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsLib,
  });

  const hasUnread = notifications.some(n => !n.isRead);

  return (
    <TouchableOpacity
      style={styles.notificationButton}
      onPress={openNotification}
      activeOpacity={0.7}
    >
      <NotificationBellSvg color="#0F172A" />
      {hasUnread && <View style={styles.unreadBadgeDot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
