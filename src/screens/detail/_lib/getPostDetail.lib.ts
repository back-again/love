import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { Post } from '@/screens/feed/_model/feed.model';
import { PostDetailData } from '../_model/detail.model';

export async function getPostDetailLib(postId: string): Promise<PostDetailData | null> {
  if (!postId) return null;
  const cleanPostId = postId.split('-loop-')[0];

  try {
    const userId = await getCurrentUserId();

    const { data: rawPost, error } = await supabase
      .from('post_details_view')
      .select('*')
      .eq('id', cleanPostId)
      .maybeSingle();

    if (error || !rawPost) {
      console.warn('Error fetching post detail in getPostDetailLib:', error?.message);
      return null;
    }

    let myVote: 'O' | 'X' | null = null;
    if (userId) {
      const { data: userVote } = await supabase
        .from('votes')
        .select('choice')
        .eq('user_id', userId)
        .eq('post_id', cleanPostId)
        .maybeSingle();

      if (userVote) {
        myVote = userVote.choice as 'O' | 'X';
      }
    }

    const images = rawPost.image_urls
      ? rawPost.image_urls.split(',').filter(Boolean)
      : [];

    const post: Post = {
      id: rawPost.id,
      userId: rawPost.user_id,
      category: rawPost.category || '',
      title: rawPost.title || '',
      content: rawPost.content || '',
      images,
      voteO: rawPost.vote_o || '',
      voteX: rawPost.vote_x || '',
      reviewContent: rawPost.review_content || '',
      hasReview: Boolean(rawPost.has_review),
      commentCount: rawPost.comment_count ?? 0,
      voteOCount: rawPost.vote_o_count ?? 0,
      voteXCount: rawPost.vote_x_count ?? 0,
      createdAt: rawPost.created_at,
    };

    return { post, myVote };
  } catch (err) {
    console.error('Unexpected error in getPostDetailLib:', err);
    return null;
  }
}
