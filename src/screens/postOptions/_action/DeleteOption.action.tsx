'use client';

import React from 'react';
import { Alert } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';
import { deletePostLib } from '../_lib/deletePost.lib';

export function DeleteOptionAction() {
  const queryClient = useQueryClient();

  const { targetPost, closePostOptions } = usePostOptionsStore(
    useShallow(state => ({
      targetPost: state.targetPost,
      closePostOptions: state.closePostOptions,
    })),
  );
  const showToast = useToastStore(state => state.showToast);

  const { mutate: deletePost } = useMutation({
    mutationFn: async (postId: string) => await deletePostLib(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      showToast('게시글이 삭제되었습니다.');
    },
    onError: () => {
      showToast('게시글 삭제에 실패했습니다.');
    },
  });

  const handleDelete = () => {
    if (!targetPost?.id) {
      closePostOptions();
      return;
    }

    const postId = targetPost.id;
    closePostOptions();

    Alert.alert('게시글 삭제', '게시글을 정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deletePost(postId),
      },
    ]);
  };

  return (
    <OptionItem type="delete" label="게시글 삭제하기" onPress={handleDelete} />
  );
}
