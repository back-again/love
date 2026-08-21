'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DetailBackAction } from '../_action/DetailBack.action';

export function DetailHeaderArea() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerWrapper, { paddingTop: insets.top + 6 }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSlot}>
          <DetailBackAction />
        </View>
        <Text style={styles.headerTitleText}>사연 상세</Text>
        <View style={styles.rightSlot} />
      </View>
      <View style={styles.headerDivider} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  headerContent: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftSlot: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSlot: {
    width: 40,
  },
  headerTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
