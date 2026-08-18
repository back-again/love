import { supabase } from '@/api/supabase';
import { getCurrentUserId } from '@/_lib/getCurrentUserId.lib';
import { RelationshipProfile } from '../_state/useRelationshipProfileStore';

/**
 * Save user relationship profile to Supabase users table
 */
export async function saveRelationshipProfileLib(
  profile: RelationshipProfile
): Promise<void> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return;

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
    console.warn('saveRelationshipProfileLib error:', err);
  }
}

/**
 * Get user relationship profile from Supabase users table
 */
export async function getRelationshipProfileLib(): Promise<RelationshipProfile | null> {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

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
    console.warn('getRelationshipProfileLib error:', err);
    return null;
  }
}
