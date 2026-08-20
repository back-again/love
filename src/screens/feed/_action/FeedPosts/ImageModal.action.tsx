'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ImageModal } from '@/components/modal/ImageModal';
import { useFeedStore } from '../../_state/useFeedStore';

export function ImageModalAction() {
  const { visible, images, initialIndex, resetImageModal } = useFeedStore(
    useShallow(state => ({
      visible: state.imageModalVisible,
      images: state.imageModalImages,
      initialIndex: state.imageModalInitialIndex,
      resetImageModal: state.resetImageModal,
    })),
  );

  return (
    <ImageModal
      visible={visible}
      images={images}
      initialIndex={initialIndex}
      onClose={resetImageModal}
    />
  );
}
