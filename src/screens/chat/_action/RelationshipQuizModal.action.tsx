'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useRelationshipQuizModalStore } from '../_state/useRelationshipQuizModalStore';
import { RelationshipQuizScreen } from '../quiz/RelationshipQuizScreen';

export function RelationshipQuizModalAction() {
  const { visible, closeQuizModal } = useRelationshipQuizModalStore(
    useShallow(state => ({
      visible: state.visible,
      closeQuizModal: state.closeQuizModal,
    })),
  );

  if (!visible) return null;

  return <RelationshipQuizScreen onClose={closeQuizModal} />;
}
