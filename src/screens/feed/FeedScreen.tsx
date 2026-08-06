import React, { Suspense, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { FeedListAction } from './_action/FeedList.action';
import { FeedLoadingFallback } from './_component/FeedLoadingFallback';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Suspense fallback={<FeedLoadingFallback />}>
        <FeedListAction />
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
  },
});
