'use client';

import React from 'react';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';

export function BlockOptionAction() {
  const closePostOptions = usePostOptionsStore(
    state => state.closePostOptions,
  );
  const showToast = useToastStore(state => state.showToast);

  const handleBlock = () => {
    closePostOptions();
    showToast('해당 사용자가 차단되었습니다.');
  };

  return (
    <OptionItem
      type="block"
      label="작성자 차단하기"
      onPress={handleBlock}
    />
  );
}
