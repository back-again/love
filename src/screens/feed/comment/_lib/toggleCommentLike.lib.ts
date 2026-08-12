import { supabase } from '@/api/supabase';
import { sendPushNotificationLib } from '@/_lib/sendPushNotification.lib';

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

    const { data: commentData } = await supabase
      .from('comments')
      .select('user_id, post_id')
      .eq('id', commentId)
      .single();

    if (commentData?.user_id && commentData.user_id !== userId) {
      await supabase.from('notifications').insert({
        user_id: commentData.user_id,
        type: 'COMMENT_LIKE',
        post_id: commentData.post_id,
      });

      const { data: targetUser } = await supabase
        .from('users')
        .select('push_token, notification_allowed')
        .eq('id', commentData.user_id)
        .single();

      if (targetUser?.push_token && targetUser.notification_allowed === true) {
        sendPushNotificationLib({
          to: targetUser.push_token,
          title: '댓글 좋아요 👍',
          body: '내 댓글에 누군가가 좋아요를 눌렀어요!',
          data: { postId: commentData.post_id, type: 'COMMENT_LIKE' },
        });
      }
    }
  }
}
