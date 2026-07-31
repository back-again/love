import { supabase } from '@/api/supabase';

interface UpdateNotificationAllowedParams {
  userId: string;
  notificationAllowed: boolean;
}

export async function updateNotificationAllowed({
  userId,
  notificationAllowed,
}: UpdateNotificationAllowedParams): Promise<boolean> {
  if (!userId) return false;

  const { error } = await supabase
    .from('users')
    .update({ notification_allowed: notificationAllowed })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update notification_allowed in Supabase:', error);
    return false;
  }

  return true;
}
