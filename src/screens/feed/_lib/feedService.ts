import { getFeedPostsLib, FetchFeedParams, FetchFeedResponse } from './getFeedPosts.lib';
import { submitVoteLib } from './submitVote.lib';
import { togglePostReactionLib } from './togglePostReaction.lib';
import { requestReviewLib } from './requestReview.lib';

export type { FetchFeedParams, FetchFeedResponse };

export const fetchFeedPostsApi = getFeedPostsLib;
export const submitVoteApi = submitVoteLib;
export const togglePostReactionApi = togglePostReactionLib;
export const requestReviewApi = requestReviewLib;

export {
  getFeedPostsLib,
  submitVoteLib,
  togglePostReactionLib,
  requestReviewLib,
};
