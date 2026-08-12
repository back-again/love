'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useUserStore } from '@/_state/useUserStore';

export function AccountInfoAction() {
  const user = useUserStore((state) => state.user);
  const userEmail = user?.email || 'asdf1234@kakao.com';

  return (
    <View style={styles.settingBox}>
      <Text style={styles.settingLabel}>연동 계정</Text>
      <Text style={styles.settingVal}>{userEmail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  settingBox: {
    width: '100%',
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 15,
    color: '#8F8F8F',
  },
  settingVal: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
});
