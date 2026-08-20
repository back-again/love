'use client';

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/api/supabase';
import { useUserStore } from '@/_state/useUserStore';

const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
};

interface LogoutActionProps {
  onLogoutSuccess?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function LogoutAction({ onLogoutSuccess, style, textStyle }: LogoutActionProps) {
  const { clearUser } = useUserStore();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
      await supabase.auth.signOut();
      clearUser();
      onLogoutSuccess?.();
    } catch (error) {
      console.error('Failed to clear session from storage:', error);
    }
  };

  return (
    <TouchableOpacity
      style={style || styles.logoutBtn}
      onPress={handleLogout}
      activeOpacity={0.7}
    >
      <Text style={textStyle || styles.logoutBtnText}>로그아웃</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#9C9C9C',
    fontSize: 15,
    fontWeight: '600',
  },
});
