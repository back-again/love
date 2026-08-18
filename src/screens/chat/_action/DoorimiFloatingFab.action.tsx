'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useToastStore } from '@/_state/useToastStore';

export function DoorimiFloatingFabAction() {
  const showToast = useToastStore(state => state.showToast);

  const handlePress = () => {
    showToast('출시 준비 중입니다. 🚀');
  };

  return (
    <TouchableOpacity
      style={styles.floatingDoorimiFab}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {/* Top Speech Bubble Badge */}
      <View style={styles.fabSpeechBubbleWrap}>
        <View style={styles.fabSpeechBubble}>
          <Text style={styles.fabSpeechBubbleText}>상담해두림</Text>
        </View>
        <View style={styles.fabSpeechTail} />
      </View>

      {/* Bottom Large Avatar Image */}
      <Image
        source={require('../../../assets/counselor_momo.png')}
        style={styles.fabDirectAvatarImg}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingDoorimiFab: {
    position: 'absolute',
    bottom: 94,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  fabSpeechBubbleWrap: {
    alignItems: 'center',
    marginBottom: -4,
    zIndex: 2,
  },
  fabSpeechBubble: {
    backgroundColor: '#FF5D7B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fabSpeechBubbleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  fabSpeechTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF5D7B',
    marginTop: -1,
  },
  fabDirectAvatarImg: {
    width: 76,
    height: 76,
  },
});
