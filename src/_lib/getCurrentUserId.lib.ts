import { supabase } from '@/api/supabase';
import { useUserStore } from '@/_state/useUserStore';

export async function getCurrentUserId(): Promise<string | null> {
  const storeUserId = useUserStore.getState().user?.id;
  if (storeUserId) return storeUserId;

  const { data } = await supabase.auth.getUser();
  return data.user?.id || null;
}
