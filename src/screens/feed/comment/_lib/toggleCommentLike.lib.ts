import { supabase } from '@/api/supabase';

export interface ToggleCommentLikeParams {
  commentId: string;
  isLiked: boolean;
}

export async function toggleCommentLikeLib({
  commentId,
  isLiked,
}: ToggleCommentLikeParams) {
  const { data: authData } = await supabase.auth.getUser();
  const userId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

  if (isLiked) {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .match({ comment_id: commentId, user_id: userId });

    if (error) {
      console.error('Error unliking comment:', error.message);
      throw error;
    }
  } else {
    const { error } = await supabase
      .from('comment_likes')
      .upsert({ comment_id: commentId, user_id: userId });

    if (error) {
      console.error('Error liking comment:', error.message);
      throw error;
    }
  }
}
