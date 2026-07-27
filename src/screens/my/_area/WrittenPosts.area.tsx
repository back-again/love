import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const writtenPosts = [
  {
    id: 'my-1',
    title: '생일선물 피엑스에서 사다준 남친 나만 짜쳐?',
    participants: 375,
    voteO: 57,
    voteX: 43,
    percentO: 57,
    percentX: 43,
    curiousCount: 234,
    hasReview: false,
  },
  {
    id: 'my-2',
    title: '헤어진 전애인 인스타 스토리 매일 읽는 심리가 뭘까?',
    participants: 412,
    voteO: 28,
    voteX: 72,
    percentO: 28,
    percentX: 72,
    views: '1,234',
    hasReview: true,
  },
];

export function WrittenPostsArea() {
  return (
    <View style={styles.mySection}>
      <View style={styles.mySectionTitleRow}>
        <Text style={styles.mySectionTitle}>작성한 글</Text>
        <Text style={styles.mySectionCountBadge}>{writtenPosts.length}</Text>
      </View>
      {writtenPosts.map((post, idx) => {
        const isODominant = post.voteO >= post.voteX;
        const isXDominant = post.voteX > post.voteO;

        return (
          <View key={post.id + idx} style={styles.myPostCard}>
            <Text style={styles.myPostTitle} numberOfLines={2}>
              {post.title}
            </Text>

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
                <Text style={styles.myPostMetaRow1}>
                  {post.participants}명 참여
                </Text>
                {!post.hasReview && (
                  <Text style={styles.myPostMetaRow2}>
                    ✉️{' '}
                    <Text style={{ color: '#FF8E7A', fontWeight: '700' }}>
                      {post.curiousCount}명
                    </Text>
                    이 후기를 기다려요
                  </Text>
                )}
              </View>

              {/* {post.hasReview ? (
                <TouchableOpacity
                  style={styles.myPostReviewedBtn}
                  onPress={() => {
                    if (onOpenViewReview) onOpenViewReview();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.myPostReviewedBtnText}>
                    후기 보기
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.myPostReviewBtn}
                  onPress={() => onOpenMenu('write_review')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.myPostReviewBtnText}>
                    후기 남기기
                  </Text>
                </TouchableOpacity>
              )} */}
            </View>
          </View>
        );
      })}
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
  mySectionCountBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF8E7A',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  myPostCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 18,
    marginBottom: 14,
  },
  myPostTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: -0.3,
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
    borderTopColor: '#F8F8F8',
  },
  myPostMetaCol: {
    flex: 1,
    marginRight: 12,
  },
  myPostMetaRow1: {
    fontSize: 13.5,
    color: '#9C9C9C',
    marginBottom: 4,
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  myPostMetaRow2: {
    fontSize: 13.5,
    color: '#9C9C9C',
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  myPostReviewBtn: {
    width: 96,
    height: 38,
    backgroundColor: '#FF8E7A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  myPostReviewedBtn: {
    width: 96,
    height: 38,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewedBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
});
