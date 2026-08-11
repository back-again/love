'use client';

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { CommentScreen } from '@/screens/feed/comment/CommentScreen';
import ReviewScreen from '@/screens/review/ReviewScreen';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { AllCategoryHeaderHandler } from '../_handler/AllCategoryHeader.handler';
import { GeneralPostsListAction } from '../_action/FeedPosts/GeneralPostsList.action';
import { ImageModalAction } from '../_action/FeedPosts/ImageModal.action';

export function FeedPostsArea() {
  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.communityListContent}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={32}
      >
        <AllCategoryHeaderHandler />

        <GeneralPostsListAction />
      </ScrollView>

      <ImageModalAction />

      <CommentScreen />
      <PostOptionsScreen />
      <ReviewScreen />
    </>
  );
}

const styles = StyleSheet.create({
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
});
