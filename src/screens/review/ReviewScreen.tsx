'use client';

import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { ReviewWriteArea } from './_area/ReviewWrite.area';
import { ReviewDetailArea } from './_area/ReviewDetail.area';
import { useReviewForm } from './_state/useReviewForm';
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
  const reset = useReviewForm(state => state.reset);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

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
