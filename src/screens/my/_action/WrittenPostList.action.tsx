'use client';

import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUserStore } from '@/_state/useUserStore';
import { WrittenPostCard, WrittenPost } from '../_component/WrittenPostCard';
import { getWrittenPosts } from '../_lib/getWrittenPosts.lib';
import ReviewScreen, { ReviewMode } from '@/screens/review/ReviewScreen';

export function WrittenPostListAction() {
  const user = useUserStore(state => state.user);
  const userId = user?.id;

  const [selectedPost, setSelectedPost] = useState<WrittenPost | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('view');
  const [isReviewVisible, setIsReviewVisible] = useState(false);

  const { data: writtenPosts } = useSuspenseQuery({
    queryKey: ['writtenPosts', userId],
    queryFn: () => getWrittenPosts({ userId }),
  });

  const handleOpenReview = (mode: ReviewMode) => (post: WrittenPost) => {
    setSelectedPost(post);
    setReviewMode(mode);
    setIsReviewVisible(true);
  };

  return (
    <>
      {writtenPosts.map((post, idx) => (
        <WrittenPostCard
          key={post.id + idx}
          post={post}
          onOpenViewReview={handleOpenReview('view')}
          onOpenWriteReview={handleOpenReview('write')}
        />
      ))}

      <ReviewScreen
        visible={isReviewVisible}
        onClose={() => setIsReviewVisible(false)}
        mode={reviewMode}
        reviewText={selectedPost?.reviewContent}
        postId={selectedPost?.id}
      />
    </>
  );
}
