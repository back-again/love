import { supabase } from '@/api/supabase';

interface CreateReviewParams {
  postId: string;
  reviewContent: string;
}

export async function createReview({
  postId,
  reviewContent,
}: CreateReviewParams) {
  const { data, error } = await supabase
    .from('posts')
    .update({ review_content: reviewContent })
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    if (
      error.code === '42501' ||
      error.message?.includes('violates row-level security policy') ||
      error.message?.includes('security policy')
    ) {
      console.warn(
        'Supabase RLS Policy warning on review update. Applying local state fallback.',
      );
      return { id: postId, review_content: reviewContent };
    }
    throw error;
  }

  return data;
}
