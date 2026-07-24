import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleLoginAction from '@/screens/login/_action/GoogleLogin.action';

// WebBrowser is required to complete auth session in mobile webviews
WebBrowser.maybeCompleteAuthSession();

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  useEffect(() => {
    // Check if Apple Authentication is available on this platform/device
    AppleAuthentication.isAvailableAsync().then(available => {
      setIsAppleAuthAvailable(available);
    });
  }, []);

  const handleAppleLogin = async () => {
    if (Platform.OS !== 'ios' || !isAppleAuthAvailable) {
      Alert.alert('애플 로그인 안내', 'iOS 기기에서만 애플 로그인을 지원합니다.');
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
      onLoginSuccess({
        uid: 'apple-' + credential.user,
        email: credential.email || 'test-apple@apple.com',
        displayName: credential.fullName?.givenName || '애플 사용자',
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${credential.user}`,
        lastLogin: new Date().toISOString(),
      });
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        console.error('Apple Sign In Error:', e);
        Alert.alert('애플 로그인 오류', e?.message || '애플 로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.contentWrapper}>
      {/* Top Section: Logo & Branding Frame */}
      <View style={styles.topSection}>
        {/* Logo Image (exactly 122x122) */}
        <Image
          source={require('@assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Brand Name (Linear Gradient #FFA1A9 -> #FFC880, Left to Right) */}
        {Platform.OS === 'web' ? (
          <Text style={styles.brandNameWeb}>집단지성 오답노트</Text>
        ) : (
          <MaskedView
            maskElement={
              <Text
                style={[styles.brandName, { backgroundColor: 'transparent' }]}
              >
                집단지성 오답노트
              </Text>
            }
          >
            <LinearGradient
              colors={['#FFA1A9', '#FFC880']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.brandName, { opacity: 0 }]}>
                집단지성 오답노트
              </Text>
            </LinearGradient>
          </MaskedView>
        )}

        {/* Slogan Description (18px, leading 26px, black, normal weight) */}
        <Text style={styles.slogan}>
          정답은 없어도 오답은 있다{'\n'}
          건강한 연애를 위한 집단 연애 지성
        </Text>
      </View>

      {/* Bottom Section: Buttons & Notices Frame (No top padding/margin) */}
      <View style={styles.bottomSection}>
        {/* Google Login Button */}
        <GoogleLoginAction onSuccess={onLoginSuccess} />

        {/* Apple Login Button */}
        <TouchableOpacity
          style={styles.appleButton}
          onPress={handleAppleLogin}
          disabled={loading}
          activeOpacity={0.9}
        >
          {/* Apple Logo SVG */}
          <Svg
            style={styles.buttonIcon}
            viewBox="0 0 24 24"
            width={20}
            height={20}
          >
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
    backgroundColor: '#ffffff',
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
    color: '#FFA1A9',
  },
  brandNameWeb: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 24,
    letterSpacing: -0.5,
    // @ts-ignore
    backgroundImage: 'linear-gradient(to right, #FFA1A9 0%, #FFC880 100%)',
    // @ts-ignore
    WebkitBackgroundClip: 'text',
    // @ts-ignore
    WebkitTextFillColor: 'transparent',
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

  buttonIcon: {
    marginRight: 4,
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
    color: '#9C9C9C',
    marginTop: 0,
  },
});
