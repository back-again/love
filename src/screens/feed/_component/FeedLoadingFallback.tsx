import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface FeedLoadingFallbackProps {
  feedPageHeight?: number;
}

export function FeedLoadingFallback({ feedPageHeight }: FeedLoadingFallbackProps) {
  return (
    <View style={[styles.fallbackContainer, feedPageHeight ? { height: feedPageHeight } : null]}>
      <ActivityIndicator size="large" color="#FF8E7A" />
      <Text style={styles.loadingText}>피드를 불러오는 중입니다...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9C9C9C',
    fontWeight: '500',
  },
});
