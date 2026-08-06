import { supabase } from '@/api/supabase';

/**
 * Toggle post reaction ('FIRE' | 'FACEPALM') in Supabase.
 * @param postId target post ID
 * @param type reaction type
 * @param shouldAdd true to insert reaction, false to remove
 */
export async function togglePostReactionLib(
  postId: string,
  type: 'FIRE' | 'FACEPALM',
  shouldAdd: boolean
): Promise<void> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || '00000000-0000-0000-0000-000000000001';
    const rawPostId = postId.split('-loop-')[0];

    if (shouldAdd) {
      const { error } = await supabase
        .from('post_reactions')
        .upsert(
          { post_id: rawPostId, user_id: userId, type },
          { onConflict: 'post_id,user_id,type' }
        );

      if (error) {
        console.warn('Supabase add reaction error:', error.message);
      }
    } else {
      const { error } = await supabase
        .from('post_reactions')
        .delete()
        .eq('post_id', rawPostId)
        .eq('user_id', userId)
        .eq('type', type);

      if (error) {
        console.warn('Supabase remove reaction error:', error.message);
      }
    }
  } catch (err) {
    console.error('Unexpected error toggling post reaction:', err);
  }
}
