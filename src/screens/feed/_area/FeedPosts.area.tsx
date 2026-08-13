import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CommentScreen } from '@/screens/feed/comment/CommentScreen';
import ReviewScreen from '@/screens/review/ReviewScreen';
import { PostOptionsScreen } from '@/screens/postOptions/PostOptionsScreen';
import { AllCategoryHeaderHandler } from '../_handler/AllCategoryHeader.handler';
import { GeneralPostsListAction } from '../_action/FeedPosts/GeneralPostsList.action';
import { ImageModalAction } from '../_action/FeedPosts/ImageModal.action';

export function FeedPostsArea() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.communityListContent,
          { paddingTop: insets.top + 104 + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={32}
      >
        <LinearGradient
          colors={['#FFDFE2', '#FAFAFA']}
          style={styles.gradientBg}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
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
    position: 'relative',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: -1000,
    right: -1000,
    height: 450,
    zIndex: -1,
  },
});
