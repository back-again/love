'use client';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useOnboardingForm } from '../_state/useOnboardingForm';
import { requestNotificationPermission } from '../_lib/requestNotificationPermission.lib';

export function NotificationAllowAction() {
  const { notificationAllowed, setNotificationAllowed } = useOnboardingForm(
    useShallow(state => ({
      notificationAllowed: state.notificationAllowed,
      setNotificationAllowed: state.setNotificationAllowed,
    })),
  );

  const handlePress = async () => {
    if (notificationAllowed) return;

    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationAllowed(true);
    } else {
      setNotificationAllowed(false);
      if (Platform.OS !== 'web') {
        Alert.alert(
          '알림 권한 거부',
          '기기 설정에서 알림 권한을 허용할 수 있습니다.',
        );
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.allowButton,
        notificationAllowed && styles.allowButtonSelected,
      ]}
      onPress={handlePress}
      disabled={notificationAllowed}
      activeOpacity={notificationAllowed ? 1 : 0.8}
    >
      <Text
        style={[
          styles.allowButtonText,
          notificationAllowed && styles.allowButtonTextSelected,
        ]}
      >
        {notificationAllowed ? '허용됨' : '허용'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  allowButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonSelected: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9C9C9C',
    letterSpacing: -0.3,
  },
  allowButtonTextSelected: {
    color: '#FF5D7B',
  },
});
