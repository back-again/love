'use client';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NotificationItem as NotificationItemType } from '../_model/notification.model';
import { NotificationItemClickAction } from '../_action/NotificationItemClick.action';

interface NotificationListAreaProps {
  notifications: NotificationItemType[];
}

export function NotificationListArea({
  notifications,
}: NotificationListAreaProps) {
  return (
    <View style={styles.listContainer}>
      {notifications.map(item => (
        <NotificationItemClickAction key={item.id} item={item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    gap: 10,
  },
});
