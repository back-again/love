'use client';

import React, { useState, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useLoad } from '../_state/useLoad';
import { useFeed } from '../_state/useFeed';
import { FeedItem } from '../_component/FeedItem';
import CommentBottomSheet, { VoteInfo } from '@/components/CommentBottomSheet';
import { PostDetailModal } from '@/components/PostDetailModal';
import ReviewBottomSheet from '@/components/ReviewBottomSheet';
import { ImageModal } from '@/components/modal/ImageModal';
import { PostOptionsBottomSheet } from '@/components/modal/PostOptionsBottomSheet';
import { ToastMessage } from '@/components/modal/ToastMessage';
import { Post } from '../_model/feed.model';

const CATEGORIES = ['전체', '연애/썸', '이별/재회', '19/관계', '일상/고민'];

interface FeedListActionProps {
  onGoToCreate?: () => void;
}

export function FeedListAction({ onGoToCreate }: FeedListActionProps) {
  const { feedPageHeight } = useLoad();
  const { posts, loadMore, prefetchNextPage } = useFeed();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [isHotExpanded, setIsHotExpanded] = useState(false);
  const [activeCommentPostTitle, setActiveCommentPostTitle] = useState<string | null>(null);
  const [activeVoteInfo, setActiveVoteInfo] = useState<VoteInfo | undefined>(undefined);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const [optionsPost, setOptionsPost] = useState<Post | null>(null);
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

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

  const handleScrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

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

  // Exclude deleted posts
  const activePosts = posts.filter(post => !deletedPostIds.includes(post.id));

  // Filter posts based on active category selection
  const filteredPosts = activePosts.filter(post => {
    if (selectedCategory === '전체') return true;
    if (selectedCategory === '연애/썸') return post.category === '연애' || post.category === '연애/썸';
    if (selectedCategory === '이별/재회') return post.category === '이별' || post.category === '이별/재회';
    if (selectedCategory === '19/관계') return post.category === '19' || post.category === '19/관계';
    if (selectedCategory === '일상/고민') return post.category === '일상' || post.category === '일상/고민';
    return true;
  });

  const allHotPosts = activePosts.slice(0, 5);
  const displayedHotPosts = isHotExpanded ? allHotPosts : allHotPosts.slice(0, 3);
  const generalPosts = selectedCategory === '전체'
    ? activePosts.slice(displayedHotPosts.length)
    : filteredPosts;

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
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.communityListContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={32}
        onScroll={handleScroll}
      >
        {/* Popular Posts Vertical Section for '전체' Category */}
        {selectedCategory === '전체' && (
          <View style={styles.hotSectionContainer}>
            <View style={styles.hotSectionHeader}>
              <View style={styles.hotTitleRow}>
                <Text style={styles.hotSectionTitle}>🔥 가장 핫한 고민</Text>
              </View>
              <Text style={styles.hotSectionSub}>가장 많은 의견이 모이고 있어요</Text>
            </View>

            {/* Render Popular Posts vertically using exact same FeedItem UI with HOT badge */}
            {displayedHotPosts.map(post => (
              <FeedItem
                key={`hot_${post.id}`}
                post={{ ...post, isHot: true }}
                pageHeight={feedPageHeight}
                onOpenImageModal={handleOpenImageModal(post.images)}
                onOpenComments={(title, voteInfo) => {
                  setActiveCommentPostTitle(title);
                  setActiveVoteInfo(voteInfo);
                }}
                onOpenViewReview={() => setIsReviewModalVisible(true)}
                onOpenOptions={(targetPost) => setOptionsPost(targetPost)}
                onRequireVoteToast={() => showToast('💡 소신 있는 투표를 위해, 투표 후 댓글이 열려요!')}
              />
            ))}

            {/* See More (더보기) button */}
            {!isHotExpanded && allHotPosts.length > 3 && (
              <TouchableOpacity
                style={styles.seeMoreHotButton}
                onPress={() => setIsHotExpanded(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.seeMoreHotButtonText}>더보기 ∨</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* General Feed Section Header */}
        {selectedCategory === '전체' && (
          <View style={styles.generalSectionHeader}>
            <Text style={styles.generalSectionTitle}>⚡️ 실시간 고민</Text>
          </View>
        )}

        {/* General Posts List */}
        {generalPosts.map(post => (
          <FeedItem
            key={post.id}
            post={post}
            pageHeight={feedPageHeight}
            onOpenImageModal={handleOpenImageModal(post.images)}
            onOpenComments={(title, voteInfo) => {
              setActiveCommentPostTitle(title);
              setActiveVoteInfo(voteInfo);
            }}
            onOpenViewReview={() => setIsReviewModalVisible(true)}
            onOpenOptions={(targetPost) => setOptionsPost(targetPost)}
            onRequireVoteToast={() => showToast('💡 소신 있는 투표를 위해, 투표 후 댓글이 열려요!')}
          />
        ))}
      </ScrollView>

      {/* Floating Action Button (Create Floating Plus button) */}
      {onGoToCreate && (
        <View style={styles.floatingButtonColumn}>
          <TouchableOpacity
            style={styles.floatingPlusButton}
            onPress={onGoToCreate}
            activeOpacity={0.85}
          >
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 5v14M5 12h14"
                stroke="#FFFFFF"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      )}

      <ImageModal
        visible={imageModal.visible}
        images={imageModal.images}
        initialIndex={imageModal.initialIndex}
        onClose={handleCloseImageModal}
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

      {/* Three Dots Post Options Bottom Sheet (Edit/Delete for Author, Block/Report for Viewer) */}
      <PostOptionsBottomSheet
        visible={!!optionsPost}
        onClose={() => setOptionsPost(null)}
        isMyPost={optionsPost?.id === activePosts[0]?.id || optionsPost?.isMyPost === true}
        onEdit={() => {
          if (onGoToCreate) onGoToCreate();
        }}
        onDelete={() => {
          if (optionsPost) {
            setDeletedPostIds(prev => [...prev, optionsPost.id]);
            showToast('게시글이 삭제되었습니다.');
          }
        }}
        onBlock={() => {
          showToast('해당 사용자가 차단되었습니다.');
        }}
        onReport={() => {
          showToast('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
        }}
      />

      {/* Toast Notification Popup */}
      <ToastMessage
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
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
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F5F5F5',
  },
  categoryChipActive: {
    backgroundColor: '#FFF8F8',
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#727272',
  },
  categoryChipTextActive: {
    color: '#FF5D7B',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  communityListContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 110,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  floatingButtonColumn: {
    position: 'absolute',
    right: 20,
    bottom: 96,
    alignItems: 'center',
    gap: 12,
    zIndex: 99,
  },
  scrollTopButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  floatingPlusButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F9758D',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F9758D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
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
  hotLiveBadge: {
    backgroundColor: '#FF5D7B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hotLiveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
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
