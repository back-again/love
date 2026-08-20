import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';

export async function submitVoteLib(postId: string, choice: 'O' | 'X'): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      console.warn('submitVoteLib: no user logged in');
      return;
    }

    const { error } = await supabase
      .from('votes')
      .upsert(
        { post_id: postId, user_id: userId, choice },
        { onConflict: 'post_id,user_id' }
      );

    if (error) {
      console.warn('Supabase submitVote error:', error.message);
    } else {
      const { data: postData } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (postData?.user_id && postData.user_id !== userId) {
        await supabase.from('notifications').insert({
          user_id: postData.user_id,
          type: `VOTE_${choice}`,
          post_id: postId,
        });
      }
    }
  } catch (err) {
    console.error('Unexpected error submitting vote:', err);
  }
}
