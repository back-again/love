import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
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
          source={require('@assets/xoxo_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>
          건강한 연애를 위한{'\n'}연애 커뮤니티
        </Text>
      </View>

      {/* Staggered Chat Bubbles Section */}
      <View style={styles.bubbleSection}>
        <View style={styles.bubbleContainer}>
          <View style={[styles.bubbleQuestion, styles.bubbleCommon]}>
            <Text style={styles.bubbleText}>...내가 예민한걸까?</Text>
          </View>
        </View>

        <View style={styles.bubbleContainer}>
          <View style={[styles.bubbleO, styles.bubbleCommon]}>
            <Text style={styles.bubbleText}>
              <Text style={styles.purpleText}>O</Text> 그 정도는 봐줄 수 있지
            </Text>
          </View>
        </View>

        <View style={styles.bubbleContainer}>
          <View style={[styles.bubbleX, styles.bubbleCommon]}>
            <Text style={styles.bubbleText}>
              <Text style={styles.pinkText}>X</Text> 나같아도 서운해
            </Text>
          </View>
        </View>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 72,
    marginBottom: 48,
  },
  subLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  logo: {
    width: 280,
    height: 100,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: '#0F172A',
    lineHeight: 36,
    letterSpacing: -0.5,
    marginTop: 24,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 48,
  },
  termsText: {
    fontSize: 13,
    color: '#8F8F8F',
    textAlign: 'center',
    marginTop: 16,
  },
  purpleText: {
    color: '#8B75F9',
    fontWeight: '800',
  },
  pinkText: {
    color: '#FF5D7B',
    fontWeight: '800',
  },
  bubbleCommon: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1.5,
  },
  bubbleSection: {
    width: '100%',
    marginVertical: 28,
    gap: 16,
  },
  bubbleContainer: {
    width: '100%',
  },
  bubbleQuestion: {
    alignSelf: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderTopLeftRadius: 4,
    maxWidth: '85%',
  },
  bubbleO: {
    alignSelf: 'flex-end',
    backgroundColor: '#F5F1FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderTopRightRadius: 4,
    maxWidth: '85%',
  },
  bubbleX: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFF3F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderTopRightRadius: 4,
    maxWidth: '85%',
  },
  bubbleText: {
    fontSize: 15.5,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: -0.3,
  },
});
