import { useCallback } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Post } from '../_model/feed.model';
import {
  getFeedPostsLib,
  FetchFeedResponse,
  RawFeedPost,
} from '../_lib/getFeedPosts.lib';
import { useFeedStore } from './useFeedStore';

export const getFeedQueryKey = (
  categoryId: string | null = null,
  pageSize: number = 5,
) =>
  [
    'feedPosts',
    categoryId === 'hot' ? 'hot' : 'recent',
    categoryId ?? 'all',
    pageSize,
  ] as const;

export function useFeedList(pageSize: number = 5) {
  const selectedCategoryId = useFeedStore(state => state.selectedCategoryId);

  const isHotTab = selectedCategoryId === 'hot';
  const effectiveType = isHotTab ? 'hot' : 'recent';

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    refetch,
  } = useSuspenseInfiniteQuery<FetchFeedResponse>({
    queryKey: getFeedQueryKey(selectedCategoryId, pageSize),
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) || 1;
      return getFeedPostsLib({
        type: effectiveType,
        categoryId:
          selectedCategoryId && selectedCategoryId !== 'hot'
            ? selectedCategoryId
            : undefined,
        page,
        pageSize,
      });
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    refetchInterval: 30000,
  });

  const posts: Post[] = data
    ? data.pages.flatMap(page =>
        page.rawPosts.map((item: RawFeedPost): Post => ({
          id: item.id,
          userId: item.user_id,
          category: item.category || '',
          title: item.title,
          content: item.content,
          images: item.image_urls
            ? item.image_urls.split(',').filter(Boolean)
            : [],
          voteO: item.vote_o || '',
          voteX: item.vote_x || '',
          reviewContent: item.review_content || '',
          hasReview: Boolean(item.has_review),
          commentCount: item.comment_count ?? 0,
          voteOCount: item.vote_o_count ?? 0,
          voteXCount: item.vote_x_count ?? 0,
          createdAt: item.created_at,
        })),
      )
    : [];

  const userVoteMap =
    data?.pages.reduce<Record<string, 'O' | 'X'>>((acc, page) => {
      return Object.assign(acc, page.userVoteMap || {});
    }, {}) || {};

  const loadMore = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;
    await fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return {
    posts,
    userVoteMap,
    isLoading: isLoading || isPending,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    refresh: refetch,
  };
}
