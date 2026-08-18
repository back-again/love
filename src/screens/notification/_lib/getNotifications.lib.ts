import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { NotificationItem } from '../_model/notification.model';
import { formatTimeAgo } from '@/screens/feed/_lib/formatTimeAgo.lib';

export async function getNotificationsLib(): Promise<NotificationItem[]> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        id,
        type,
        post_id,
        is_read,
        created_at,
        posts ( title, vote_o, vote_x )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching notifications:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => {
      const postTitle = item.posts?.title || '내 사연';
      const isVote =
        item.type === 'VOTE' ||
        item.type === 'VOTE_CREATED' ||
        item.type === 'VOTE_O' ||
        item.type === 'VOTE_X';

      let message = '';
      if (isVote) {
        const isChoiceX = item.type === 'VOTE_X';
        const choiceLabel = isChoiceX ? "'X'" : "'O'";
        message = `${choiceLabel}에 1표가 달렸어요!`;
      } else if (item.type === 'REVIEW_REQUEST') {
        message = '누군가가 내 고민의 후기를 궁금해하고 있어요!';
      } else if (item.type === 'REVIEW_CREATED') {
        message = item.content || '요청하신 사연의 후기가 도착했습니다! 💌';
      } else if (item.type === 'COMMENT_LIKE') {
        message = '내 댓글에 공감이 달렸어요! ❤️';
      } else {
        message = item.content
          ? `"${item.content}"`
          : '"내 사연에 새로운 댓글이 남겨졌어요."';
      }

      return {
        id: item.id,
        type: isVote ? 'vote' : 'comment',
        postId: item.post_id,
        postTitle,
        message,
        timestamp: formatTimeAgo(item.created_at),
        isRead: item.is_read ?? false,
      };
    });
  } catch (err) {
    console.log('Notifications DB fetch skipped:', err);
    return [];
  }
}
