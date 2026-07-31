import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/api/supabase';

const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
};

interface WithdrawUserParams {
  userId?: string;
}

export async function withdrawUser({ userId }: WithdrawUserParams): Promise<boolean> {
  try {
    if (userId) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        console.error('Failed to delete user row in Supabase:', error);
      }
    }

    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    await supabase.auth.signOut();
    return true;
  } catch (error) {
    console.error('Error during withdrawUser:', error);
    return false;
  }
}
