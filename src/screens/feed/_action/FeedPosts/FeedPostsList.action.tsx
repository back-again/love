'use client';

import React from 'react';
import { FeedItem } from '../../_component/FeedItem';
import { useFeedList } from '../../_state/useFeedList';
import { useFeedStore } from '../../_state/useFeedStore';
import { usePostOptionsStore } from '@/screens/postOptions/_state/usePostOptionsStore';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { ImageModalAction } from './ImageModal.action';

export function FeedPostsListAction() {
  const { posts, userVoteMap } = useFeedList();

  const openImageModal = useFeedStore(state => state.openImageModal);
  const openPostOptions = usePostOptionsStore(state => state.openPostOptions);
  const openComments = useCommentStore(state => state.openComments);

  return (
    <>
      {posts.map(post => (
        <FeedItem
          key={post.id}
          post={post}
          myVote={userVoteMap[post.id] ?? null}
          onOpenImageModal={openImageModal}
          onOpenPostOptions={openPostOptions}
          onOpenComments={openComments}
        />
      ))}

      <ImageModalAction />
    </>
  );
}
