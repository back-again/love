'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useCategoryStore } from '../_state/useCategoryStore';
import { HotPostsListAction } from '../_action/FeedPosts/HotPostsList.action';

export function AllCategoryHeaderHandler() {
  return null;
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
