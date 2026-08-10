'use client';

import React, { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useUserStore } from '@/_state/useUserStore';
import { WrittenPostCard, WrittenPost } from '../_component/WrittenPostCard';
import { getWrittenPosts } from '../_lib/getWrittenPosts.lib';
import ReviewScreen, { ReviewMode } from '@/screens/review/ReviewScreen';
import { PostOptionsBottomSheet } from '@/components/modal/PostOptionsBottomSheet';
import { ToastMessage } from '@/components/modal/ToastMessage';

export function WrittenPostListAction() {
  const user = useUserStore(state => state.user);
  const userId = user?.id;

  const [selectedPost, setSelectedPost] = useState<WrittenPost | null>(null);
  const [reviewMode, setReviewMode] = useState<ReviewMode>('view');
  const [isReviewVisible, setIsReviewVisible] = useState(false);

  const [optionsPost, setOptionsPost] = useState<WrittenPost | null>(null);
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const { data: writtenPosts } = useSuspenseQuery({
    queryKey: ['writtenPosts', userId],
    queryFn: () => getWrittenPosts({ userId }),
  });

  const activePosts = writtenPosts.filter(post => !deletedPostIds.includes(post.id));

  const handleOpenReview = (mode: ReviewMode) => (post: WrittenPost) => {
    setSelectedPost(post);
    setReviewMode(mode);
    setIsReviewVisible(true);
  };

  const showToast = (message: string) => {
    setToast({ visible: true, message });
  };

  return (
    <>
      {activePosts.map((post, idx) => (
        <WrittenPostCard
          key={post.id + idx}
          post={post}
          onOpenViewReview={handleOpenReview('view')}
          onOpenWriteReview={handleOpenReview('write')}
          onOpenOptions={targetPost => setOptionsPost(targetPost)}
        />
      ))}

      <ReviewScreen
        visible={isReviewVisible}
        onClose={() => setIsReviewVisible(false)}
        mode={reviewMode}
        reviewText={selectedPost?.reviewContent}
        postId={selectedPost?.id}
      />

      <PostOptionsBottomSheet
        visible={!!optionsPost}
        onClose={() => setOptionsPost(null)}
        isMyPost={true}
        onEdit={() => {
          showToast('게시글 수정 페이지로 이동합니다.');
        }}
        onDelete={() => {
          if (optionsPost) {
            setDeletedPostIds(prev => [...prev, optionsPost.id]);
            showToast('게시글이 삭제되었습니다.');
          }
        }}
      />

      <ToastMessage
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </>
  );
}
