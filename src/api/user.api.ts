import { supabase } from '@/api/supabase';

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  photo_url?: string;
  gender?: 'male' | 'female';
  birth_year?: string;
  notification_allowed?: boolean;
  terms_agreed?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getUserProfile(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getUserProfile error:', error);
    throw error;
  }
  return data;
}

export async function updateUserProfile(
  id: string,
  profile: Partial<UserProfile>,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id, ...profile, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error('updateUserProfile error:', error);
    throw error;
  }
  return data;
}
