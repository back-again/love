import { supabase } from '@/api/supabase';
import { WrittenPost } from '../_component/WrittenPostCard';

interface GetWrittenPostsParams {
  userId?: string;
}

export async function getWrittenPosts({
  userId = '00000000-0000-0000-0000-000000000001',
}: GetWrittenPostsParams = {}): Promise<WrittenPost[]> {
  const { data, error } = await supabase
    .from('post_details_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
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
    };
  });
}
