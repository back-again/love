import { supabase } from '@/api/supabase';
import { Post, CommentItem } from '../_model/feed.model';

export interface FetchFeedParams {
  cursorId?: string | null;
  pageSize?: number;
}

export interface FetchFeedResponse {
  posts: Post[];
  nextCursorId: string | null;
  isFallbackLoop: boolean;
}

/**
 * Fetch feed posts from Supabase DB with Cursor-based pagination & automatic DB loop fallback.
 */
export async function getFeedPostsLib({
  cursorId = null,
  pageSize = 5,
}: FetchFeedParams): Promise<FetchFeedResponse> {
  try {
    let lastCreatedAt: string | null = null;

    // 1. If cursorId is provided, get timestamp for cursor pagination
    if (cursorId) {
      const { data: cursorPost } = await supabase
        .from('posts')
        .select('created_at')
        .eq('id', cursorId)
        .single();

      if (cursorPost?.created_at) {
        lastCreatedAt = cursorPost.created_at;
      }
    }

    // 2. Query posts from post_details_view
    let query = supabase
      .from('post_details_view')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(pageSize);

    if (lastCreatedAt) {
      query = query.lt('created_at', lastCreatedAt);
    }

    let { data: dbPosts, error } = await query;
    let isFallbackLoop = false;

    if (error) {
      console.error('Supabase fetch feed error:', error.message);
    }

    // 3. Fallback DB Loop: If older posts run out, query top Supabase posts again
    if (!dbPosts || dbPosts.length === 0) {
      const { data: loopPosts } = await supabase
        .from('post_details_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(pageSize);

      if (loopPosts && loopPosts.length > 0) {
        dbPosts = loopPosts;
        isFallbackLoop = true;
      }
    }

    if (!dbPosts || dbPosts.length === 0) {
      return { posts: [], nextCursorId: null, isFallbackLoop: false };
    }

    const postIds = dbPosts.map((p: any) => p.id);

    // 4. Fetch images for fetched posts
    const { data: dbImages } = await supabase
      .from('post_images')
      .select('*')
      .in('post_id', postIds)
      .order('order_index', { ascending: true });

    const imageMap: Record<string, string[]> = {};
    if (dbImages) {
      dbImages.forEach((img: any) => {
        if (!imageMap[img.post_id]) {
          imageMap[img.post_id] = [];
        }
        imageMap[img.post_id].push(img.image_url);
      });
    }

    // 5. Fetch comments for fetched posts
    const { data: dbComments } = await supabase
      .from('comments')
      .select('*')
      .in('post_id', postIds)
      .order('created_at', { ascending: false });

    const commentMap: Record<string, CommentItem[]> = {};
    if (dbComments) {
      dbComments.forEach((c: any) => {
        if (!commentMap[c.post_id]) {
          commentMap[c.post_id] = [];
        }
        commentMap[c.post_id].push({
          id: c.id,
          user: '익명',
          text: c.content || '',
          likes: c.like_count || 0,
        });
      });
    }

    // 6. Fetch current user's votes, reactions & review requests for fetched posts
    const { data: authData } = await supabase.auth.getUser();
    const activeUserId =
      authData.user?.id || '00000000-0000-0000-0000-000000000001';

    const { data: dbUserVotes } = await supabase
      .from('votes')
      .select('post_id, choice')
      .eq('user_id', activeUserId)
      .in('post_id', postIds);

    const userVoteMap: Record<string, 'O' | 'X'> = {};
    if (dbUserVotes) {
      dbUserVotes.forEach((v: any) => {
        userVoteMap[v.post_id] = v.choice as 'O' | 'X';
      });
    }

    const { data: dbUserReactions } = await supabase
      .from('post_reactions')
      .select('post_id, type')
      .eq('user_id', activeUserId)
      .in('post_id', postIds);

    const userReactionMap: Record<string, Set<string>> = {};
    if (dbUserReactions) {
      dbUserReactions.forEach((r: any) => {
        if (!userReactionMap[r.post_id]) {
          userReactionMap[r.post_id] = new Set();
        }
        userReactionMap[r.post_id].add(r.type);
      });
    }

    const { data: dbUserReviewReqs } = await supabase
      .from('review_requests')
      .select('post_id')
      .eq('user_id', activeUserId)
      .in('post_id', postIds);

    const userReviewReqSet = new Set(
      dbUserReviewReqs ? dbUserReviewReqs.map((r: any) => r.post_id) : []
    );

    // 7. Map DB records into Post models
    const posts: Post[] = dbPosts.map((item: any) => {
      const images = imageMap[item.id] || [];
      const topComments =
        commentMap[item.id] && commentMap[item.id].length > 0
          ? commentMap[item.id]
          : [
              {
                id: `c-${item.id}`,
                user: '익명1',
                text: '투표 및 의견을 남겨주세요!',
                likes: 0,
              },
            ];

      const uniqueId = isFallbackLoop
        ? `${item.id}-loop-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
        : item.id;

      const voteOCount = item.vote_o_count || 0;
      const voteXCount = item.vote_x_count || 0;
      const fireCount = item.like_count ?? item.fire_count ?? 0;
      const facepalmCount = item.rear_count ?? item.facepalm_count ?? 0;
      const totalVoteCount = voteOCount + voteXCount;
      const myVote = userVoteMap[item.id] || null;
      const postReactions = userReactionMap[item.id] || new Set();

      const hasFired = postReactions.has('FIRE');
      const hasFacepalmed = postReactions.has('FACEPALM');

      return {
        id: uniqueId,
        variantName: images.length === 0 ? '사진 안넣음' : `사진 ${images.length}개`,
        title: item.title,
        storySummary:
          item.content.length > 50
            ? `${item.content.substring(0, 50)}...`
            : item.content,
        fullStory: item.content,
        images,
        voteO: '괜찮은데?',
        voteX: '난 싫어',
        topComments,
        reviewStatus: item.has_review ? '후기 보기' : '후기 요청',
        hasReview: Boolean(item.has_review),
        fireCount,
        facepalmCount,
        commentCount: topComments.length,
        voteOCount,
        voteXCount,
        totalVoteCount,
        myVote,
        hasFired,
        hasFacepalmed,
        hasRequestedReview: userReviewReqSet.has(item.id),
      };
    });

    const nextCursorId = dbPosts.length > 0 ? dbPosts[dbPosts.length - 1].id : null;

    return {
      posts,
      nextCursorId,
      isFallbackLoop,
    };
  } catch (err) {
    console.error('Unexpected error fetching feed from Supabase:', err);
    return { posts: [], nextCursorId: null, isFallbackLoop: false };
  }
}
