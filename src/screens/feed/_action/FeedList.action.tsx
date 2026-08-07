'use client';

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useLoad } from '../_state/useLoad';
import { useFeed } from '../_state/useFeed';
import { FeedItem } from '../_component/FeedItem';
import CommentBottomSheet, { VoteInfo } from '@/components/CommentBottomSheet';
import { PostDetailModal } from '@/components/PostDetailModal';
import ReviewBottomSheet from '@/components/ReviewBottomSheet';
import { ImageModal } from '@/components/modal/ImageModal';

const CATEGORIES = ['전체', '인기🔥', '연애/썸💕', '이별/재회💔', '일상/고민💬'];

export function FeedListAction() {
  const { feedPageHeight } = useLoad();
  const { posts, loadMore, prefetchNextPage } = useFeed();

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [activeDetailPost, setActiveDetailPost] = useState<any | null>(null);
  const [activeCommentPostTitle, setActiveCommentPostTitle] = useState<string | null>(null);
  const [activeVoteInfo, setActiveVoteInfo] = useState<VoteInfo | undefined>(undefined);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const [imageModal, setImageModal] = useState<{
    visible: boolean;
    images: string[];
    initialIndex: number;
  }>({
    visible: false,
    images: [],
    initialIndex: 0,
  });

  const handleOpenImageModal = useCallback(
    (images: string[]) => (index: number) => {
      setImageModal({
        visible: true,
        images,
        initialIndex: index,
      });
    },
    [],
  );

  const handleCloseImageModal = useCallback(() => {
    setImageModal(prev => ({ ...prev, visible: false }));
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - feedPageHeight * 1.5;

    if (isCloseToBottom) {
      prefetchNextPage();
      loadMore();
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Top Horizontal Category Chips Bar */}
      <View style={styles.categoryBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    isSelected && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. Continuous Scroll Community List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.communityListContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={32}
        onScroll={handleScroll}
      >
        {/* Section Header Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>🔥 실시간 고민 TOP</Text>
        </View>

        {posts.map(post => (
          <FeedItem
            key={post.id}
            post={post}
            pageHeight={feedPageHeight}
            onOpenImageModal={handleOpenImageModal(post.images)}
            onOpenComments={() => {
              setActiveDetailPost(post);
            }}
            onOpenViewReview={() => setIsReviewModalVisible(true)}
          />
        ))}
      </ScrollView>

      <ImageModal
        visible={imageModal.visible}
        images={imageModal.images}
        initialIndex={imageModal.initialIndex}
        onClose={handleCloseImageModal}
      />

      <PostDetailModal
        visible={!!activeDetailPost}
        post={activeDetailPost}
        onClose={() => setActiveDetailPost(null)}
        onOpenVoteResults={(title, voteInfo) => {
          setActiveCommentPostTitle(title);
          setActiveVoteInfo(voteInfo);
        }}
      />

      <CommentBottomSheet
        visible={!!activeCommentPostTitle}
        onClose={() => {
          setActiveCommentPostTitle(null);
          setActiveVoteInfo(undefined);
        }}
        postTitle={activeCommentPostTitle || ''}
        voteInfo={activeVoteInfo}
      />

      <ReviewBottomSheet
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  categoryBarContainer: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryScrollContent: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#FF4D7B',
    borderColor: '#FF4D7B',
    shadowColor: '#FF4D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  communityListContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 110,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  sectionHeaderRow: {
    width: '100%',
    paddingVertical: 12,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
});

