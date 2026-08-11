'use client';

import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUserStore } from '@/_state/useUserStore';
import { WrittenPostCard, WrittenPost } from '../_component/WrittenPostCard';
import { getWrittenPosts } from '../_lib/getWrittenPosts.lib';
import ReviewScreen, { ReviewMode } from '@/screens/review/ReviewScreen';
import { useReviewModalStore } from '@/screens/review/_state/useReviewModalStore';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { usePostOptionsStore } from '@/screens/postOptions/_state/usePostOptionsStore';

export function WrittenPostListAction() {
  const user = useUserStore(state => state.user);
  const userId = user?.id;

  const [selectedPost, setSelectedPost] = useState<WrittenPost | null>(null);
  const [deletedPostIds] = useState<string[]>([]);

  const { data: writtenPosts } = useSuspenseQuery({
    queryKey: ['writtenPosts', userId],
    queryFn: () => getWrittenPosts({ userId }),
  });

  const activePosts = writtenPosts.filter(
    post => !deletedPostIds.includes(post.id),
  );

  const openReviewModal = useReviewModalStore(state => state.openReviewModal);

  const handleOpenReview = (mode: ReviewMode) => (post: WrittenPost) => {
    setSelectedPost(post);
    openReviewModal({
      mode,
      reviewText: post.reviewContent,
      postId: post.id,
    });
  };

  const openPostOptions = usePostOptionsStore(state => state.openPostOptions);

  return (
    <>
      {activePosts.map((post: WrittenPost) => (
        <WrittenPostCard
          key={post.id}
          post={post}
          onOpenViewReview={handleOpenReview('view')}
          onOpenWriteReview={handleOpenReview('write')}
          onOpenOptions={targetPost => {
            setSelectedPost(targetPost);
            openPostOptions({
              ...targetPost,
              storySummary: targetPost.title || '',
              fullStory: targetPost.title || '',
              images: [],
              voteO: '',
              voteX: '',
              topComments: [],
              reviewStatus: '',
              fireCount: 0,
              facepalmCount: 0,
              commentCount: 0,
              isMyPost: true,
            });
          }}
        />
      ))}

      <ReviewScreen />

      <PostOptionsScreen />
    </>
  );
}
