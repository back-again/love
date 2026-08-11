import React, { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { CategoryHeaderArea } from './_area/CategoryHeader.area';
import { FeedPostsArea } from './_area/FeedPosts.area';
import { CategoryHydration } from './_component/CategoryHydration';
import { CategoryHeaderFallback } from './_component/CategoryHeaderFallback';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <CategoryHydration>
        <Suspense fallback={<CategoryHeaderFallback />}>
          <CategoryHeaderArea />
        </Suspense>
      </CategoryHydration>

      <FeedPostsArea />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: 'transparent',
  },
});
