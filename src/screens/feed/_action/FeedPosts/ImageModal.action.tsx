'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ImageModal } from '@/components/modal/ImageModal';
import { useImageModalStore } from '../../_state/useImageModalStore';

export function ImageModalAction() {
  const { visible, images, initialIndex, resetImageModal } = useImageModalStore(
    useShallow(state => ({
      visible: state.visible,
      images: state.images,
      initialIndex: state.initialIndex,
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
