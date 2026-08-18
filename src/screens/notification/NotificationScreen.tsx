'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal';
import { useNotificationStore } from './_state/useNotificationStore';
import { NotificationHeaderHandler } from './_handler/NotificationHeader.handler';
import { NotificationListHandler } from './_handler/NotificationList.handler';

export function NotificationScreen() {
  const { visible, closeNotification } = useNotificationStore(
    useShallow(state => ({
      visible: state.visible,
      closeNotification: state.closeNotification,
    })),
  );

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeNotification}
      snapPoints={['70%']}
      useScrollView={true}
      enableDynamicSizing={false}
    >
      <NotificationHeaderHandler />
      <NotificationListHandler />
    </BottomSheetModal>
  );
}
