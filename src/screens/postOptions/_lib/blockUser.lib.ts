import { supabase } from '@/api/supabase';

export async function blockUserLib(targetUserId: string): Promise<void> {
  const { data: authData } = await supabase.auth.getUser();
  const blockerId =
    authData.user?.id || '00000000-0000-0000-0000-000000000001';

  const { error } = await supabase
    .from('user_blocks')
    .insert({
      blocker_id: blockerId,
      blocked_id: targetUserId,
    });

  if (error) {
    console.warn('blockUserLib error:', error.message);
  }
}
