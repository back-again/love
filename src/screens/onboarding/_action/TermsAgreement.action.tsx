'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useShallow } from 'zustand/react/shallow';
import { useOnboardingForm } from '../_state/useOnboardingForm';

interface TermsAgreementActionProps {
  onOpenTerms?: () => void;
  onOpenPrivacy?: () => void;
}

export function TermsAgreementAction({
  onOpenTerms,
  onOpenPrivacy,
}: TermsAgreementActionProps) {
  const { termsAgreed, toggleTermsAgreed } = useOnboardingForm(
    useShallow((state) => ({
      termsAgreed: state.termsAgreed,
      toggleTermsAgreed: state.toggleTermsAgreed,
    }))
  );

  return (
    <View style={styles.termsRow}>
      <TouchableOpacity
        style={[styles.checkbox, termsAgreed && styles.checkboxChecked]}
        onPress={toggleTermsAgreed}
        activeOpacity={0.8}
      >
        {termsAgreed && (
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 6L9 17l-5-5"
              stroke="#FFFFFF"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        )}
      </TouchableOpacity>

      <View style={styles.termsTextContainer}>
        <Text style={styles.termsTitle}>[필수] 만 14세 이상 서비스 동의</Text>
        <Text style={styles.termsDescription}>
          본인은 만 14세 이상이며,{' '}
          <Text style={styles.underline} onPress={onOpenTerms}>
            이용약관
          </Text>{' '}
          및{' '}
          <Text style={styles.underline} onPress={onOpenPrivacy}>
            개인정보 처리방침
          </Text>
          에 동의합니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FF8E7A',
    borderColor: '#FF8E7A',
  },
  termsTextContainer: {
    flex: 1,
    gap: 4,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  termsDescription: {
    fontSize: 16,
    color: '#9C9C9C',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#9C9C9C',
  },
});
