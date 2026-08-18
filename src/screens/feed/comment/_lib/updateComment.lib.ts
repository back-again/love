import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export interface UpdateCommentParams {
  commentId: string;
  content: string;
}

export async function updateCommentLib({
  commentId,
  content,
}: UpdateCommentParams) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating comment:', error.message);
    throw error;
  }

  return data;
}
