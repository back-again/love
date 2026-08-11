'use client';

import React from 'react';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';

export function ReportOptionAction() {
  const closePostOptions = usePostOptionsStore(
    state => state.closePostOptions,
  );
  const showToast = useToastStore(state => state.showToast);

  const handleReport = () => {
    closePostOptions();
    showToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
  };

  return (
    <OptionItem
      type="report"
      label="게시글 신고하기"
      onPress={handleReport}
    />
  );
}
