import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

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
}

interface WrittenPostCardProps {
  post: WrittenPost;
  onOpenViewReview?: (post: WrittenPost) => void;
  onOpenWriteReview?: (post: WrittenPost) => void;
  onOpenOptions?: (post: WrittenPost) => void;
}

export function WrittenPostCard({
  post,
  onOpenViewReview,
  onOpenWriteReview,
  onOpenOptions,
}: WrittenPostCardProps) {
  const isODominant = post.voteO >= post.voteX;
  const isXDominant = post.voteX > post.voteO;

  return (
    <View style={styles.myPostCard}>
      {/* Title & Three Dots More Options Menu */}
      <View style={styles.myPostTitleRow}>
        <Text style={styles.myPostTitle} numberOfLines={2}>
          {post.title}
        </Text>
        <TouchableOpacity
          style={styles.moreOptionsBtn}
          onPress={() => onOpenOptions && onOpenOptions(post)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Circle cx={5} cy={12} r={2} fill="#8F8F8F" />
            <Circle cx={12} cy={12} r={2} fill="#8F8F8F" />
            <Circle cx={19} cy={12} r={2} fill="#8F8F8F" />
          </Svg>
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
                backgroundColor: isODominant ? '#FFC8B3' : '#F1F5F9',
              },
            ]}
          />
          <View
            style={[
              styles.myPostVoteBarX,
              {
                flex: post.voteX,
                backgroundColor: isXDominant ? '#FFB4BB' : '#F1F5F9',
              },
            ]}
          />
        </View>
        <View style={styles.myPostVotePercentRow}>
          <Text
            style={[
              styles.myPostVotePercentO,
              !isODominant && { color: '#9C9C9C' },
            ]}
          >
            괜찮은데? O {post.percentO}%
          </Text>
          <Text
            style={[
              styles.myPostVotePercentX,
              !isXDominant && { color: '#9C9C9C' },
            ]}
          >
            난 싫어 X {post.percentX}%
          </Text>
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
            onPress={() => onOpenViewReview && onOpenViewReview(post)}
            activeOpacity={0.8}
          >
            <Text style={styles.myPostReviewedBtnText}>후기 보기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.myPostReviewBtn}
            onPress={() => onOpenWriteReview && onOpenWriteReview(post)}
            activeOpacity={0.8}
          >
            <Text style={styles.myPostReviewBtnText}>후기 남기기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  myPostCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
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
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 6,
  },
  myPostVoteBarO: {
    backgroundColor: '#FFC8B3',
    height: '100%',
  },
  myPostVoteBarX: {
    backgroundColor: '#FFB4BB',
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
    color: '#FF8E7A',
  },
  myPostVotePercentX: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF858F',
  },
  myPostCardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
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
    width: 96,
    height: 38,
    backgroundColor: '#FEEBED',
    borderWidth: 1,
    borderColor: '#FEB5C9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewBtnText: {
    color: '#F9758D',
    fontSize: 14,
    fontWeight: '700',
  },
  myPostReviewedBtn: {
    width: 96,
    height: 38,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewedBtnText: {
    color: '#727272',
    fontSize: 14,
    fontWeight: '600',
  },
});
