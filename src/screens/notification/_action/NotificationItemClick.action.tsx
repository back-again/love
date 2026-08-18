'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationItem as NotificationItemType } from '../_model/notification.model';
import { NotificationItem } from '../_component/NotificationItem';
import { markNotificationReadLib } from '../_lib/markNotificationRead.lib';
import { useNotificationStore } from '../_state/useNotificationStore';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { navigationRef } from '@/_lib/navigation';
import { getSinglePostLib } from '@/screens/feed/_lib/getSinglePost.lib';

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

      // 2. If it has a post ID, close notifications, navigate to Feed, and open comments bottom sheet
      if (item.postId) {
        useNotificationStore.getState().closeNotification();

        if (navigationRef.current?.isReady()) {
          navigationRef.current.navigate('Feed');
        }

        // Fetch post details asynchronously and open the comments modal
        const postDetail = await getSinglePostLib(item.postId);
        if (postDetail) {
          useCommentStore.getState().openComments(postDetail);
        }
      }
    } catch (err) {
      console.error('Notification click error:', err);
    }
  };

  return <NotificationItem item={item} onPress={handlePress} />;
}
