'use client';

import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useDetailStore } from '../_state/useDetailStore';
import { getPostDetailLib } from '../_lib/getPostDetail.lib';
import { DetailFeedContentArea } from '../_area/DetailFeedContent.area';
import { DetailCommentListArea } from '../_area/DetailCommentList.area';

export function DetailViewHandler() {
  const postId = useDetailStore(state => state.postId);

  const {
    data: detailData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['postDetail', postId],
    queryFn: () => getPostDetailLib(postId || ''),
    enabled: Boolean(postId),
  });

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF5D7B" />
        <Text style={styles.loadingText}>사연을 불러오는 중...</Text>
      </View>
    );
  }

  if (isError || !detailData || !detailData.post) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>사연을 찾을 수 없습니다</Text>
        <Text style={styles.errorSub}>삭제되었거나 존재하지 않는 게시글입니다.</Text>
      </View>
    );
  }

  const { post, myVote } = detailData;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* 1. Feed / Post details area */}
      <DetailFeedContentArea post={post} myVote={myVote} />

      {/* 2. Section divider */}
      <View style={styles.sectionDivider} />

      {/* 3. Comments list area */}
      <DetailCommentListArea postAuthorId={post.userId} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  errorSub: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
});
