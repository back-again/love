'use client';

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useLoad } from '../_state/useLoad';
import { useFeed } from '../_state/useFeed';
import { FeedItem } from '../_component/FeedItem';
import { ImageModal } from '@/components/modal/ImageModal';

export function FeedListAction() {
  const { feedPageHeight } = useLoad();
  const { posts, loadMore, prefetchNextPage } = useFeed();

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
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.snapScrollContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled={true}
        snapToInterval={feedPageHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        scrollEventThrottle={32}
        onScroll={handleScroll}
      >
        {posts.map(post => (
          <FeedItem
            key={post.id}
            post={post}
            pageHeight={feedPageHeight}
            onOpenImageModal={handleOpenImageModal(post.images)}
            onOpenComments={() => {}}
            onOpenViewReview={() => {}}
          />
        ))}
      </ScrollView>

      <ImageModal
        visible={imageModal.visible}
        images={imageModal.images}
        initialIndex={imageModal.initialIndex}
        onClose={handleCloseImageModal}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
  snapScrollContent: {
    paddingBottom: 110,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
});

