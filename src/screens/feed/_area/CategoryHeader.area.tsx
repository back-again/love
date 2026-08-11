import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { CategoryHeaderAction } from '../_action/CategoryHeader/CategoryHeader.action';

export function CategoryHeaderArea() {
  return (
    <View style={styles.categoryBarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  categoryScrollContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingRight: 16,
  },
});
