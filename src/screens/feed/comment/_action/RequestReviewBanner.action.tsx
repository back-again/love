'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EnvelopeSvg } from '../_svg';
import { useCommentStore } from '../_state/useCommentStore';
import { useUserStore } from '@/_state/useUserStore';
import { requestReviewLib } from '../_lib/requestReview.lib';

export function RequestReviewBannerAction() {
  const targetPost = useCommentStore(state => state.targetPost);
  const user = useUserStore(state => state.user);
  const queryClient = useQueryClient();

  const { mutate: handleRequestReview, isPending } = useMutation({
    mutationFn: async () => {
      if (!targetPost?.id) return;
      await requestReviewLib({
        postId: targetPost.id,
        userId: user?.id,
      });
    },
    onSuccess: () => {
      const postTitle = targetPost?.title || '사연';
      Alert.alert(
        '후기 요청 완료 ✉️',
        `'${postTitle}' 작성자에게 후기 작성 알림을 보냈습니다!`,
      );
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    },
    onError: error => {
      console.error('Request review error:', error);
      Alert.alert('알림', '후기 요청 중 오류가 발생했습니다.');
    },
  });

  return (
    <TouchableOpacity
      onPress={() => handleRequestReview()}
      disabled={isPending}
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
          {isPending
            ? '후기 요청 중...'
            : '비슷한 고민을 겪고 있다면, 후기 요청하기'}
        </Text>
        <Text style={styles.reviewGradientArrow}>›</Text>
      </LinearGradient>
    </TouchableOpacity>
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
