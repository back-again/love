'use client';

import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { OptionItem } from '../_component/OptionItem';
import { usePostOptionsStore } from '../_state/usePostOptionsStore';
import { useToastStore } from '@/_state/useToastStore';
import { deletePostLib } from '@/screens/feed/_lib/deletePost.lib';
import { useLocalPostsStore } from '@/screens/feed/_state/useLocalPostsStore';

export function DeleteOptionAction() {
  const queryClient = useQueryClient();
  const targetPost = usePostOptionsStore(state => state.targetPost);
  const closePostOptions = usePostOptionsStore(state => state.closePostOptions);
  const showToast = useToastStore(state => state.showToast);

  const handleDelete = async () => {
    if (targetPost?.id) {
      const postId = targetPost.id;
      closePostOptions();
      await deletePostLib(postId);
      useLocalPostsStore.getState().clearLocalPosts();
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      showToast('게시글이 삭제되었습니다.');
    } else {
      closePostOptions();
    }
  };

  return (
    <OptionItem
      type="delete"
      label="게시글 삭제하기"
      onPress={handleDelete}
    />
  );
}
