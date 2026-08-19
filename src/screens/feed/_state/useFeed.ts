import { useCallback } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Post } from '../_model/feed.model';
import { getFeedPostsLib, FetchFeedResponse, RawFeedPost } from '../_lib/getFeedPosts.lib';
import { useCategoryStore } from './useCategoryStore';

import { useLocalPostsStore } from './useLocalPostsStore';

export const getFeedQueryKey = (
  type: 'hot' | 'recent' = 'recent',
  category: string = '전체',
  pageSize: number = 5
) => ['feedPosts', type, category, pageSize] as const;

export function useFeed(
  type: 'hot' | 'recent' = 'recent',
  pageSize: number = 5
) {
  const selectedCategory = useCategoryStore(state => state.selectedCategory);
  const localPosts = useLocalPostsStore(state => state.localPosts);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    refetch,
  } = useSuspenseInfiniteQuery<FetchFeedResponse>({
    queryKey: getFeedQueryKey(type, selectedCategory, pageSize),
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) || 1;
      return getFeedPostsLib({
        type,
        category: selectedCategory,
        page,
        pageSize,
      });
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextPage ?? undefined,
    refetchInterval: 30000,
  });

  const posts: Post[] = data
    ? Array.from(
        data.pages
          .flatMap(page => {
            const userVoteMap = page.userVoteMap || {};
            const currentUserId = page.currentUserId;
            return page.rawPosts.map((item: RawFeedPost, index: number) => {
              const images: string[] = item.image_urls
                ? item.image_urls.split(',').filter(Boolean)
                : [];

              const voteOCount = item.vote_o_count ?? 0;
              const voteXCount = item.vote_x_count ?? 0;
              const totalVoteCount = voteOCount + voteXCount;
              const percentO =
                totalVoteCount > 0
                  ? Math.round((voteOCount / totalVoteCount) * 100)
                  : 50;
              const percentX = 100 - percentO;

              const rawId = item.id.split('-loop-')[0];
              const myVoteChoice =
                userVoteMap[item.id] || userVoteMap[rawId] || null;

              const commentCount = item.comment_count ?? 0;

              return {
                id: item.id,
                userId: item.user_id,
                isMyPost: Boolean(currentUserId && item.user_id === currentUserId),
                category: item.category || '',
                isHot: totalVoteCount >= 20,
                title: item.title,
                storySummary: item.content,
                fullStory: item.content,
                images,
                voteO: item.vote_o || '',
                voteX: item.vote_x || '',
                topComments: [],
                reviewStatus: item.has_review ? '후기 보기' : '후기 요청',
                reviewContent: item.review_content || '',
                hasReview: Boolean(item.has_review),
                fireCount: 0,
                facepalmCount: 0,
                commentCount,
                voteOCount,
                voteXCount,
                totalVoteCount,
                totalVotes: totalVoteCount,
                percentO,
                percentX,
                myVote: myVoteChoice,
                createdAt: item.created_at,
              };
            });
          })
          .reduce((map, post) => {
            if (!map.has(post.id)) {
              map.set(post.id, post);
            }
            return map;
          }, new Map<string, Post>())
          .values(),
      )
    : [];

  const isHotTab = selectedCategory === '인기' || selectedCategory === '🔥 인기';

  const filteredLocalPosts = localPosts.filter(p => {
    if (isHotTab) {
      return ((p.totalVotes ?? 0) >= 20 || (p.totalVoteCount ?? 0) >= 20);
    }
    return selectedCategory === '전체' || p.category === selectedCategory;
  });

  const mergedPosts = Array.from(
    [...filteredLocalPosts, ...posts].reduce((map, item) => {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
      return map;
    }, new Map<string, Post>()).values()
  );

  const loadMore = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;
    await fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  return {
    posts: mergedPosts,
    isLoading: isLoading || isPending,
    isFetchingNextPage,
    hasNextPage,
    loadMore,
    refresh: refetch,
  };
}
