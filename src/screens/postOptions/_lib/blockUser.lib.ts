import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export async function blockUserLib(targetUserId: string): Promise<void> {
  const blockerId = await getCurrentUserId();
  if (!blockerId) {
    throw new Error('로그인이 필요합니다.');
  }

  const { error } = await supabase
    .from('user_blocks')
    .insert({
      blocker_id: blockerId,
      blocked_id: targetUserId,
    });

  if (error) {
    console.warn('blockUserLib error:', error.message);
    throw error;
  }
}
