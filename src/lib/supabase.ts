import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Placeholder configuration (Replace with your actual Supabase project keys)
const supabaseUrl: string = 'https://cijmrumcbudewyhiwzcr.supabase.co';
const supabaseAnonKey: string = 'sb_publishable_G-psYrcy8PLQQYjVehH19A_OCDuU0Qu';

// Determine if the config has been updated by the user
const isConfigValid = supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseUrl !== '';

let supabase: any = null;

if (isConfigValid) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Avoids native storage warning for clean prototyping
        detectSessionInUrl: false,
      }
    });
  } catch (error) {
    console.error("Supabase initialization failed:", error);
  }
} else {
  console.warn("Supabase config is using placeholders. Bypassing with mock logins for local testing.");
}

export { supabase, isConfigValid };
