import React from 'react';
import { StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { AllCategoryHeaderHandler } from '../_handler/AllCategoryHeader.handler';
import { useHeaderStore } from '@/_state/useHeaderStore';
import { GeneralPostsListAction } from '../_action/FeedPosts/GeneralPostsList.action';
import { ImageModalAction } from '../_action/FeedPosts/ImageModal.action';

export function FeedPostsArea() {
  const insets = useSafeAreaInsets();
  const scrollYAnim = useHeaderStore(state => state.scrollYAnim);

  return (
    <>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.communityListContent,
          { paddingTop: insets.top + 104 + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
          { useNativeDriver: true },
        )}
      >
        <LinearGradient
          colors={['#FFDFE2', '#FFDFE2', '#FAFAFA']}
          locations={[0, 0.69, 1]}
          style={styles.gradientBg}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        <AllCategoryHeaderHandler />
        <GeneralPostsListAction />
      </Animated.ScrollView>

      <ImageModalAction />
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
    top: -1000,
    left: -1000,
    right: -1000,
    height: 1450,
    zIndex: -1,
  },
});
