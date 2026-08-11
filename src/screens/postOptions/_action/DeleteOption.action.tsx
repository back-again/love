'use client';

import React from 'react';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';

export function DeleteOptionAction() {
  const closePostOptions = usePostOptionsStore(
    state => state.closePostOptions,
  );
  const showToast = useToastStore(state => state.showToast);

  const handleDelete = () => {
    closePostOptions();
    showToast('게시글이 삭제되었습니다.');
  };

  return (
    <OptionItem
      type="delete"
      label="게시글 삭제하기"
      onPress={handleDelete}
    />
  );
}
