import { Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { supabase } from '@/api/supabase';

const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  scopes: ['email', 'profile'],
});

export function useGoogle(onSuccess?: (user: any) => void) {
  const { mutate: signInWithGoogle, isPending } = useMutation({
    mutationFn: async () => {
      await GoogleSignin.hasPlayServices();

      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('구글 인증 토큰(ID Token)을 받지 못했습니다.');
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      const user = data.user;
      const userData = {
        uid: user?.id,
        email: user?.email,
        displayName:
          user?.user_metadata?.full_name ||
          user?.user_metadata?.name ||
          '구글 사용자',
        photoURL:
          user?.user_metadata?.avatar_url ||
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.id}`,
        lastLogin: new Date().toISOString(),
      };

      onSuccess?.(userData);

      return userData;
    },
    onError: (e: any) => {
      console.error('Google Sign In Error:', e?.message || e);
      Alert.alert(
        '구글 로그인 오류',
        e?.message || '구글 로그인 중 오류가 발생했습니다.',
      );
    },
  });

  return { signInWithGoogle, isPending };
}
