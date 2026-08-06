import { supabase } from '@/api/supabase';

/**
 * Submit review request for a post in Supabase review_requests table
 */
export async function requestReviewLib(postId: string): Promise<boolean> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
    const rawPostId = postId.split('-loop-')[0];

    const { error } = await supabase
      .from('review_requests')
      .upsert(
        { post_id: rawPostId, user_id: userId },
        { onConflict: 'post_id,user_id' }
      );

    if (error) {
      console.warn('Supabase requestReview error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Unexpected error requesting review:', err);
    return false;
  }
}
