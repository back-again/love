'use client';

import React from 'react';
import { FeedItem } from '../../_component/FeedItem';
import { useFeed } from '../../_state/useFeed';
import { InViewSentinel } from '../../_component/InViewSentinel';

export function GeneralPostsListAction() {
  const { posts, loadMore } = useFeed('recent');

  return (
    <>
      {posts.map(post => (
        <FeedItem key={post.id} post={post} />
      ))}

      <InViewSentinel onVisible={loadMore} />
    </>
  );
}
