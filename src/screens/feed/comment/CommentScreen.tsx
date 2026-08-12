'use client';

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { useCommentStore } from './_state/useCommentStore';
import { CommentHeaderArea } from './_area/CommentHeader.area';
import { ReviewBannerArea } from './_area/ReviewBanner.area';
import { CommentListArea } from './_area/CommentList.area';
import { CommentInputArea } from './_area/CommentInput.area';

export function CommentScreen() {
  const { visible, closeComments } = useCommentStore(
    useShallow(state => ({
      visible: state.visible,
      closeComments: state.closeComments,
    })),
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter {...props} bottomInset={0}>
        <CommentInputArea />
      </BottomSheetFooter>
    ),
    [],
  );

  if (!visible) return null;

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeComments}
      snapPoints={['67%']}
      useScrollView={true}
      enableDynamicSizing={false}
      footerComponent={renderFooter}
      keyboardBehavior="fillParent"
      enableContentPanningGesture={false}
    >
      <View style={styles.topSection}>
        <CommentHeaderArea />
        <ReviewBannerArea />
        <View style={styles.sectionDivider} />
      </View>

      <CommentListArea />
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  topSection: {
    paddingHorizontal: 0,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
});
