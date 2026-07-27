import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { User } from '@/types/database.types';
import { supabase } from '@/api/supabase';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

export function useExpoGoogle(onSuccess?: (user: User) => void) {
  const { mutate: signInWithExpoGoogle, isPending } = useMutation({
    mutationFn: async () => {
      let { data: dbUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', TEST_USER_ID)
        .single();

      const userProfile: User = dbUser || {
        id: TEST_USER_ID,
        email: 'expo-test@datingnote.com',
        provider: 'google',
        created_at: new Date().toISOString(),
      };

      Alert.alert(
        'Expo Go 모의 로그인',
        'Supabase DB와 연동된 Expo Go 테스트 계정으로 로그인합니다.',
      );

      onSuccess?.(userProfile);

      return userProfile;
    },
    onError: (e: any) => {
      console.error('Expo Google Sign In Error:', e?.message || e);
    },
  });

  return { signInWithExpoGoogle, isPending };
}
