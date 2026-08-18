'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markAllNotificationsReadLib } from '../_lib/markAllNotificationsRead.lib';
import { deleteAllNotificationsLib } from '../_lib/deleteAllNotifications.lib';

interface NotificationHeaderActionsActionProps {
  unreadCount: number;
  hasNotifications: boolean;
}

export function NotificationHeaderActionsAction({
  unreadCount,
  hasNotifications,
}: NotificationHeaderActionsActionProps) {
  const queryClient = useQueryClient();

  const { mutate: markAllRead } = useMutation({
    mutationFn: markAllNotificationsReadLib,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const { mutate: deleteAll } = useMutation({
    mutationFn: deleteAllNotificationsLib,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  if (!hasNotifications) return null;

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <TouchableOpacity
          onPress={() => markAllRead()}
          activeOpacity={0.7}
          style={styles.actionBtn}
        >
          <Text style={styles.markReadText}>모두 읽음</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => deleteAll()}
        activeOpacity={0.7}
        style={styles.actionBtn}
      >
        <Text style={styles.deleteAllText}>전체 삭제</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
