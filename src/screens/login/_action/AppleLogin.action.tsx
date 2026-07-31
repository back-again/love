'use client';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import AppleIcon from '../_comeponent/AppleIcon';
import { useApple } from '../_state/useApple';
import { User } from '@/types/database.types';

interface AppleLoginActionProps {
  onSuccess?: (user: User) => void;
}

export function AppleLoginAction({ onSuccess }: AppleLoginActionProps) {
  const { signInWithApple, isPending } = useApple(onSuccess);

  return (
    <TouchableOpacity
      style={styles.appleButton}
      onPress={() => signInWithApple()}
      disabled={isPending}
      activeOpacity={0.8}
    >
      {isPending ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <>
          <AppleIcon />
          <Text style={styles.appleButtonText}>Apple로 로그인</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  appleButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#000000',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  appleButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
});
