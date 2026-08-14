'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatDetailStore } from '../_state/useChatDetailStore';

import { BackChevronSvg } from '../_svg';

export function ChatDetailHeaderArea() {
  const insets = useSafeAreaInsets();
  const leaveChatRoom = useChatDetailStore(state => state.leaveChatRoom);

  const headerTitle = '두림이와 종합 연애상담';

  return (
    <View style={[styles.chatHeaderBar, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={leaveChatRoom}
        activeOpacity={0.7}
      >
        <BackChevronSvg />
      </TouchableOpacity>

      <View style={styles.headerTitleWrap}>
        <Text style={styles.headerTitleText} numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      <View style={styles.placeholderRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  chatHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  placeholderRight: {
    width: 36,
  },
});
