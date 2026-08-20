'use client';

import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useInView } from 'react-intersection-observer';
import { useFeedList } from '../../_state/useFeedList';

interface InViewSentinelActionProps {
  rootMargin?: string;
}

export function InViewSentinelAction({
  rootMargin = '200px',
}: InViewSentinelActionProps = {}) {
  const { loadMore } = useFeedList();

  if (Platform.OS === 'web') {
    const { ref, inView } = useInView({
      rootMargin,
      triggerOnce: false,
    });

    useEffect(() => {
      if (inView) {
        loadMore();
      }
    }, [inView, loadMore]);

    return <View ref={ref as any} style={styles.sentinel} />;
  }

  return (
    <View
      style={styles.sentinel}
      onLayout={() => {
        loadMore();
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
