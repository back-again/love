import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(
  SUPABASE_URL || 'https://heddincpvgpehisfdaoa.supabase.co',
  SUPABASE_ANON_KEY || 'sb_publishable_wB5zVAL_lQ8quWG3UiQxjg_hi1qxfK7',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

export const isConfigValid = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
