import { supabase } from '@/api/supabase';

export async function markNotificationReadLib(notificationId: string): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.warn('Error marking notification as read:', error.message);
    throw error;
  }
}
