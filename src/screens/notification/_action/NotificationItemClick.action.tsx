'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationItem as NotificationItemType } from '../_model/notification.model';
import { NotificationItem } from '../_component/NotificationItem';
import { markNotificationReadLib } from '../_lib/markNotificationRead.lib';

interface NotificationItemClickActionProps {
  item: NotificationItemType;
}

export function NotificationItemClickAction({
  item,
}: NotificationItemClickActionProps) {
  const queryClient = useQueryClient();

  const handlePress = async () => {
    try {
      if (!item.isRead) {
        await markNotificationReadLib(item.id);
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }
    } catch {}
  };

  return <NotificationItem item={item} onPress={handlePress} />;
}
