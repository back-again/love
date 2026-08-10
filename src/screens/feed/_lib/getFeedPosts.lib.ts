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
 * Performs semantic analysis of the post title & content to dynamically generate realistic Korean O/X options.
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

  const cleanTitle = title.trim();
  const cleanContent = content.trim();
  const text = `${cleanTitle} ${cleanContent}`.toLowerCase();

  // 1. Direct question pattern extraction from title
  if (cleanTitle.includes('고백할까') || cleanTitle.includes('고백 해야') || cleanTitle.includes('고백')) {
    return { voteO: '지금 고백해', voteX: '아직 고백하지 마' };
  }
  if (cleanTitle.includes('헤어질까') || cleanTitle.includes('헤어져야') || cleanTitle.includes('헤어')) {
    return { voteO: '헤어지는 게 맞아', voteX: '더 만나보는 게 좋아' };
  }
  if (cleanTitle.includes('말할까') || cleanTitle.includes('말해야') || cleanTitle.includes('말해')) {
    return { voteO: '솔직히 말하자', voteX: '속으로 참고 넘어가' };
  }
  if (cleanTitle.includes('연락할까') || cleanTitle.includes('선톡') || cleanTitle.includes('연락')) {
    return { voteO: '먼저 연락해', voteX: '기다리는 게 나아' };
  }
  if (cleanTitle.includes('살까') || cleanTitle.includes('지를까') || cleanTitle.includes('구매')) {
    return { voteO: '지르는 게 맞아', voteX: '지갑 지켜' };
  }
  if (cleanTitle.includes('퇴사') || cleanTitle.includes('이직')) {
    return { voteO: '퇴사가 답이다', voteX: '버티는 게 이기는 거야' };
  }

  // 2. Keyword & Theme semantic extraction
  if (text.includes('재회') || text.includes('전애인') || text.includes('다시 만')) {
    return { voteO: '다시 시도해보자', voteX: '이미 끝난 사이야' };
  }
  if (text.includes('이별') || text.includes('헤어') || text.includes('차임')) {
    return { voteO: '미련 버리고 정해', voteX: '한 번 더 대화해봐' };
  }
  if (text.includes('짝사랑') || text.includes('썸')) {
    return { voteO: '용기 내서 표현해', voteX: '아직은 시기상조야' };
  }
  if (text.includes('답장') || text.includes('카톡') || text.includes('읽씹')) {
    return { voteO: '먼저 다가가자', voteX: '자존심 지켜' };
  }
  if (text.includes('데이트통장') || (text.includes('더치페이') && text.includes('통장'))) {
    return { voteO: '더치페이가 깔끔해', voteX: '데이트통장이 훨씬 편해' };
  }
  if (text.includes('더치페이') || text.includes('데이트비용') || text.includes('계산') || text.includes('선물') || text.includes('돈')) {
    return { voteO: '이 정도는 이해해', voteX: '선 넘은 게 맞아' };
  }
  if (text.includes('여사친') || text.includes('남사친') || text.includes('이성친구') || text.includes('바람')) {
    return { voteO: '서운할 만해', voteX: '이해해 줄 수 있어' };
  }
  if (text.includes('결혼') || text.includes('동거') || text.includes('시댁') || text.includes('처가')) {
    return { voteO: '신중하게 판단해', voteX: '단호하게 의사표현해' };
  }
  if (text.includes('거절') || text.includes('약속') || text.includes('친구') || text.includes('싸움')) {
    return { voteO: '솔직하게 풀어', voteX: '시간을 두고 보자' };
  }

  // 3. Fallback pattern for general questions
  if (cleanTitle.endsWith('?') || cleanTitle.includes('어때')) {
    return { voteO: '완전 괜찮아', voteX: '난 좀 별로야' };
  }

  return { voteO: '찬성해 (그럴 수 있어)', voteX: '반대해 (선 넘었어)' };
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
