'use client';

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ReviewInputAction } from '../_action/ReviewInput.action';
import { ReviewSubmitAction } from '../_action/ReviewSubmit.action';
import { useReviewModalStore } from '../_state/useReviewModalStore';

export function ReviewWriteArea() {
  const { postId, closeReviewModal } = useReviewModalStore(state => ({
    postId: state.postId,
    closeReviewModal: state.closeReviewModal,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sheetTitle}>후기 남기기</Text>
      </View>

      <Text style={styles.sectionDesc}>
        O/X 투표 이후 상대방과의 상황이 어떻게 진행되었나요? 후기를 공유하면 다른 유저들의 연애 고민 해결에 큰 도움이 됩니다!
      </Text>

      <ReviewInputAction />
      <ReviewSubmitAction onClose={closeReviewModal} postId={postId} />
    </View>
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
});
