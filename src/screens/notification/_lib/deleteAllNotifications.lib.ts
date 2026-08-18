import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export async function deleteAllNotificationsLib(): Promise<void> {
  const userId = await getCurrentUserId();
  if (!userId) return;

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.warn('Error deleting all notifications:', error.message);
    throw error;
  }
}
