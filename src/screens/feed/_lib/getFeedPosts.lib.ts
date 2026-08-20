import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export interface RawFeedPost {
  id: string;
  user_id: string;
  category_id: string;
  category: string;
  title: string;
  content: string;
  vote_o: string;
  vote_x: string;
  review_content: string | null;
  created_at: string;
  vote_o_count: number;
  vote_x_count: number;
  curious_count: number;
  comment_count: number;
  image_urls: string;
  has_review: boolean;
}

export interface FetchFeedParams {
  type?: 'hot' | 'recent';
  categoryId?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchFeedResponse {
  rawPosts: RawFeedPost[];
  userVoteMap: Record<string, 'O' | 'X'>;
  currentUserId: string | null;
  page: number;
  nextPage: number | null;
  hasMore: boolean;
}

export async function getFeedPostsLib({
  type = 'recent',
  categoryId,
  page = 1,
  pageSize = 5,
}: FetchFeedParams): Promise<FetchFeedResponse> {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const userId = await getCurrentUserId();

    const blockedUserIds = new Set<string>();
    if (userId) {
      const { data: userBlocks } = await supabase
        .from('user_blocks')
        .select('blocked_id')
        .eq('blocker_id', userId);

      if (userBlocks) {
        userBlocks.forEach((b: any) => blockedUserIds.add(b.blocked_id));
      }
    }

    let query = supabase.from('post_details_view').select('*');

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (type === 'hot') {
      query = query
        .order('vote_o_count', { ascending: false })
        .order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: dbPosts, error } = await query.range(from, to);

    if (error) {
      console.error('Supabase fetch feed error:', error.message);
    }

    // 2. 차단된 사용자의 글 및 인기 글 조건 필터링
    let filteredDbPosts = (dbPosts || []).filter(
      (p: any) => !blockedUserIds.has(p.user_id),
    );

    if (type === 'hot') {
      filteredDbPosts = filteredDbPosts.filter(
        (p: any) => (p.vote_o_count ?? 0) + (p.vote_x_count ?? 0) >= 20,
      );
    }

    if (!filteredDbPosts || filteredDbPosts.length === 0) {
      return {
        rawPosts: [],
        userVoteMap: {},
        currentUserId: userId,
        page,
        nextPage: null,
        hasMore: false,
      };
    }

    const postIds = filteredDbPosts.map((p: any) => p.id);
    const userVoteMap: Record<string, 'O' | 'X'> = {};

    if (userId) {
      const { data: dbUserVotes } = await supabase
        .from('votes')
        .select('post_id, choice')
        .eq('user_id', userId)
        .in('post_id', postIds);

      if (dbUserVotes) {
        dbUserVotes.forEach((v: any) => {
          userVoteMap[v.post_id] = v.choice as 'O' | 'X';
        });
      }
    }

    const hasMore = filteredDbPosts.length === pageSize;
    const nextPage = hasMore ? page + 1 : null;

    return {
      rawPosts: filteredDbPosts as RawFeedPost[],
      userVoteMap,
      currentUserId: userId,
      page,
      nextPage,
      hasMore,
    };
  } catch (err) {
    console.error('Unexpected error fetching feed from Supabase:', err);
    return {
      rawPosts: [],
      userVoteMap: {},
      currentUserId: null,
      page: 1,
      nextPage: null,
      hasMore: false,
    };
  }
}
