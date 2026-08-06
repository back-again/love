import { useCallback, useEffect } from 'react';
import {
  useSuspenseInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../_model/feed.model';
import { fetchFeedPostsApi, FetchFeedResponse } from '../_lib/feedService';

const ASYNC_STORAGE_LAST_READ_KEY = '@odaplove_last_read_post_cursor';
export const FEED_QUERY_KEY = ['feedPosts'] as const;

/**
 * Prefetch initial feed query helper
 */
export async function prefetchFeed(
  queryClient: any,
  cursorId: string | null = null,
) {
  await queryClient.prefetchQuery({
    queryKey: [...FEED_QUERY_KEY, cursorId],
    queryFn: () => fetchFeedPostsApi({ cursorId, pageSize: 5 }),
  });
}

/**
 * Feed hook using SuspenseQuery (useSuspenseInfiniteQuery) & Prefetch pattern
 */
export function useFeed() {
  const queryClient = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteQuery<FetchFeedResponse>({
      queryKey: FEED_QUERY_KEY,
      queryFn: async ({ pageParam }) => {
        const cursorId = (pageParam as string | null) ?? null;
        return fetchFeedPostsApi({ cursorId, pageSize: 5 });
      },
      initialPageParam: null,
      getNextPageParam: lastPage => lastPage.nextCursorId ?? undefined,
      refetchInterval: 30000,
    });

  // Deduplicate and combine posts across fetched pages
  const posts: Post[] = data
    ? Array.from(
        data.pages
          .flatMap(page => page.posts)
          .reduce((map, post) => {
            if (!map.has(post.id)) {
              map.set(post.id, post);
            }
            return map;
          }, new Map<string, Post>())
          .values(),
      )
    : [];

  const lastPage = data?.pages[data.pages.length - 1];
  const isFallbackMode = lastPage?.isFallbackLoop ?? false;
  const nextCursorId = lastPage?.nextCursorId ?? null;

  // Prefetch Pattern: Automatically prefetch next cursor data into cache
  const prefetchNextPage = useCallback(() => {
    if (nextCursorId) {
      queryClient.prefetchQuery({
        queryKey: [...FEED_QUERY_KEY, 'prefetch', nextCursorId],
        queryFn: () =>
          fetchFeedPostsApi({
            cursorId: nextCursorId,
            pageSize: 5,
          }),
      });
    }
  }, [nextCursorId, queryClient]);

  useEffect(() => {
    prefetchNextPage();
  }, [prefetchNextPage]);

  // Save last read cursor to AsyncStorage
  const saveLastReadCursor = useCallback(async (cursorId: string) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_LAST_READ_KEY, cursorId);
    } catch (e) {
      console.warn('Failed to save last read cursor to AsyncStorage', e);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (isFetchingNextPage || !hasNextPage) return;
    const res = await fetchNextPage();
    const newLastPage = res.data?.pages[res.data.pages.length - 1];
    if (newLastPage?.nextCursorId) {
      saveLastReadCursor(newLastPage.nextCursorId);
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage, saveLastReadCursor]);

  return {
    posts,
    isLoading: false,
    isFetchingNextPage,
    isFallbackMode,
    hasNextPage,
    loadMore,
    refresh: refetch,
    saveLastReadCursor,
    prefetchNextPage,
  };
}
