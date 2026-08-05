import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useLoad } from './_state/useLoad';
import { useFeed } from './_state/useFeed';
import { FeedListAction } from './_action/FeedList.action';

export default function FeedScreen() {
  const [activeCommentPostTitle, setActiveCommentPostTitle] = useState<
    string | null
  >(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);

  const { feedPageHeight } = useLoad();
  const { posts, isLoading, loadMore } = useFeed();

  // Automatic infinite scroll trigger when reaching bottom
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - feedPageHeight * 1.2;

    if (isCloseToBottom) {
      loadMore();
    }
  };

  return (
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
      <FeedListAction
        posts={posts}
        isLoading={isLoading}
        feedPageHeight={feedPageHeight}
        onOpenComments={title => setActiveCommentPostTitle(title)}
        onOpenViewReview={() => setIsReviewModalVisible(true)}
      />
    </ScrollView>
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
