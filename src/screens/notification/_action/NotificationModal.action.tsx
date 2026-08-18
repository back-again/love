'use client';

import React from 'react';
import { useNotificationStore } from '../_state/useNotificationStore';
import { NotificationScreen } from '../NotificationScreen';

export function NotificationModalAction() {
  const visible = useNotificationStore(state => state.visible);

  if (!visible) return null;

  return <NotificationScreen />;
}
