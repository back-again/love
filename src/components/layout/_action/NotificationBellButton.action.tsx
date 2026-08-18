'use client';

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NotificationBellSvg } from '../_svg/NotificationBellSvg';
import {
  NotificationItem,
  NotificationModal,
} from '@/components/modal/NotificationModal';

interface NotificationBellButtonActionProps {
  onTabChange?: (tab: 'feed') => void;
}

export function NotificationBellButtonAction({
  onTabChange,
}: NotificationBellButtonActionProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleSelectNotification = (_item: NotificationItem) => {
    setIsNotificationOpen(false);
    onTabChange?.('feed');
  };

  return (
    <>
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={() => setIsNotificationOpen(true)}
        activeOpacity={0.7}
      >
        <NotificationBellSvg color="#0F172A" />
        <View style={styles.unreadBadgeDot} />
      </TouchableOpacity>

      <NotificationModal
        visible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onSelectNotification={handleSelectNotification}
      />
    </>
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
