import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { WrittenPostListAction } from '../_action/WrittenPostList.action';

export function WrittenPostsArea() {
  return (
    <View style={styles.mySection}>
      <View style={styles.mySectionTitleRow}>
        <Text style={styles.mySectionTitle}>작성한 글</Text>
      </View>

      <WrittenPostListAction />
    </View>
  );
}

const styles = StyleSheet.create({
  mySection: {
    marginBottom: 30,
  },
  mySectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
});
