'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationItem as NotificationItemType } from '../_model/notification.model';
import { NotificationItem } from '../_component/NotificationItem';
import { markNotificationReadLib } from '../_lib/markNotificationRead.lib';
import { useNotificationStore } from '../_state/useNotificationStore';
import { useDetailStore } from '@/screens/detail/_state/useDetailStore';

interface NotificationItemClickActionProps {
  item: NotificationItemType;
}

export function NotificationItemClickAction({
  item,
}: NotificationItemClickActionProps) {
  const queryClient = useQueryClient();

  const handlePress = async () => {
    try {
      // 1. Mark as read in DB if unread
      if (!item.isRead) {
        await markNotificationReadLib(item.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }

      // 2. If it has a post ID, close notifications and open detail right-slide modal
      if (item.postId) {
        useNotificationStore.getState().closeNotification();
        useDetailStore.getState().openDetail(item.postId);
      }
    } catch (err) {
      console.error('Notification click error:', err);
    }
  };

  return <NotificationItem item={item} onPress={handlePress} />;
}
