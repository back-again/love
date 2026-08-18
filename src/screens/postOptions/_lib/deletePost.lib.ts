import { supabase } from '@/api/supabase';

export async function deletePostLib(postId: string): Promise<void> {
  try {
    const rawId = postId.split('-loop-')[0];
    const { error } = await supabase.from('posts').delete().eq('id', rawId);
    if (error) {
      console.warn('deletePostLib error:', error.message);
      throw error;
    }
  } catch (err) {
    console.warn('deletePostLib fallback error:', err);
    throw err;
  }
}
