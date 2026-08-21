import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MoreOptionsSvg } from '../_svg';
import { useUserStore } from '@/_state/useUserStore';

export interface WrittenPost {
  id: string;
  title: string;
  participants: number;
  voteO: number;
  voteX: number;
  percentO: number;
  percentX: number;
  curiousCount?: number;
  hasReview: boolean;
  reviewContent?: string;
  created_at?: string;
}

interface WrittenPostCardProps {
  post: WrittenPost;
  onPress?: (post: WrittenPost) => void;
  onOpenViewReview?: (post: WrittenPost) => void;
  onOpenWriteReview?: (post: WrittenPost) => void;
  onOpenOptions?: (post: WrittenPost) => void;
}

export function WrittenPostCard({
  post,
  onPress,
  onOpenViewReview,
  onOpenWriteReview,
  onOpenOptions,
}: WrittenPostCardProps) {
  const user = useUserStore(state => state.user);
  const isODominant = post.voteO >= post.voteX;
  const isXDominant = post.voteX > post.voteO;

  let ddayLabel = '';
  if (user?.dating_started_at && post.created_at) {
    try {
      const startDate = new Date(user.dating_started_at);
      const postDate = new Date(post.created_at);
      startDate.setHours(0, 0, 0, 0);
      postDate.setHours(0, 0, 0, 0);

      const diffTime = postDate.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 0) {
        ddayLabel = `D+${diffDays}`;
      }
    } catch (e) {
      console.warn('Failed to calculate post D-day:', e);
    }
  }

  return (
    <TouchableOpacity
      style={styles.myPostCard}
      onPress={() => onPress && onPress(post)}
      activeOpacity={0.88}
    >
      {ddayLabel ? (
        <Text style={styles.ddayLabelText}>{ddayLabel}</Text>
      ) : null}
      {/* Title & Three Dots More Options Menu */}
      <View style={styles.myPostTitleRow}>
        <Text style={styles.myPostTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <TouchableOpacity
          style={styles.moreOptionsBtn}
          onPress={e => {
            e.stopPropagation();
            onOpenOptions && onOpenOptions(post);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <MoreOptionsSvg width={18} height={18} color="#8F8F8F" />
        </TouchableOpacity>
      </View>

      {/* O/X Vote Mini Gauge Progress Bar */}
      <View style={styles.myPostVoteBarWrapper}>
        <View style={styles.myPostVoteBarContainer}>
          <View
            style={[
              styles.myPostVoteBarO,
              {
                flex: post.voteO,
                backgroundColor: isODominant ? '#E5DBFF' : '#F5F5F5',
              },
            ]}
          />
          <View
            style={[
              styles.myPostVoteBarX,
              {
                flex: post.voteX,
                backgroundColor: isXDominant ? '#FFDFE2' : '#F5F5F5',
              },
            ]}
          />
        </View>
        <View style={styles.myPostVotePercentRow}>
          <View style={styles.percentColO}>
            <Text
              style={[
                styles.myPostVotePercentO,
                !isODominant && { color: '#8F8F8F' },
              ]}
            >
              O {post.percentO}%
            </Text>
            <Text style={[styles.percentOptionLabelText, !isODominant && { color: '#8F8F8F' }]}>
              괜찮은데?
            </Text>
          </View>
          <View style={styles.percentColX}>
            <Text
              style={[
                styles.myPostVotePercentX,
                !isXDominant && { color: '#8F8F8F' },
              ]}
            >
              X {post.percentX}%
            </Text>
            <Text style={[styles.percentOptionLabelText, !isXDominant && { color: '#8F8F8F' }, styles.textAlignRight]}>
              난 싫어
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.myPostCardBodyRow}>
        <View style={styles.myPostMetaCol}>
          <Text style={styles.myPostMetaRow1}>{post.participants}명 참여</Text>
          {!post.hasReview && post.curiousCount !== undefined && (
            <Text style={styles.myPostMetaRow2}>
              ✉️{' '}
              <Text style={styles.curiousHighlight}>{post.curiousCount}명</Text>
              이 후기를 기다려요
            </Text>
          )}
        </View>

        {post.hasReview ? (
          <TouchableOpacity
            style={styles.myPostReviewedBtn}
            onPress={e => {
              e.stopPropagation();
              onOpenViewReview && onOpenViewReview(post);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.myPostReviewedBtnText}>후기 보기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.myPostReviewBtn}
            onPress={e => {
              e.stopPropagation();
              onOpenWriteReview && onOpenWriteReview(post);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.myPostReviewBtnText}>작성하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  myPostCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 18,
    marginBottom: 14,
  },
  myPostTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  myPostTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  moreOptionsBtn: {
    padding: 2,
    marginTop: 2,
  },
  myPostVoteBarWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  myPostVoteBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 6,
  },
  myPostVoteBarO: {
    backgroundColor: '#8B75F9',
    height: '100%',
  },
  myPostVoteBarX: {
    backgroundColor: '#F9758D',
    height: '100%',
  },
  myPostVotePercentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myPostVotePercentO: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8B75F9',
  },
  myPostVotePercentX: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#F9758D',
  },
  myPostCardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  myPostMetaCol: {
    flex: 1,
    marginRight: 12,
  },
  myPostMetaRow1: {
    fontSize: 13.5,
    color: '#8F8F8F',
    marginBottom: 4,
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  myPostMetaRow2: {
    fontSize: 13.5,
    color: '#8F8F8F',
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  curiousHighlight: {
    color: '#F9758D',
    fontWeight: '700',
  },
  myPostReviewBtn: {
    width: 78,
    height: 30,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F9758D',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewBtnText: {
    color: '#F9758D',
    fontSize: 12.5,
    fontWeight: '700',
  },
  myPostReviewedBtn: {
    width: 78,
    height: 30,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewedBtnText: {
    color: '#727272',
    fontSize: 12.5,
    fontWeight: '600',
  },
  percentColO: {
    alignItems: 'flex-start',
    gap: 2,
  },
  percentColX: {
    alignItems: 'flex-end',
    gap: 2,
  },
  percentOptionLabelText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#727272',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  ddayLabelText: {
    fontSize: 12,
    color: '#8F8F8F',
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
});
