import { supabase } from '@/api/supabase';
import { sendPushNotificationLib } from '@/_lib/sendPushNotification.lib';

interface RequestReviewParams {
  postId: string;
  userId?: string;
}

export async function requestReviewLib({
  postId,
  userId,
}: RequestReviewParams): Promise<void> {
  const activeUserId =
    userId ||
    (await supabase.auth.getUser()).data.user?.id ||
    '00000000-0000-0000-0000-000000000001';

  const cleanPostId = postId.split('-loop-')[0];

  const { error: reqError } = await supabase
    .from('review_requests')
    .upsert(
      { post_id: cleanPostId, user_id: activeUserId },
      { onConflict: 'post_id, user_id' },
    );

  if (reqError) {
    console.error('Error inserting review request:', reqError.message);
    throw reqError;
  }

  const { data: postData } = await supabase
    .from('post_details_view')
    .select('user_id')
    .eq('id', cleanPostId)
    .single();

  if (postData?.user_id && postData.user_id !== activeUserId) {
    await supabase.from('notifications').insert({
      user_id: postData.user_id,
      type: 'REVIEW_REQUEST',
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
        title: '후기 작성 요청 💌',
        body: '누군가가 내 고민의 후기를 궁금해하고 있어요!',
        data: { postId: cleanPostId, type: 'REVIEW_REQUEST' },
      });
    }
  }
}
