'use client';

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ReviewBannerHandler } from '../_handler/ReviewBanner.handler';

export function ReviewBannerArea() {
  return (
    <View style={styles.voteSectionCleanWrapper}>
      <ReviewBannerHandler />
    </View>
  );
}

const styles = StyleSheet.create({
  voteSectionCleanWrapper: {
    width: '100%',
    paddingVertical: 8,
  },
});
