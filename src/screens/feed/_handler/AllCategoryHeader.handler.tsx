'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useCategoryStore } from '../_state/useCategoryStore';
import { HotPostsListAction } from '../_action/FeedPosts/HotPostsList.action';

export function AllCategoryHeaderHandler() {
  const selectedCategory = useCategoryStore(state => state.selectedCategory);

  if (selectedCategory !== '전체') {
    return null;
  }

  return (
    <>
      <HotPostsListAction />
      <View style={styles.generalSectionHeader}>
        <Text style={styles.generalSectionTitle}>⚡️ 실시간 고민</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  generalSectionHeader: {
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  generalSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF5D7B',
  },
});
