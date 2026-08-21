'use client';

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { RightSlideModal } from '@/components/modal/RightSlideModal';
import { useDetailStore } from './_state/useDetailStore';
import { DetailHeaderArea } from './_area/DetailHeader.area';
import { DetailViewHandler } from './_handler/DetailView.handler';
import { DetailCommentInputAction } from './_action/DetailCommentInput.action';

export function DetailScreen() {
  const { visible, closeDetail } = useDetailStore(
    useShallow(state => ({
      visible: state.visible,
      closeDetail: state.closeDetail,
    })),
  );

  if (!visible) return null;

  return (
    <RightSlideModal
      visible={visible}
      onClose={closeDetail}
      width="100%"
      enablePanGesture={true}
    >
      <View style={styles.container}>
        {/* Navigation Header */}
        <DetailHeaderArea />

        {/* Feed content & Comments */}
        <DetailViewHandler />

        {/* Comment input footer bar */}
        <DetailCommentInputAction />
      </View>
    </RightSlideModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
