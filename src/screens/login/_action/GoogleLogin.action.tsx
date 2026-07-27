'use client';

import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import GoogleIcon from '@/screens/login/_comeponent/GoogleIcon';
import { useGoogle } from '@/screens/login/_state/useGoogle';
import { useExpoGoogle } from '@/screens/login/_state/useExpoGoogle';

interface GoogleLoginActionProps {
  onSuccess?: (user: any) => void;
}

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function GoogleLoginAction({
  onSuccess,
}: GoogleLoginActionProps) {
  const { signInWithGoogle, isPending: isNativePending } = useGoogle(onSuccess);
  const { signInWithExpoGoogle, isPending: isExpoPending } =
    useExpoGoogle(onSuccess);

  const handlePress = () => {
    if (isExpoGo) {
      signInWithExpoGoogle();
    } else {
      signInWithGoogle();
    }
  };

  const isPending = isExpoGo ? isExpoPending : isNativePending;

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={handlePress}
      disabled={isPending}
      activeOpacity={0.8}
    >
      <GoogleIcon />
      <Text style={styles.googleButtonText}>Google로 로그인</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#EBEBEB',
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
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#1e293b',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
