import { supabase } from '@/api/supabase';

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
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchFeedResponse {
  rawPosts: RawFeedPost[];
  userVoteMap: Record<string, 'O' | 'X'>;
  page: number;
  nextPage: number | null;
  hasMore: boolean;
}

export async function getFeedPostsLib({
  type = 'recent',
  category = '전체',
  page = 1,
  pageSize = 5,
}: FetchFeedParams): Promise<FetchFeedResponse> {
  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('post_details_view').select('*');

    if (category && category !== '전체') {
      query = query.eq('category', category);
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

    if (!dbPosts || dbPosts.length === 0) {
      return { rawPosts: [], userVoteMap: {}, page, nextPage: null, hasMore: false };
    }

    const postIds = dbPosts.map((p: any) => p.id);
    const { data: authData } = await supabase.auth.getUser();
    const activeUserId =
      authData.user?.id || '00000000-0000-0000-0000-000000000001';

    const userVoteMap: Record<string, 'O' | 'X'> = {};

    if (activeUserId) {
      const { data: dbUserVotes } = await supabase
        .from('votes')
        .select('post_id, choice')
        .eq('user_id', activeUserId)
        .in('post_id', postIds);

      if (dbUserVotes) {
        dbUserVotes.forEach((v: any) => {
          userVoteMap[v.post_id] = v.choice as 'O' | 'X';
        });
      }
    }

    const hasMore = dbPosts.length === pageSize;
    const nextPage = hasMore ? page + 1 : null;

    return {
      rawPosts: dbPosts as RawFeedPost[],
      userVoteMap,
      page,
      nextPage,
      hasMore,
    };
  } catch (err) {
    console.error('Unexpected error fetching feed from Supabase:', err);
    return { rawPosts: [], userVoteMap: {}, page: 1, nextPage: null, hasMore: false };
  }
}
