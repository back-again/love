import { supabase } from '@/api/supabase';
import { sendPushNotificationLib } from '@/_lib/sendPushNotification.lib';

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

  const { data: postData } = await supabase
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .single();

  if (postData?.user_id && postData.user_id !== userId) {
    const notiType = parentId ? 'COMMENT_REPLY' : 'COMMENT_LIKE';

    await supabase.from('notifications').insert({
      user_id: postData.user_id,
      type: notiType,
      post_id: postId,
    });

    const { data: targetUser } = await supabase
      .from('users')
      .select('push_token, notification_allowed')
      .eq('id', postData.user_id)
      .single();

    if (targetUser?.push_token && targetUser.notification_allowed === true) {
      sendPushNotificationLib({
        to: targetUser.push_token,
        title: parentId ? '새 답글 등록 💬' : '새 댓글 등록 💬',
        body: content,
        data: { postId, type: notiType },
      });
    }
  }

  return data;
}
