'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserStore } from '@/_state/useUserStore';
import { WrittenPostCard, WrittenPost } from '../_component/WrittenPostCard';
import { getWrittenPosts } from '../_lib/getWrittenPosts.lib';
import { useReviewModalStore, ReviewMode } from '@/screens/review/_state/useReviewModalStore';
import { usePostOptionsStore } from '@/screens/postOptions/_state/usePostOptionsStore';
import { useDetailStore } from '@/screens/detail/_state/useDetailStore';
import { navigationRef } from '@/_lib/navigation';

export function WrittenPostListAction() {
  const user = useUserStore(state => state.user);
  const userId = user?.id;

  const { data: writtenPosts } = useSuspenseQuery({
    queryKey: ['writtenPosts', userId],
    queryFn: () => getWrittenPosts({ userId }),
  });

  const openReviewModal = useReviewModalStore(state => state.openReviewModal);
  const openDetail = useDetailStore(state => state.openDetail);
  const openPostOptions = usePostOptionsStore(state => state.openPostOptions);

  const handleOpenReview = (mode: ReviewMode) => (post: WrittenPost) => {
    openReviewModal({
      mode,
      reviewText: post.reviewContent,
      postId: post.id,
    });
  };

  if (writtenPosts.length === 0)
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>아직 작성한 글이 없어요</Text>
        <Text style={styles.emptySubtitle}>
          혼자만 끙끙 앓던 고민{'\n'}유저들의 의견으로 도움을 받아보세요
        </Text>
        <TouchableOpacity
          style={styles.emptyBtnWrapper}
          onPress={() => {
            if (navigationRef.isReady()) {
              navigationRef.navigate('Create');
            }
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF5D7B', '#FE92AC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyBtnGradient}
          >
            <Text style={styles.emptyBtnText}>글 작성하기 &gt;</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );

  return (
    <>
      {writtenPosts.map((post: WrittenPost) => (
        <WrittenPostCard
          key={post.id}
          post={post}
          onPress={p => openDetail(p.id)}
          onOpenViewReview={handleOpenReview('view')}
          onOpenWriteReview={handleOpenReview('write')}
          onOpenOptions={targetPost => {
            openPostOptions({
              id: targetPost.id,
              userId: userId || '',
              category: '고민',
              title: targetPost.title || '',
              content: targetPost.title || '',
              images: [],
              voteO: '',
              voteX: '',
              commentCount: 0,
              voteOCount: targetPost.voteO || 0,
              voteXCount: targetPost.voteX || 0,
              reviewContent: targetPost.reviewContent,
              hasReview: targetPost.hasReview,
              createdAt: targetPost.created_at || new Date().toISOString(),
            });
          }}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    width: '100%',
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emptyIllustrationWrap: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#727272',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  emptyBtnWrapper: {
    alignSelf: 'center',
  },
  emptyBtnGradient: {
    paddingHorizontal: 24,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
