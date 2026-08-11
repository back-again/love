'use client';

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, Animated, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useToastStore } from '@/_state/useToastStore';

export function ToastProvider() {
  const { visible, message, hideToast } = useToastStore(
    useShallow(state => ({
      visible: state.visible,
      message: state.message,
      hideToast: state.hideToast,
    })),
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 20,
            duration: 250,
            useNativeDriver: true,
          }),
        ]).start(() => {
          hideToast();
        });
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, message, hideToast, opacity, translateY]);

  if (!visible) return null;

  return (
    <View style={styles.containerPointerEventsNone} pointerEvents="none">
      <Animated.View
        style={[
          styles.toastCard,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <Text style={styles.toastText}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPointerEventsNone: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999999,
    elevation: 999999,
  },
  toastCard: {
    backgroundColor: '#F9758D',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
