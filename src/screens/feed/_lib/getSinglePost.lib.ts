import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { Post } from '../_model/feed.model';

export async function getSinglePostLib(postId: string): Promise<Post | null> {
  try {
    const userId = await getCurrentUserId();

    const { data: rawPost, error } = await supabase
      .from('post_details_view')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !rawPost) {
      console.warn('Error fetching single post details:', error?.message);
      return null;
    }

    let myVote: 'O' | 'X' | null = null;
    if (userId) {
      const { data: userVote } = await supabase
        .from('votes')
        .select('choice')
        .eq('user_id', userId)
        .eq('post_id', postId)
        .maybeSingle();

      if (userVote) {
        myVote = userVote.choice as 'O' | 'X';
      }
    }

    const images = rawPost.image_urls
      ? rawPost.image_urls.split(',').filter(Boolean)
      : [];

    const voteOCount = rawPost.vote_o_count ?? 0;
    const voteXCount = rawPost.vote_x_count ?? 0;
    const totalVoteCount = voteOCount + voteXCount;

    const percentO =
      totalVoteCount > 0 ? Math.round((voteOCount / totalVoteCount) * 100) : 50;
    const percentX = 100 - percentO;

    const commentCount = rawPost.comment_count ?? 0;

    return {
      id: rawPost.id,
      userId: rawPost.user_id,
      category: rawPost.category || '',
      title: rawPost.title,
      content: rawPost.content,
      images,
      voteO: rawPost.vote_o || '',
      voteX: rawPost.vote_x || '',
      reviewContent: rawPost.review_content || '',
      hasReview: Boolean(rawPost.has_review),
      commentCount,
      voteOCount,
      voteXCount,
      createdAt: rawPost.created_at,
    };
  } catch (err) {
    console.error('Unexpected error in getSinglePostLib:', err);
    return null;
  }
}
