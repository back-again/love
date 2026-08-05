import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Post } from '../_model/feed.model';
import { FeedItem } from '../_component/FeedItem';

interface FeedListActionProps {
  posts: Post[];
  isLoading: boolean;
  feedPageHeight: number;
  onOpenComments: (title: string) => void;
  onOpenViewReview: () => void;
}

export function FeedListAction({
  posts,
  isLoading,
  feedPageHeight,
  onOpenComments,
  onOpenViewReview,
}: FeedListActionProps) {
  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { height: feedPageHeight }]}>
        <ActivityIndicator size="large" color="#FF8E7A" />
        <Text style={styles.loadingText}>피드를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <>
      {posts.map(post => (
        <FeedItem
          key={post.id}
          post={post}
          pageHeight={feedPageHeight}
          onOpenComments={onOpenComments}
          onOpenViewReview={onOpenViewReview}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9C9C9C',
    fontWeight: '500',
  },
});
