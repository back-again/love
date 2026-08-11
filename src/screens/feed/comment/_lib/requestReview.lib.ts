import { supabase } from '@/api/supabase';

interface RequestReviewParams {
  postId: string;
  userId?: string;
}

export async function requestReviewLib({
  postId,
  userId,
}: RequestReviewParams): Promise<void> {
  const activeUserId =
    userId ||
    (await supabase.auth.getUser()).data.user?.id ||
    '00000000-0000-0000-0000-000000000001';

  const { error: reqError } = await supabase
    .from('review_requests')
    .upsert(
      { post_id: postId, user_id: activeUserId },
      { onConflict: 'post_id, user_id' },
    );

  if (reqError) {
    console.error('Error inserting review request:', reqError.message);
    throw reqError;
  }

  const { data: postData } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (postData?.user_id && postData.user_id !== activeUserId) {
    await supabase.from('notifications').insert({
      user_id: postData.user_id,
      type: 'REVIEW_REQUEST',
      post_id: postId,
    });
  }
}
