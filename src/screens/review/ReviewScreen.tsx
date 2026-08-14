'use client';

import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { ReviewWriteArea } from './_area/ReviewWrite.area';
import { ReviewDetailArea } from './_area/ReviewDetail.area';
import { useReviewModalStore, ReviewMode } from './_state/useReviewModalStore';

export type { ReviewMode };

export default function ReviewScreen() {
  const { visible, mode, closeReviewModal } = useReviewModalStore(
    useShallow(state => ({
      visible: state.visible,
      mode: state.mode,
      closeReviewModal: state.closeReviewModal,
    })),
  );

  const isWriteMode = mode === 'write';

  if (!visible) return null;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeReviewModal}
      snapPoints={isWriteMode ? ['65%'] : ['40%']}
    >
      {isWriteMode ? <ReviewWriteArea /> : <ReviewDetailArea />}
    </BottomSheetModal>
  );
}
