import { supabase } from '@/api/supabase';

export interface UpdateCommentParams {
  commentId: string;
  content: string;
}

export async function updateCommentLib({
  commentId,
  content,
}: UpdateCommentParams) {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';

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
