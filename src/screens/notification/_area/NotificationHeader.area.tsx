'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CloseSvg } from '../_svg';
import { NotificationHeaderActionsAction } from '../_action/NotificationHeaderActions.action';
import { useNotificationStore } from '../_state/useNotificationStore';

interface NotificationHeaderAreaProps {
  unreadCount: number;
  hasNotifications: boolean;
}

export function NotificationHeaderArea({
  unreadCount,
  hasNotifications,
}: NotificationHeaderAreaProps) {
  const closeNotification = useNotificationStore(
    state => state.closeNotification,
  );

  return (
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
        <NotificationHeaderActionsAction
          unreadCount={unreadCount}
          hasNotifications={hasNotifications}
        />
        <TouchableOpacity
          onPress={closeNotification}
          activeOpacity={0.7}
          style={styles.closeBtn}
        >
          <CloseSvg />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 18,
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
  closeBtn: {
    padding: 4,
  },
});
