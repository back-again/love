import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export interface DeleteCommentParams {
  commentId: string;
}

export async function deleteCommentLib({
  commentId,
}: DeleteCommentParams) {
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  // Delete replies if any or delete the comment
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting comment:', error.message);
    throw error;
  }

  return true;
}
