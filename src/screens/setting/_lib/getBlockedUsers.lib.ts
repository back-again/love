import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { BlockedUserItem } from '../_model/blockedUser.model';

export async function getBlockedUsersLib(): Promise<BlockedUserItem[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('user_blocks')
    .select('blocker_id, blocked_id, post_title, created_at')
    .eq('blocker_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('getBlockedUsersLib error:', error.message);
    return [];
  }

  return (data || []) as BlockedUserItem[];
}
