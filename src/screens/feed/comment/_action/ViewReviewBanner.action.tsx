'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EnvelopeSvg } from '../_svg';
import ReviewScreen from '@/screens/review/ReviewScreen';
import { useReviewModalStore } from '@/screens/review/_state/useReviewModalStore';
import { useCommentStore } from '../_state/useCommentStore';

export function ViewReviewBannerAction() {
  const openReviewModal = useReviewModalStore(state => state.openReviewModal);
  const targetPost = useCommentStore(state => state.targetPost);

  const handleOpenReview = () => {
    openReviewModal({
      mode: 'view',
      reviewText: targetPost?.reviewContent || '',
      postId: targetPost?.id,
    });
  };

  return (
    <>
      <TouchableOpacity
        onPress={handleOpenReview}
        activeOpacity={0.88}
        style={styles.reviewGradientTouch}
      >
        <LinearGradient
          colors={['#FEEBED', '#FFFFFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.reviewGradientContainer}
        >
          <View style={styles.reviewIconBadgeWhite}>
            <EnvelopeSvg />
          </View>
          <Text style={styles.reviewGradientButtonText}>
            작성자의 후기 읽어보기
          </Text>
          <Text style={styles.reviewGradientArrow}>›</Text>
        </LinearGradient>
      </TouchableOpacity>

      <ReviewScreen />
    </>
  );
}

const styles = StyleSheet.create({
  reviewGradientTouch: {
    width: '100%',
    borderRadius: 25,
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FEB5C9',
  },
  reviewGradientContainer: {
    width: '100%',
    height: 50,
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  reviewIconBadgeWhite: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewGradientButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F9758D',
    letterSpacing: -0.2,
    flex: 1,
    marginLeft: 10,
  },
  reviewGradientArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9758D',
  },
});
