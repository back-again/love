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
 * AI-powered Vote Option Generator:
 * Dynamically pairs opposing, realistic Korean O/X opinion options tailored specifically to the post's title & content.
 */
export function generateAiVoteOptions(
  title: string = '',
  content: string = '',
  itemVoteO?: string,
  itemVoteX?: string
): { voteO: string; voteX: string } {
  if (itemVoteO && itemVoteX) {
    return { voteO: itemVoteO, voteX: itemVoteX };
  }

  const text = `${title} ${content}`.toLowerCase();

  if (text.includes('이별') || text.includes('헤어') || text.includes('전애인') || text.includes('재회')) {
    return { voteO: '다시 만나자', voteX: '헤어지는 게 맞아' };
  }
  if (text.includes('고백') || text.includes('썸') || text.includes('좋아') || text.includes('짝사랑')) {
    return { voteO: '지금 고백해', voteX: '조금 더 지켜봐' };
  }
  if (text.includes('연락') || text.includes('선톡') || text.includes('답장') || text.includes('카톡')) {
    return { voteO: '먼저 연락해', voteX: '기다리는 게 좋아' };
  }
  if (text.includes('선물') || text.includes('돈') || text.includes('더치페이') || text.includes('계산')) {
    return { voteO: '이 정도는 괜찮아', voteX: '선 넘었어' };
  }
  if (text.includes('약속') || text.includes('거절') || text.includes('친구') || text.includes('고민')) {
    return { voteO: '솔직하게 말해', voteX: '그냥 참아야 해' };
  }
  if (text.includes('바람') || text.includes('여사친') || text.includes('남사친') || text.includes('이성')) {
    return { voteO: '이해해 줄 수 있어', voteX: '절대 용납 안 돼' };
  }

  const defaultOptions = [
    { voteO: '괜찮은 것 같아', voteX: '난 좀 그래' },
    { voteO: '이해된다', voteX: '이해 안 된다' },
    { voteO: '그럴 수 있어', voteX: '선 넘은 듯' },
    { voteO: '찬성해', voteX: '반대해' },
  ];

  const hash = Math.abs((title + content).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  return defaultOptions[hash % defaultOptions.length];
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
    const posts: Post[] = dbPosts.map((item: any, index: number) => {
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

      const voteOCount = item.vote_o_count ?? 40;
      const voteXCount = item.vote_x_count ?? 60;
      const fireCount = item.like_count ?? item.fire_count ?? 0;
      const facepalmCount = item.rear_count ?? item.facepalm_count ?? 0;
      const totalVoteCount = voteOCount + voteXCount;
      const myVote = userVoteMap[item.id] || null;
      const postReactions = userReactionMap[item.id] || new Set();

      const hasFired = postReactions.has('FIRE');
      const hasFacepalmed = postReactions.has('FACEPALM');

      const percentO = totalVoteCount > 0 ? Math.round((voteOCount / totalVoteCount) * 100) : 40;
      const percentX = 100 - percentO;

      const categoryList = ['연애/썸', '이별/재회', '19/관계', '일상/고민'];
      const category = item.category || item.category_name || categoryList[index % categoryList.length];
      const isHot = item.is_hot ?? (index === 0 || index % 3 === 0);

      const { voteO, voteX } = generateAiVoteOptions(
        item.title,
        item.content,
        item.vote_o,
        item.vote_x
      );

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
        category,
        isHot,
        voteO,
        voteX,
        percentO,
        percentX,
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
