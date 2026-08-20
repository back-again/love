import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useHeaderStore } from '@/_state/useHeaderStore';
import { CategoryHeaderArea } from './_area/CategoryHeader.area';
import { FeedPostsListAction } from './_action/FeedPosts/FeedPostsList.action';
import { InViewSentinelAction } from './_action/FeedPosts/InViewSentinel.action';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();
  const scrollYAnim = useHeaderStore(state => state.scrollYAnim);

  const gradientTranslateY = scrollYAnim.interpolate({
    inputRange: [-200, 0, 400],
    outputRange: [0, 0, -400],
    extrapolateRight: 'clamp',
  });

  const categoryOpacity = scrollYAnim.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.gradientContainer,
          { transform: [{ translateY: gradientTranslateY }] },
        ]}
      >
        <LinearGradient
          colors={['#FFDFE2', '#FFDFE2', '#FAFAFA']}
          locations={[0, 0.69, 1]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.communityListContent,
          { paddingTop: insets.top + 60 },
        ]}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollYAnim } } }],
          { useNativeDriver: true },
        )}
      >
        <Animated.View style={{ opacity: categoryOpacity }}>
          <CategoryHeaderArea />
        </Animated.View>
        <View style={styles.postsContainer}>
          <FeedPostsListAction />
          <InViewSentinelAction />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 450,
    zIndex: 0,
  },
  categoryHeaderWrapper: {
    width: '100%',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  communityListContent: {
    paddingTop: 8,
    paddingBottom: 110,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  postsContainer: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 14,
  },
});
