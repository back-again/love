'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNotificationsLib } from '../_lib/getNotifications.lib';
import { NotificationListArea } from '../_area/NotificationList.area';
import { NotificationEmptyArea } from '../_area/NotificationEmpty.area';

export function NotificationListHandler() {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotificationsLib,
  });

  if (notifications.length === 0) {
    return <NotificationEmptyArea />;
  }

  return <NotificationListArea notifications={notifications} />;
}
