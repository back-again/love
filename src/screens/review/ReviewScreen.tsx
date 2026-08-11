'use client';

import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { ReviewInputAction } from './_action/ReviewInput.action';
import { ReviewSubmitAction } from './_action/ReviewSubmit.action';
import { useReviewForm } from './_state/useReviewForm';
import { useReviewModalStore, ReviewMode } from './_state/useReviewModalStore';

export type { ReviewMode };

export default function ReviewScreen() {
  const { visible, mode, reviewText, postId, closeReviewModal } =
    useReviewModalStore(
      useShallow(state => ({
        visible: state.visible,
        mode: state.mode,
        reviewText: state.reviewText,
        postId: state.postId,
        closeReviewModal: state.closeReviewModal,
      })),
    );

  const isWriteMode = mode === 'write';
  const reset = useReviewForm(state => state.reset);

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible, reset]);

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeReviewModal}
      snapPoints={isWriteMode ? ['65%'] : ['40%']}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>
          {isWriteMode ? '후기 남기기' : '사연 후기'}
        </Text>
      </View>

      {isWriteMode ? (
        <View style={styles.container}>
          <Text style={styles.sectionDesc}>
            O/X 투표 이후 상대방과의 상황이 어떻게 진행되었나요? 후기를 공유하면 다른 유저들의 연애 고민 해결에 큰 도움이 됩니다!
          </Text>

          <ReviewInputAction />
          <ReviewSubmitAction onClose={closeReviewModal} postId={postId} />
        </View>
      ) : (
        <View style={styles.reviewCardBox}>
          <Text style={styles.reviewCardBodyText}>{reviewText}</Text>
        </View>
      )}
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  reviewCardBox: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  reviewCardBodyText: {
    fontSize: 14.5,
    color: '#727272',
    lineHeight: 21,
    letterSpacing: -0.3,
  },
});
