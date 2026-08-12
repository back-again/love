import { supabase } from '@/api/supabase';
import { RelationshipProfile } from '../_state/useRelationshipProfileStore';

const FALLBACK_USER_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Save user relationship profile to Supabase users table
 */
export async function saveRelationshipProfileLib(
  profile: RelationshipProfile
): Promise<void> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || FALLBACK_USER_ID;

    const payload = {
      relationship_profile: profile,
    };

    const { error: updateError } = await supabase
      .from('users')
      .update(payload)
      .eq('id', userId);

    if (updateError) {
      const { error: upsertError } = await supabase
        .from('users')
        .upsert({ id: userId, ...payload }, { onConflict: 'id' });
      if (upsertError) {
        console.warn('Supabase DB save skipped:', upsertError.message);
      }
    }
  } catch (err) {
    console.warn('saveRelationshipProfileLib fallback error:', err);
  }
}

/**
 * Get user relationship profile from Supabase users table
 */
export async function getRelationshipProfileLib(): Promise<RelationshipProfile | null> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData.user?.id || FALLBACK_USER_ID;

    const { data, error } = await supabase
      .from('users')
      .select('relationship_profile')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data || !data.relationship_profile) {
      return null;
    }

    return data.relationship_profile as RelationshipProfile;
  } catch (err) {
    console.warn('getRelationshipProfileLib fallback error:', err);
    return null;
  }
}
