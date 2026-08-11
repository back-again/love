'use client';

import React from 'react';
import { useCommentStore } from '../_state/useCommentStore';
import { ViewReviewBannerAction } from '../_action/ViewReviewBanner.action';
import { RequestReviewBannerAction } from '../_action/RequestReviewBanner.action';

export function ReviewBannerHandler() {
  const targetPost = useCommentStore(state => state.targetPost);
  const hasReview = targetPost?.hasReview;

  if (hasReview) {
    return <ViewReviewBannerAction />;
  }

  return <RequestReviewBannerAction />;
}
