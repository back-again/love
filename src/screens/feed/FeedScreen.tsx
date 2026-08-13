import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FeedPostsArea } from './_area/FeedPosts.area';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <FeedPostsArea />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'relative',
    backgroundColor: '#FAFAFA',
  },
});
