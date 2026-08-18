import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { CategoryHeaderAction } from '../_action/CategoryHeader/CategoryHeader.action';

export function CategoryHeaderArea() {
  return (
    <View style={styles.categoryBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <CategoryHeaderAction />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryBarContainer: {
    width: '100%',
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  scrollView: {
    width: '100%',
  },
  categoryScrollContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
