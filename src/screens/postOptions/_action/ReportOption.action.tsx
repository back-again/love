'use client';

import React from 'react';
import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';
import { reportPostLib } from '../_lib/reportPost.lib';

export function ReportOptionAction() {
  const { targetPost, closePostOptions } = usePostOptionsStore(
    useShallow(state => ({
      targetPost: state.targetPost,
      closePostOptions: state.closePostOptions,
    })),
  );
  const showToast = useToastStore(state => state.showToast);

  const { mutate: reportPost } = useMutation({
    mutationFn: async ({
      postId,
      reportedUserId,
    }: {
      postId: string;
      reportedUserId?: string;
    }) => {
      await reportPostLib({ postId, reportedUserId });
    },
    onSuccess: () => {
      showToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
    },
    onError: () => {
      showToast('신고 접수에 실패했습니다.');
    },
  });

  const handleReport = () => {
    if (!targetPost?.id) {
      closePostOptions();
      return;
    }

    const postId = targetPost.id;
    const reportedUserId = targetPost.userId;
    closePostOptions();

    Alert.alert('게시글 신고', '해당 게시글을 신고하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '신고',
        style: 'destructive',
        onPress: () => reportPost({ postId, reportedUserId }),
      },
    ]);
  };

  return (
    <OptionItem type="report" label="게시글 신고하기" onPress={handleReport} />
  );
}
