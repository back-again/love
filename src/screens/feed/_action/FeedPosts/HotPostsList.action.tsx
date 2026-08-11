'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FeedItem } from '../../_component/FeedItem';
import { useFeed } from '../../_state/useFeed';
import { useCategoryStore } from '../../_state/useCategoryStore';

export function HotPostsListAction() {
  const selectedCategory = useCategoryStore(state => state.selectedCategory);
  const { posts, hasNextPage, loadMore } = useFeed('hot', 3);

  if (selectedCategory !== '전체' || !posts || posts.length === 0) return null;

  return (
    <View style={styles.hotSectionContainer}>
      <View style={styles.hotSectionHeader}>
        <View style={styles.hotTitleRow}>
          <Text style={styles.hotSectionTitle}>🔥 가장 핫한 고민</Text>
        </View>
        <Text style={styles.hotSectionSub}>가장 많은 의견이 모이고 있어요</Text>
      </View>

      {posts.map(post => (
        <FeedItem key={`hot_${post.id}`} post={{ ...post, isHot: true }} />
      ))}

      {hasNextPage && (
        <TouchableOpacity
          style={styles.seeMoreHotButton}
          onPress={() => loadMore()}
          activeOpacity={0.8}
        >
          <Text style={styles.seeMoreHotButtonText}>더보기 ∨</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hotSectionContainer: {
    width: '100%',
    marginBottom: 16,
    paddingTop: 8,
  },
  hotSectionHeader: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  hotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hotSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF5D7B',
  },
  hotSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    marginTop: 4,
  },
  seeMoreHotButton: {
    width: '100%',
    height: 46,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEB5C9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  seeMoreHotButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5D7B',
  },
});
