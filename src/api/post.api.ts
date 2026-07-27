import { supabase } from '@/api/supabase';

export interface Post {
  id: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  category?: string;
  title?: string;
  content?: string;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
}

export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPosts error:', error);
    return [];
  }
  return data || [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('getPostById error:', error);
    return null;
  }
  return data;
}

export async function updatePostLike(id: string, count: number): Promise<void> {
  const { error } = await supabase
    .from('posts')
    .update({ likes_count: count })
    .eq('id', id);

  if (error) {
    console.error('updatePostLike error:', error);
  }
}
