import { supabase } from '@/api/supabase';

export interface DeleteCommentParams {
  commentId: string;
}

export async function deleteCommentLib({
  commentId,
}: DeleteCommentParams) {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';

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
