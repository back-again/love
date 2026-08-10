import React from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import GoogleLoginAction from '@/screens/login/_action/GoogleLogin.action';
import { AppleLoginAction } from '@/screens/login/_action/AppleLogin.action';

interface LoginScreenProps {
  onLoginSuccess?: (user: any) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  return (
    <View style={styles.contentWrapper}>
      <View style={styles.topSection}>
        <Image
          source={require('@assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

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

        {/* Slogan Description */}
        <Text style={styles.slogan}>
          정답은 없어도 오답은 있다{'\n'}
          건강한 연애를 위한 집단 연애 지성
        </Text>
      </View>

      {/* Bottom Section: Buttons & Notices */}
      <View style={styles.bottomSection}>
        {/* Google Login Button */}
        <GoogleLoginAction onSuccess={onLoginSuccess} />

        {/* Apple Login Button */}
        <AppleLoginAction onSuccess={onLoginSuccess} />

        {/* Terms footer */}
        <Text style={styles.termsText}>
          본 서비스는 만 14세 이상만 회원가입이 가능합니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 122,
    height: 122,
    marginBottom: 24,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  brandNameWeb: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
    color: '#FF8E7A',
  },
  slogan: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    letterSpacing: -0.3,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
  },
});
