import { Alert, Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from '@/api/supabase';
import { User } from '@/types/database.types';

export function useApple(onSuccess?: (user: User) => void) {
  const { mutate: signInWithApple, isPending } = useMutation({
    mutationFn: async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        if (Platform.OS === 'web') {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'apple',
          });
          if (error) throw error;
          return null;
        }
        throw new Error('이 기기에서는 Apple 로그인을 지원하지 않습니다.');
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple identity token을 받아오지 못했습니다.');
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

      if (sessionError) throw sessionError;

      if (sessionData?.user) {
        const u = sessionData.user;
        let { data: dbUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', u.id)
          .single();

        if (!dbUser) {
          const { data: newDbUser } = await supabase
            .from('users')
            .upsert({
              id: u.id,
              email: u.email || '',
              provider: 'apple',
            })
            .select()
            .single();
          dbUser = newDbUser;
        }

        if (dbUser) {
          onSuccess?.(dbUser);
          return dbUser;
        }
      }
      return null;
    },
    onError: (e: any) => {
      if (
        e?.code === 'ERR_REQUEST_CANCELED' ||
        e?.code === 'ERR_CANCELED' ||
        e?.message?.includes('canceled')
      ) {
        return;
      }
      console.error('Apple Sign In Error:', e?.message || e);
      Alert.alert(
        'Apple 로그인 오류',
        e?.message || 'Apple 로그인 중 오류가 발생했습니다.',
      );
    },
  });

  return { signInWithApple, isPending };
}
