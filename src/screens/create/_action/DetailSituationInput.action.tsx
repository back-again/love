'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { AnimatedTextInputField } from '../_component/AnimatedTextInputField';

export function DetailSituationInputAction() {
  const { detailSituation, setDetailSituation } = useCreateForm(
    useShallow((state) => ({
      detailSituation: state.detailSituation,
      setDetailSituation: state.setDetailSituation,
    }))
  );

  return (
    <AnimatedTextInputField
      height={160}
      style={{ padding: 16 }}
      placeholder="자유롭게 작성해주세요."
      placeholderTextColor="#8F8F8F"
      multiline={true}
      numberOfLines={6}
      textAlignVertical="top"
      value={detailSituation}
      onChangeText={setDetailSituation}
    />
  );
}
