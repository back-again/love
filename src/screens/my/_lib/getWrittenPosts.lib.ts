import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { WrittenPost } from '../_component/WrittenPostCard';

interface GetWrittenPostsParams {
  userId?: string | null;
}

export async function getWrittenPosts({
  userId,
}: GetWrittenPostsParams = {}): Promise<WrittenPost[]> {
  try {
    const targetUserId = userId || (await getCurrentUserId());
    if (!targetUserId) {
      return [];
    }

    const { data, error } = await supabase
      .from('post_details_view')
      .select('*')
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(
        '[getWrittenPosts] Supabase fetch error:',
        error.message,
        error.details,
        error.hint,
      );
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => {
      const voteO = item.vote_o_count || 0;
      const voteX = item.vote_x_count || 0;
      const totalVotes = voteO + voteX;
      const percentO =
        totalVotes > 0 ? Math.round((voteO / totalVotes) * 100) : 0;
      const percentX =
        totalVotes > 0 ? Math.round((voteX / totalVotes) * 100) : 0;

      return {
        id: item.id,
        title: item.title,
        participants: totalVotes,
        voteO,
        voteX,
        percentO,
        percentX,
        curiousCount: item.curious_count || 0,
        hasReview: Boolean(item.has_review),
        reviewContent: item.review_content || undefined,
        created_at: item.created_at,
      };
    });
  } catch (err) {
    console.error('[getWrittenPosts] Unexpected error:', err);
    return [];
  }
}
