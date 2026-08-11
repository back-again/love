'use client';

import React from 'react';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';

export function EditOptionAction() {
  const closePostOptions = usePostOptionsStore(
    state => state.closePostOptions,
  );
  const showToast = useToastStore(state => state.showToast);

  const handleEdit = () => {
    closePostOptions();
    showToast('게시글 수정 페이지로 이동합니다.');
  };

  return (
    <OptionItem
      type="edit"
      label="게시글 수정하기"
      onPress={handleEdit}
    />
  );
}
