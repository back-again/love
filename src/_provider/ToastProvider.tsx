'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ToastMessage } from '@/components/modal/ToastMessage';
import { useToastStore } from '@/_state/useToastStore';

export function ToastProvider() {
  const { visible, message, hideToast } = useToastStore(
    useShallow(state => ({
      visible: state.visible,
      message: state.message,
      hideToast: state.hideToast,
    })),
  );

  return (
    <ToastMessage visible={visible} message={message} onHide={hideToast} />
  );
}
