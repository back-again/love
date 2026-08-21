'use client';

import React from 'react';
import { Post } from '@/screens/feed/_model/feed.model';
import { DetailReviewCardAction } from '../_action/DetailReviewCard.action';
import { DetailRequestReviewAction } from '../_action/DetailRequestReview.action';

interface DetailReviewHandlerProps {
  post: Post;
}

export function DetailReviewHandler({ post }: DetailReviewHandlerProps) {
  const hasReview = post.hasReview;

  if (hasReview) {
    return <DetailReviewCardAction post={post} />;
  }

  return <DetailRequestReviewAction post={post} />;
}
