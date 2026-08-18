import { supabase } from '@/api/supabase';
import { User } from '@/types/database.types';

interface UpdateOnboardingProfileParams {
  userId: string;
  gender: 'male' | 'female';
  birthYear: string;
  datingStartedAt: string;
  notificationAllowed: boolean;
}

export async function updateOnboardingProfile({
  userId,
  gender,
  birthYear,
  datingStartedAt,
  notificationAllowed,
}: UpdateOnboardingProfileParams): Promise<User> {
  const payload = {
    gender,
    birth_year: birthYear ? parseInt(birthYear, 10) : null,
    dating_started_at: datingStartedAt || null,
    notification_allowed: notificationAllowed,
  };

  // 1. Try UPDATE first
  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update(payload)
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (!updateError && updateData) {
    return updateData;
  }

  // 2. Fallback to UPSERT if row does not exist yet
  const { data: upsertData, error: upsertError } = await supabase
    .from('users')
    .upsert({ id: userId, ...payload }, { onConflict: 'id' })
    .select()
    .single();

  if (!upsertError && upsertData) {
    return upsertData;
  }

  throw updateError || upsertError;
}
