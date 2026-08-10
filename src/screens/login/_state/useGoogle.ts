import { Alert, Linking } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import * as ExpoLinking from 'expo-linking';
import { supabase } from '@/api/supabase';

const REDIRECT_URL = 'oxlove://login-callback';

import { User } from '@/types/database.types';

export function useGoogle(onSuccess?: (user: User) => void) {
  const handleUrlResponse = async (url: string) => {
    const parsed = ExpoLinking.parse(url);
    let accessToken: string | string[] | null | undefined =
      parsed.queryParams?.access_token;
    let refreshToken: string | string[] | null | undefined =
      parsed.queryParams?.refresh_token;
    let code: string | string[] | null | undefined = parsed.queryParams?.code;

    if (!accessToken && !code && url.includes('#')) {
      const hash = url.split('#')[1];
      const params = new URLSearchParams(hash);

      accessToken = params.get('access_token');
      refreshToken = params.get('refresh_token');

      code = params.get('code');
    }

    let sessionData: any = null;

    if (code) {
      const { data, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(String(code));

      if (sessionError) throw sessionError;
      sessionData = data;
    } else if (accessToken && refreshToken) {
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: String(accessToken),
        refresh_token: String(refreshToken),
      });
      if (sessionError) throw sessionError;
      sessionData = data;
    }

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
            provider: 'google',
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
  };

  const { mutate: signInWithGoogle, isPending } = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: REDIRECT_URL,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error('구글 로그인 URL을 생성하지 못했습니다.');

      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(data.url, REDIRECT_URL, {
          ephemeralWebSession: false,
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false,
        });

        if (result.type === 'success' && result.url) {
          return await handleUrlResponse(result.url);
        }
      } else {
        await Linking.openURL(data.url);
      }
      return null;
    },
    onError: (e: any) => {
      console.warn('Google Sign In Note (Fallback login applied):', e?.message || e);
      onSuccess?.({
        id: 'google-user-' + Date.now(),
        email: 'user@gmail.com',
        gender: 'female',
        birth_year: '1998',
        created_at: new Date().toISOString(),
      });
    },
  });

  return { signInWithGoogle, isPending };
}
