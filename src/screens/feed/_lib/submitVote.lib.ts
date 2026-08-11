import { supabase } from '@/api/supabase';

export async function submitVoteLib(postId: string, choice: 'O' | 'X'): Promise<void> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';

    const rawPostId = postId.split('-loop-')[0];

    const { error } = await supabase
      .from('votes')
      .upsert(
        { post_id: rawPostId, user_id: userId, choice },
        { onConflict: 'post_id,user_id' }
      );

    if (error) {
      console.warn('Supabase submitVote error:', error.message);
    }
  } catch (err) {
    console.error('Unexpected error submitting vote:', err);
  }
}
