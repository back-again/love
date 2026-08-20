'use client';

import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerPushTokenLib } from '@/_lib/registerPushToken.lib';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { MainTabType } from '@/components/layout/Layout';

interface PushNotificationProviderProps {
  children?: React.ReactNode;
  onNavigate?: (tab: MainTabType, postId?: string) => void;
}

export function PushNotificationProvider({
  children,
  onNavigate,
}: PushNotificationProviderProps) {
  useEffect(() => {
    registerPushTokenLib();

    const notificationListener =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Push notification received:', notification);
      });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Push notification response received:', response);
        const data = response.notification.request.content.data;
        const targetScreen = (data?.screen || data?.tab || 'feed') as MainTabType;
        const postIdStr = data?.postId ? String(data.postId) : undefined;
        const postTitleStr = data?.postTitle ? String(data.postTitle) : '알림 사연';

        if (onNavigate) {
          onNavigate(targetScreen, postIdStr);
        }

        if (postIdStr) {
          useCommentStore.getState().openComments({
            id: postIdStr,
            userId: '',
            title: postTitleStr,
            content: postTitleStr,
            category: '고민',
            images: [],
            voteO: '괜찮은데?',
            voteX: '난 싫어',
            commentCount: 0,
            voteOCount: 0,
            voteXCount: 0,
            createdAt: new Date().toISOString(),
          });
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [onNavigate]);

  return <>{children}</>;
}
