'use client';

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { MoreOptionsSvg, VoteStatsSvg, CommentCountSvg } from '../_svg';
import { Post } from '../_model/feed.model';
import {
  useVoteState,
  getHasSeenFirstVoteGuide,
  setHasSeenFirstVoteGuideTrue,
} from '../_state/useFeedState';
import { VoteConfirmModal } from '@/components/modal/VoteConfirmModal';
import { useImageModalStore } from '../_state/useImageModalStore';
import { usePostOptionsStore } from '@/screens/postOptions/_state/usePostOptionsStore';
import { useCommentStore } from '@/screens/feed/comment/_state/useCommentStore';
import { useReviewModalStore } from '@/screens/review/_state/useReviewModalStore';
import { useToastStore } from '@/_state/useToastStore';
import { formatTimeAgo } from '../_lib/formatTimeAgo.lib';

interface FeedItemProps {
  post: Post;
}

export function FeedItem({ post }: FeedItemProps) {
  const { selectedVote, isVoted, totalVotes, percentO, percentX, handleVote } =
    useVoteState(post);

  const openImageModal = useImageModalStore(state => state.openImageModal);
  const openPostOptions = usePostOptionsStore(state => state.openPostOptions);
  const openComments = useCommentStore(state => state.openComments);
  const openReviewModal = useReviewModalStore(state => state.openReviewModal);
  const showToast = useToastStore(state => state.showToast);
  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingVoteChoice, setPendingVoteChoice] = useState<'O' | 'X' | null>(
    null,
  );

  const handleCardVote = (choice: 'O' | 'X') => {
    if (isVoted) return;

    if (!getHasSeenFirstVoteGuide()) {
      setPendingVoteChoice(choice);
    } else {
      handleVote(choice);
    }
  };

  const handleConfirmVote = () => {
    if (pendingVoteChoice) {
      setHasSeenFirstVoteGuideTrue();
      handleVote(pendingVoteChoice);
      setPendingVoteChoice(null);
    }
  };

  const handleImageClick = (index: number) => {
    openImageModal(post.images, index);
  };

  const handleOpenBottomSheet = () => {
    if (!isVoted) {
      showToast('💡 소신 있는 투표를 위해, 투표 후 댓글이 열려요!');
      return;
    }

    openComments(post);
  };

  const voteOText = post.voteO;
  const voteXText = post.voteX;
  const fullText = post.fullStory || post.storySummary || '';

  return (
    <View style={styles.cardPageWrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.topMetaRow}>
          <View style={styles.badgeChipsContainer}>
            {post.isHot && (
              <View style={styles.hotBadgePill}>
                <Text style={styles.hotBadgeText}>HOT</Text>
              </View>
            )}
            <View style={styles.categoryBadgePill}>
              <Text style={styles.categoryBadgeText}>{post.category}</Text>
            </View>
            <Text style={styles.categoryTimeText}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.moreOptionsButton}
            onPress={e => {
              e.stopPropagation();
              openPostOptions(post);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <MoreOptionsSvg />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setIsExpanded(prev => !prev)}
          activeOpacity={0.9}
          style={styles.storyClickArea}
        >
          <Text style={styles.questionTitle}>{post.title}</Text>
          {fullText ? (
            <Text
              style={styles.storyPreviewText}
              numberOfLines={isExpanded ? undefined : 3}
              ellipsizeMode="tail"
            >
              {fullText}
            </Text>
          ) : null}
        </TouchableOpacity>

        {post.images && post.images.length > 0 && (
          <View style={styles.imageListRow}>
            {post.images.slice(0, 3).map((imgUri: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={e => {
                  e.stopPropagation();
                  handleImageClick(index);
                }}
                activeOpacity={0.88}
              >
                <Image
                  source={{ uri: imgUri }}
                  style={styles.cardImageThumb}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {!isVoted ? (
          <View style={styles.votedResultsContainer}>
            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={e => {
                e.stopPropagation();
                handleCardVote('O');
              }}
              activeOpacity={0.88}
            >
              <View style={styles.votedBarTrack}>
                <Text
                  style={[
                    styles.votedBarOptionText,
                    styles.votedBarOptionTextUnselected,
                  ]}
                  numberOfLines={1}
                >
                  {voteOText}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={e => {
                e.stopPropagation();
                handleCardVote('X');
              }}
              activeOpacity={0.88}
            >
              <View style={styles.votedBarTrack}>
                <Text
                  style={[
                    styles.votedBarOptionText,
                    styles.votedBarOptionTextUnselected,
                  ]}
                  numberOfLines={1}
                >
                  {voteXText}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.votedResultsContainer}>
            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={e => {
                e.stopPropagation();
                handleCardVote('O');
              }}
              activeOpacity={0.9}
            >
              <View style={styles.votedBarTrack}>
                <View
                  style={[
                    styles.votedBarFill,
                    selectedVote === 'O'
                      ? styles.votedBarFillSelected
                      : styles.votedBarFillUnselected,
                    { width: `${percentO}%` },
                  ]}
                />
                <Text
                  style={[
                    styles.votedBarOptionText,
                    selectedVote === 'O'
                      ? styles.votedBarOptionTextSelected
                      : styles.votedBarOptionTextUnselected,
                  ]}
                  numberOfLines={1}
                >
                  {voteOText}
                </Text>
                <Text
                  style={[
                    styles.votedPercentText,
                    selectedVote === 'O'
                      ? styles.votedPercentTextSelected
                      : styles.votedPercentTextUnselected,
                  ]}
                >
                  {percentO}%
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={e => {
                e.stopPropagation();
                handleCardVote('X');
              }}
              activeOpacity={0.9}
            >
              <View style={styles.votedBarTrack}>
                <View
                  style={[
                    styles.votedBarFill,
                    selectedVote === 'X'
                      ? styles.votedBarFillSelected
                      : styles.votedBarFillUnselected,
                    { width: `${percentX}%` },
                  ]}
                />
                <Text
                  style={[
                    styles.votedBarOptionText,
                    selectedVote === 'X'
                      ? styles.votedBarOptionTextSelected
                      : styles.votedBarOptionTextUnselected,
                  ]}
                  numberOfLines={1}
                >
                  {voteXText}
                </Text>
                <Text
                  style={[
                    styles.votedPercentText,
                    selectedVote === 'X'
                      ? styles.votedPercentTextSelected
                      : styles.votedPercentTextUnselected,
                  ]}
                >
                  {percentX}%
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomStatsRow}>
          <View style={styles.statLeftCol}>
            <VoteStatsSvg />
            <Text style={styles.statLeftText}>
              {totalVotes.toLocaleString()}명 투표 중
            </Text>
          </View>

          <TouchableOpacity
            style={styles.statRightCol}
            onPress={e => {
              e.stopPropagation();
              handleOpenBottomSheet();
            }}
            activeOpacity={0.7}
          >
            <CommentCountSvg />
            <Text style={styles.statRightText}>{post.commentCount}</Text>
          </TouchableOpacity>
        </View>

        <VoteConfirmModal
          visible={!!pendingVoteChoice}
          onClose={() => setPendingVoteChoice(null)}
          onConfirm={handleConfirmVote}
          choiceText={
            pendingVoteChoice === 'O'
              ? voteOText
              : pendingVoteChoice === 'X'
                ? voteXText
                : ''
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPageWrapper: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  storyClickArea: {
    width: '100%',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  topMetaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeChipsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hotBadgePill: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FEB5C9',
  },
  hotBadgeText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#FF5D7B',
    letterSpacing: -0.2,
  },
  categoryBadgePill: {
    backgroundColor: '#FFF8F8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFF8F8',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#F9758D',
    letterSpacing: -0.2,
  },
  categoryTimeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F8F8F',
  },
  moreOptionsButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'left',
    lineHeight: 25,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  storyPreviewText: {
    fontSize: 14,
    color: '#727272',
    lineHeight: 20,
    marginBottom: 14,
  },
  imageListRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  cardImageThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  votePillRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  pillButtonO: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextO: {
    fontSize: 14,
    fontWeight: '700',
    color: '#727272',
  },
  vsCenterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8F8F8F',
    paddingHorizontal: 4,
  },
  pillButtonX: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillTextX: {
    fontSize: 14,
    fontWeight: '700',
    color: '#727272',
  },
  votedResultsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 14,
  },
  votedBarWrapper: {
    width: '100%',
  },
  votedBarTrack: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F5F5F5',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  votedBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 15,
  },
  votedBarFillSelected: {
    backgroundColor: '#FEEBED',
  },
  votedBarFillUnselected: {
    backgroundColor: '#F5F5F5',
  },
  votedBarOptionText: {
    position: 'absolute',
    left: 16,
    fontSize: 15,
    zIndex: 2,
  },
  votedBarOptionTextSelected: {
    color: '#F9758D',
    fontWeight: '800',
  },
  votedBarOptionTextUnselected: {
    color: '#727272',
    fontWeight: '700',
  },
  votedPercentText: {
    position: 'absolute',
    right: 16,
    fontSize: 15,
    fontWeight: '800',
    zIndex: 2,
  },
  votedPercentTextSelected: {
    color: '#F9758D',
  },
  votedPercentTextUnselected: {
    color: '#727272',
  },
  bottomStatsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  statLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLeftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#727272',
  },
  statRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statRightText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
