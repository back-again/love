import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
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
  const userId = await getCurrentUserId();
  if (!userId) {
    throw new Error('로그인이 필요합니다.');
  }

  const cleanPostId = postId.split('-loop-')[0];

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: cleanPostId,
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
    .from('post_details_view')
    .select('user_id')
    .eq('id', cleanPostId)
    .single();

  if (postData?.user_id && postData.user_id !== userId) {
    const notiType = parentId ? 'COMMENT_REPLY' : 'COMMENT_LIKE';

    await supabase.from('notifications').insert({
      user_id: postData.user_id,
      type: notiType,
      post_id: cleanPostId,
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
        data: { postId: cleanPostId, type: notiType },
      });
    }
  }

  return data;
}
