'use client';

import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Alert,
} from 'react-native';
import { useUserStore } from '@/_state/useUserStore';
import { useSettingStore } from '../_state/useSettingStore';
import { withdrawUser } from '../_lib/withdrawUser.lib';

export function WithdrawAction() {
  const { user, clearUser } = useUserStore();
  const resetSetting = useSettingStore((state) => state.reset);

  const handleWithdraw = async () => {
    const confirmWithdraw = async () => {
      await withdrawUser({ userId: user?.id });
      clearUser();
      resetSetting();

      if (Platform.OS === 'web') {
        alert('회원 탈퇴가 완료되었습니다.');
      } else {
        Alert.alert('안내', '회원 탈퇴가 완료되었습니다.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
        await confirmWithdraw();
      }
    } else {
      Alert.alert(
        '회원 탈퇴',
        '정말로 회원 탈퇴를 진행하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '탈퇴하기',
            style: 'destructive',
            onPress: confirmWithdraw,
          },
        ],
        { cancelable: true }
      );
    }
  };

  return (
    <TouchableOpacity
      style={styles.withdrawBtn}
      onPress={handleWithdraw}
      activeOpacity={0.7}
    >
      <Text style={styles.withdrawBtnText}>회원 탈퇴</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  withdrawBtn: {
    width: '100%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawBtnText: {
    fontSize: 14,
    color: '#8F8F8F',
    textDecorationLine: 'underline',
  },
});
