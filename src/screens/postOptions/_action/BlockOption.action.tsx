'use client';

import React from 'react';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';
import { blockUserLib } from '../_lib/blockUser.lib';

export function BlockOptionAction() {
  const queryClient = useQueryClient();
  const { targetPost, closePostOptions } = usePostOptionsStore(
    useShallow(state => ({
      targetPost: state.targetPost,
      closePostOptions: state.closePostOptions,
    })),
  );
  const showToast = useToastStore(state => state.showToast);

  const { mutate: blockUser } = useMutation({
    mutationFn: async ({
      userId,
      postTitle,
    }: {
      userId: string;
      postTitle?: string;
    }) => await blockUserLib(userId, postTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      queryClient.invalidateQueries({ queryKey: ['writtenPosts'] });
      showToast('해당 사용자가 차단되었습니다.');
    },
    onError: () => {
      showToast('사용자 차단에 실패했습니다.');
    },
  });

  const handleBlock = () => {
    if (!targetPost?.userId) {
      closePostOptions();
      return;
    }

    const targetUserId = targetPost.userId;
    const postTitle = targetPost.title;
    closePostOptions();

    Alert.alert(
      '사용자 차단',
      '해당 사용자를 차단하시겠습니까?\n차단한 사용자의 게시글은 피드에서 더 이상 표시되지 않습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '차단',
          style: 'destructive',
          onPress: () => blockUser({ userId: targetUserId, postTitle }),
        },
      ],
    );
  };

  return (
    <OptionItem type="block" label="작성자 차단하기" onPress={handleBlock} />
  );
}
