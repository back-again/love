import React from 'react';
import { StyleSheet, View } from 'react-native';

export function CategoryHeaderFallback() {
  return (
    <View style={styles.categoryBarContainer}>
      <View style={styles.skeletonChip} />
      <View style={styles.skeletonChip} />
      <View style={styles.skeletonChip} />
      <View style={styles.skeletonChip} />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryBarContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    flexDirection: 'row',
    gap: 8,
  },
  skeletonChip: {
    width: 64,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
});
