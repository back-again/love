'use client';

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useInView } from 'react-intersection-observer';

interface InViewSentinelProps {
  onVisible: () => void;
  rootMargin?: string;
}

export function InViewSentinel({
  onVisible,
  rootMargin = '200px',
}: InViewSentinelProps) {
  if (Platform.OS === 'web') {
    const { ref, inView } = useInView({
      rootMargin,
      triggerOnce: false,
    });

    useEffect(() => {
      if (inView) {
        onVisible();
      }
    }, [inView, onVisible]);

    return <View ref={ref as any} style={styles.sentinel} />;
  }

  return (
    <View
      style={styles.sentinel}
      onLayout={() => {
        onVisible();
      }}
    />
  );
}

const styles = StyleSheet.create({
  sentinel: {
    height: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
