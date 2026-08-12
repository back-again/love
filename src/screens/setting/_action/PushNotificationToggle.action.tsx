'use client';

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { useUserStore } from '@/_state/useUserStore';
import { updateNotificationAllowed } from '../_lib/updateNotificationAllowed.lib';

export function PushNotificationToggleAction() {
  const { user, setUser } = useUserStore();
  const [pushNoti, setPushNoti] = useState<boolean>(
    user?.notification_allowed ?? true,
  );

  useEffect(() => {
    if (user?.notification_allowed !== undefined) {
      setPushNoti(user.notification_allowed);
    }
  }, [user?.notification_allowed]);

  const handleToggle = async (value: boolean) => {
    setPushNoti(value);

    if (user) {
      setUser({ ...user, notification_allowed: value });

      await updateNotificationAllowed({
        userId: user.id,
        notificationAllowed: value,
      });
    }
  };

  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingRowTitle}>사연 반응 및 댓글 푸시 알림</Text>
      <Switch
        value={pushNoti}
        onValueChange={handleToggle}
        trackColor={{ false: '#D6D6D6', true: '#F9758D' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    width: '100%',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  settingRowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
});
