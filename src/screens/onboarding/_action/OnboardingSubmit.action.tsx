'use client';

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/_state/useUserStore';
import { useOnboardingForm } from '../_state/useOnboardingForm';
import {
  isFormComplete,
  getBirthYearErrorMessage,
  getDatingDateErrorMessage,
} from '../_model/onboardingValidation';
import { updateOnboardingProfile } from '../_lib/updateOnboardingProfile.lib';

export function OnboardingSubmitAction() {
  const { user, setUser } = useUserStore();
  const { gender, birthYear, datingStartedAt, notificationAllowed, termsAgreed } =
    useOnboardingForm(
      useShallow(state => ({
        gender: state.gender,
        birthYear: state.birthYear,
        datingStartedAt: state.datingStartedAt,
        notificationAllowed: state.notificationAllowed,
        termsAgreed: state.termsAgreed,
      })),
    );

  const isComplete = isFormComplete(birthYear, datingStartedAt, termsAgreed);

  const handlePress = async () => {
    if (!gender) {
      Alert.alert('안내', '성별을 선택해 주세요.');
      return;
    }
    if (!birthYear) {
      Alert.alert('안내', '출생년도를 입력해 주세요.');
      return;
    }
    const birthYearErr = getBirthYearErrorMessage(birthYear);
    if (birthYearErr) {
      Alert.alert('안내', birthYearErr);
      return;
    }
    if (!datingStartedAt) {
      Alert.alert('안내', '연애 시작일을 입력해 주세요.');
      return;
    }
    const datingDateErr = getDatingDateErrorMessage(datingStartedAt, birthYear);
    if (datingDateErr) {
      Alert.alert('안내', datingDateErr);
      return;
    }
    if (!termsAgreed) {
      Alert.alert('안내', '필수 동의 항목에 동의해 주세요.');
      return;
    }

    console.log(user, gender, birthYear, datingStartedAt);

    try {
      if (user?.id) {
        const updatedDbUser = await updateOnboardingProfile({
          userId: user.id,
          gender,
          birthYear,
          datingStartedAt,
          notificationAllowed,
        });

        if (updatedDbUser) {
          setUser(updatedDbUser);

          await AsyncStorage.setItem(
            '@user_session',
            JSON.stringify(updatedDbUser),
          );
        }
      }
    } catch (err: any) {
      console.error('Onboarding Submit Error:', err);
      Alert.alert('오류', '프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity
        style={[styles.startButton, isComplete && styles.startButtonActive]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.startButtonText,
            isComplete && styles.startButtonTextActive,
          ]}
        >
          시작하기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    width: '100%',
    marginTop: 40,
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 0,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9C9C9C',
    letterSpacing: -0.3,
  },
  startButtonActive: {
    backgroundColor: '#FF5D7B',
    borderWidth: 0,
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  startButtonTextActive: {
    color: '#FFFFFF',
  },
});
