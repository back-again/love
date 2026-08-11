import { supabase } from '@/api/supabase';

export interface CreateCommentParams {
  postId: string;
  content: string;
  parentId?: string | null;
  votedChoice?: 'O' | 'X' | null;
}

export async function createCommentLib({
  postId,
  content,
  parentId = null,
  votedChoice = null,
}: CreateCommentParams) {
  const { data: authData } = await supabase.auth.getUser();
  const userId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: userId,
      parent_id: parentId,
      content,
      voted_choice: votedChoice,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error.message);
    throw error;
  }

  return data;
}
