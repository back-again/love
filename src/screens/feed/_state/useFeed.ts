import { useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../_model/feed.model';
import { fetchFeedPostsApi } from '../_lib/feedService';

const ASYNC_STORAGE_LAST_READ_KEY = '@odaplove_last_read_post_cursor';

export function useFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFallbackMode, setIsFallbackMode] = useState(false);

  const nextCursorRef = useRef<string | null>(null);

  // Save last read cursor to AsyncStorage
  const saveLastReadCursor = useCallback(async (cursorId: string) => {
    try {
      await AsyncStorage.setItem(ASYNC_STORAGE_LAST_READ_KEY, cursorId);
    } catch (e) {
      console.warn('Failed to save last read cursor to AsyncStorage', e);
    }
  }, []);

  // Fetch initial feed posts on mount
  const initFeed = useCallback(async () => {
    setIsLoading(true);
    try {
      let savedCursor: string | null = null;
      try {
        savedCursor = await AsyncStorage.getItem(ASYNC_STORAGE_LAST_READ_KEY);
      } catch (e) {
        console.warn('Failed to read cursor from AsyncStorage', e);
      }

      const res = await fetchFeedPostsApi({
        cursorId: savedCursor,
        pageSize: 5,
      });

      // If saved cursor returned empty, retry from start with null cursor
      if (res.posts.length === 0 && savedCursor) {
        const resetRes = await fetchFeedPostsApi({
          cursorId: null,
          pageSize: 5,
        });
        setPosts(resetRes.posts);
        nextCursorRef.current = resetRes.nextCursorId;
      } else {
        setPosts(res.posts);
        nextCursorRef.current = res.nextCursorId;
      }

      setIsFallbackMode(res.isFallbackLoop);
    } catch (e) {
      console.error('Error initializing feed:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initFeed();
  }, [initFeed]);

  // Load next page of posts (Cursor pagination + Infinite Loop)
  const loadMore = useCallback(async () => {
    if (isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const res = await fetchFeedPostsApi({
        cursorId: nextCursorRef.current,
        pageSize: 5,
      });

      if (res.posts.length > 0) {
        setPosts(prev => {
          // Deduplicate using Map by post id
          const map = new Map<string, Post>();
          prev.forEach(p => map.set(p.id, p));
          res.posts.forEach(p => map.set(p.id, p));
          return Array.from(map.values());
        });

        nextCursorRef.current = res.nextCursorId;
        if (res.isFallbackLoop) {
          setIsFallbackMode(true);
        }

        if (res.nextCursorId) {
          saveLastReadCursor(res.nextCursorId);
        }
      }
    } catch (e) {
      console.error('Error loading more feed posts:', e);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [isFetchingNextPage, saveLastReadCursor]);

  return {
    posts,
    isLoading,
    isFetchingNextPage,
    isFallbackMode,
    loadMore,
    refresh: initFeed,
    saveLastReadCursor,
  };
}
