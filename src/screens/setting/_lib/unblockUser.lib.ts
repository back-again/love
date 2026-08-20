import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export async function unblockUserLib(targetUserId: string): Promise<void> {
  const blockerId = await getCurrentUserId();
  if (!blockerId) {
    throw new Error('로그인이 필요합니다.');
  }

  const { error } = await supabase
    .from('user_blocks')
    .delete()
    .eq('blocker_id', blockerId)
    .eq('blocked_id', targetUserId);

  if (error) {
    console.warn('unblockUserLib error:', error.message);
    throw error;
  }
}
