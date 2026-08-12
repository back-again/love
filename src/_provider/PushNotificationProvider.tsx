'use client';

import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerPushTokenLib } from '@/_lib/registerPushToken.lib';

export function PushNotificationProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    registerPushTokenLib();

    const notificationListener =
      Notifications.addNotificationReceivedListener(notification => {
        console.log('Push notification received:', notification);
      });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log('Push notification response:', response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return <>{children}</>;
}
