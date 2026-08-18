import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export async function markAllNotificationsReadLib(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId);

  if (error) {
    console.warn('Error marking all notifications read:', error.message);
    throw error;
  }
}
