'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotificationsLib } from '../_lib/getNotifications.lib';
import { NotificationHeaderArea } from '../_area/NotificationHeader.area';

export function NotificationHeaderHandler() {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsLib,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationHeaderArea
      unreadCount={unreadCount}
      hasNotifications={notifications.length > 0}
    />
  );
}
