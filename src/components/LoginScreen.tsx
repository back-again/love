import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  Alert,
  Dimensions
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase, isConfigValid } from '../lib/supabase';

// WebBrowser is required to complete auth session in mobile webviews
WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

// Google Client IDs config (Replace with actual Client IDs in production)
const GOOGLE_WEB_CLIENT_ID = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID = 'YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com';

const isGoogleConfigValid = GOOGLE_WEB_CLIENT_ID !== 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com' && GOOGLE_WEB_CLIENT_ID !== '';

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [recentLoginDetected, setRecentLoginDetected] = useState(false);
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  // Setup Google Sign In Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    // Check if Apple Authentication is available on this platform/device
    AppleAuthentication.isAvailableAsync().then((available) => {
      setIsAppleAuthAvailable(available);
    });

    // Simulated recent login detection
    setRecentLoginDetected(true);
  }, []);

  // Handle Google Sign In response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const idToken = authentication?.idToken;

      if (isConfigValid && isGoogleConfigValid && supabase && idToken) {
        setLoading(true);
        supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        })
          .then(({ data, error }: any) => {
            if (error) throw error;
            const user = data.user;
            onLoginSuccess({
              uid: user.id,
              email: user.email,
              displayName: user.user_metadata?.full_name || '구글 사용자',
              photoURL: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
              lastLogin: new Date().toISOString(),
            });
          })
          .catch((error: any) => {
            console.error("Supabase Google login error:", error);
            Alert.alert("로그인 실패", "구글 계정 인증 중 오류가 발생했습니다: " + error.message);
          })
          .finally(() => setLoading(false));
      } else {
        // If credentials are placeholders or idToken missing, fallback to mock login for testing
        triggerMockLogin('google');
      }
    }
  }, [response]);

  const triggerMockLogin = (provider: 'google' | 'apple') => {
    setLoading(true);
    const mockUid = `${provider}-mock-` + Math.random().toString(36).substring(2, 9);
    const mockUser = {
      uid: mockUid,
      email: `test-${provider}@datingnote.com`,
      displayName: provider === 'google' ? '구글 테스트 사용자' : '애플 테스트 사용자',
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${mockUid}`,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      setLoading(false);
      // Inform user that mock auth is being used
      if (!isConfigValid || !isGoogleConfigValid) {
        Alert.alert(
          "모의 로그인 안내",
          "Supabase 설정 또는 구글 로그인 키 설정이 되지 않아 로컬 테스트용 모의 계정으로 로그인했습니다.",
          [{ text: "확인", onPress: () => onLoginSuccess(mockUser) }]
        );
      } else {
        onLoginSuccess(mockUser);
      }
    }, 600);
  };

  const handleGoogleLogin = () => {
    if (isConfigValid && isGoogleConfigValid && supabase) {
      promptAsync();
    } else {
      triggerMockLogin('google');
    }
  };

  const handleAppleLogin = async () => {
    if (!isAppleAuthAvailable) {
      // Bypasses with mock Apple login on non-iOS environments
      triggerMockLogin('apple');
      return;
    }

    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (isConfigValid && supabase && credential.identityToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });

        if (error) throw error;

        const user = data.user;
        onLoginSuccess({
          uid: user.id,
          email: user.email,
          displayName: user.user_metadata?.full_name || credential.fullName?.givenName || '애플 사용자',
          photoURL: user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.id}`,
          lastLogin: new Date().toISOString(),
        });
      } else {
        // Fallback mockup profile using real details retrieved from iOS authentications
        onLoginSuccess({
          uid: 'apple-mock-' + credential.user,
          email: credential.email || 'test-apple@apple.com',
          displayName: credential.fullName?.givenName || '애플 테스트 사용자',
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${credential.user}`,
          lastLogin: new Date().toISOString(),
        });
      }
    } catch (e: any) {
      if (e.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple Sign In cancelled by user');
      } else {
        console.error('Apple Sign In Error:', e);
        Alert.alert('애플 로그인 오류', e.message);
      }
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>test</Text>
      {/* Content Wrapper (Stretching to fit viewport, aligning frames with exactly 108px gap) */}
      <View style={styles.contentWrapper}>
        
        {/* Top Section: Logo & Branding Frame */}
        <View style={styles.topSection}>
          {/* Logo Image (exactly 122x122) */}
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />

          {/* Brand Name */}
          <Text style={styles.brandName}>집단지성 오답노트</Text>

          {/* Slogan Description (18px, leading 26px, black, normal weight) */}
          <Text style={styles.slogan}>
            정답은 없어도 오답은 있다{"\n"}
            건강한 연애를 위한 집단 연애 지성
          </Text>
        </View>

        {/* Bottom Section: Buttons & Notices Frame (No top padding/margin) */}
        <View style={styles.bottomSection}>
          
          {/* Tooltip Badge: "최근에 로그인했어요" */}
          {recentLoginDetected && (
            <View style={styles.tooltipContainer}>
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>최근에 로그인했어요</Text>
                {/* Micro downwards arrow pointer */}
                <View style={styles.tooltipArrow} />
              </View>
            </View>
          )}

          {/* Google Login Button */}
          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {/* Google Logo SVG */}
            <Svg style={styles.buttonIcon} viewBox="0 0 24 24" width={20} height={20}>
              <Path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <Path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <Path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                fill="#FBBC05"
              />
              <Path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </Svg>
            <Text style={styles.googleButtonText}>Google로 로그인</Text>
          </TouchableOpacity>

          {/* Apple Login Button */}
          <TouchableOpacity 
            style={styles.appleButton} 
            onPress={handleAppleLogin}
            disabled={loading}
            activeOpacity={0.9}
          >
            {/* Apple Logo SVG */}
            <Svg style={styles.buttonIcon} viewBox="0 0 24 24" width={20} height={20}>
              <Path 
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.17.67-2.88 1.48-.61.69-1.15 1.84-1.01 2.96 1.12.09 2.23-.55 2.9-1.38z" 
                fill="#ffffff"
              />
            </Svg>
            <Text style={styles.appleButtonText}>Apple로 로그인</Text>
          </TouchableOpacity>

          {/* Terms footer (Styled exactly: 14px size, mt-20px) */}
          <Text style={styles.termsText}>
            본 서비스는 만 14세 이상만 회원가입이 가능합니다.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 108,
    width: '100%',
    maxWidth: 450,
  },
  topSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 122,
    height: 122,
  },
  brandName: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 24,
    letterSpacing: -0.5,
    color: '#FF8E7A',
  },
  slogan: {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  bottomSection: {
    width: '100%',
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    top: -46,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 30,
  },
  tooltip: {
    backgroundColor: '#FF8E7A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#FF8E7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  tooltipText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderLeftColor: 'transparent',
    borderRightWidth: 5,
    borderRightColor: 'transparent',
    borderTopWidth: 5,
    borderTopColor: '#FF8E7A',
  },
  googleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 12,
  },
  buttonIcon: {
    marginRight: 4,
  },
  googleButtonText: {
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: 15,
  },
  appleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  appleButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 0,
  },
});
