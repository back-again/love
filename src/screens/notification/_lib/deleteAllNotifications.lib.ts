import { supabase } from '@/api/supabase';

export async function deleteAllNotificationsLib(): Promise<void> {
  const { data: authData } = await supabase.auth.getUser();
  const userId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.warn('Error deleting all notifications:', error.message);
    throw error;
  }
}
