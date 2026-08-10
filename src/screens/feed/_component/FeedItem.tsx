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
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Post } from '../_model/feed.model';
import {
  useVoteState,
  getHasSeenFirstVoteGuide,
  setHasSeenFirstVoteGuideTrue,
} from '../_state/useFeedState';
import { VoteInfo } from '@/components/CommentBottomSheet';
import { VoteConfirmModal } from '@/components/modal/VoteConfirmModal';

interface FeedItemProps {
  post: Post;
  pageHeight?: number;
  onOpenImageModal?: (index: number) => void;
  onOpenDetailPost?: (post: Post) => void;
  onOpenComments: (title: string, voteInfo?: VoteInfo) => void;
  onOpenViewReview?: () => void;
  onOpenOptions?: (post: Post) => void;
  onRequireVoteToast?: () => void;
}

export function FeedItem({
  post,
  onOpenImageModal,
  onOpenDetailPost,
  onOpenComments,
  onOpenViewReview,
  onOpenOptions,
  onRequireVoteToast,
}: FeedItemProps) {
  const {
    selectedVote,
    voteOCount,
    voteXCount,
    hasVoted,
    totalVoteCount,
    handleVote,
  } = useVoteState(post);

  const [isExpanded, setIsExpanded] = useState(false);
  const [pendingVoteChoice, setPendingVoteChoice] = useState<'O' | 'X' | null>(null);

  const isVoted = hasVoted;

  const totalVotes = totalVoteCount || 1;
  const percentO = totalVoteCount > 0 ? Math.round((voteOCount / totalVotes) * 100) : 50;
  const percentX = 100 - percentO;

  const handleCardVote = (choice: 'O' | 'X') => {
    if (!isVoted) {
      if (!getHasSeenFirstVoteGuide()) {
        // App-wide first time vote! Show confirmation guide modal
        setPendingVoteChoice(choice);
      } else {
        // Vote immediately
        handleVote(choice);
      }
    } else {
      handleVote(choice);
    }
  };

  const handleConfirmVote = () => {
    if (pendingVoteChoice) {
      setHasSeenFirstVoteGuideTrue(); // Persist so future votes on any post never show modal!
      handleVote(pendingVoteChoice);
      setPendingVoteChoice(null);
    }
  };

  const handleOpenBottomSheet = () => {
    if (!isVoted) {
      if (onRequireVoteToast) onRequireVoteToast();
      return;
    }

    onOpenComments(post.title, {
      selectedVote: selectedVote,
      voteOText: post.voteO,
      voteXText: post.voteX,
      percentO: percentO,
      percentX: percentX,
      totalVotes: totalVotes,
      hasReview: post.hasReview,
    });
  };

  const voteOText = post.voteO || '괜찮은데?';
  const voteXText = post.voteX || '난 싫어';
  const fullText = post.fullStory || post.storySummary || '';

  return (
    <TouchableOpacity
      style={styles.cardPageWrapper}
      onPress={() => setIsExpanded(prev => !prev)}
      activeOpacity={0.92}
    >
      <View style={styles.cardContainer}>
        {/* Top Meta Row: Badge Pills + Time (Left) & Three Dots More Menu (Right) */}
        <View style={styles.topMetaRow}>
          <View style={styles.badgeChipsContainer}>
            {post.isHot && (
              <View style={styles.hotBadgePill}>
                <Text style={styles.hotBadgeText}>HOT</Text>
              </View>
            )}
            <View style={styles.categoryBadgePill}>
              <Text style={styles.categoryBadgeText}>
                {post.category || '연애/썸'}
              </Text>
            </View>
            <Text style={styles.categoryTimeText}>5분 전</Text>
          </View>

          {/* Three Dots More Menu Button */}
          <TouchableOpacity
            style={styles.moreOptionsButton}
            onPress={(e) => {
              e.stopPropagation();
              if (onOpenOptions) onOpenOptions(post);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.6}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Circle cx={5} cy={12} r={2} fill="#A0A0A0" />
              <Circle cx={12} cy={12} r={2} fill="#A0A0A0" />
              <Circle cx={19} cy={12} r={2} fill="#A0A0A0" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Title Question */}
        <Text style={styles.questionTitle}>{post.title}</Text>

        {/* Story Text Preview (3 lines preview with ellipsis, expands on press) */}
        {fullText ? (
          <Text
            style={styles.storyPreviewText}
            numberOfLines={isExpanded ? undefined : 3}
            ellipsizeMode="tail"
          >
            {fullText}
          </Text>
        ) : null}

        {/* Attached Images Preview if any */}
        {post.images && post.images.length > 0 && (
          <View style={styles.imageListRow}>
            {post.images.slice(0, 3).map((imgUri: string, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={(e) => {
                  e.stopPropagation();
                  if (onOpenImageModal) onOpenImageModal(index);
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

        {/* Interactive Vote Options (Before vs After Voting) */}
        {!isVoted ? (
          <View style={styles.votedResultsContainer}>
            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={(e) => {
                e.stopPropagation();
                handleCardVote('O');
              }}
              activeOpacity={0.88}
            >
              <View style={styles.votedBarTrack}>
                <Text
                  style={[styles.votedBarOptionText, styles.votedBarOptionTextUnselected]}
                  numberOfLines={1}
                >
                  {voteOText}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.votedBarWrapper}
              onPress={(e) => {
                e.stopPropagation();
                handleCardVote('X');
              }}
              activeOpacity={0.88}
            >
              <View style={styles.votedBarTrack}>
                <Text
                  style={[styles.votedBarOptionText, styles.votedBarOptionTextUnselected]}
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
              onPress={(e) => {
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
              onPress={(e) => {
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

        {/* Bottom Stats Row: Vote Count & Comment Count */}
        <View style={styles.bottomStatsRow}>
          <View style={styles.statLeftCol}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={2} y={12} width={5} height={10} rx={2} fill="#8F8F8F" />
              <Rect x={9.5} y={6} width={5} height={16} rx={2} fill="#8F8F8F" />
              <Rect x={17} y={2} width={5} height={20} rx={2} fill="#8F8F8F" />
            </Svg>
            <Text style={styles.statLeftText}>
              {(totalVotes || 643).toLocaleString()}명 투표 중
            </Text>
          </View>

          <TouchableOpacity
            style={styles.statRightCol}
            onPress={(e) => {
              e.stopPropagation();
              handleOpenBottomSheet();
            }}
            activeOpacity={0.7}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="#8F8F8F"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.statRightText}>
              {post.commentCount || (post.topComments ? post.topComments.length : 128)}
            </Text>
          </TouchableOpacity>
        </View>

        <VoteConfirmModal
          visible={!!pendingVoteChoice}
          onClose={() => setPendingVoteChoice(null)}
          onConfirm={handleConfirmVote}
          choiceText={pendingVoteChoice === 'O' ? voteOText : pendingVoteChoice === 'X' ? voteXText : ''}
        />
      </View>
    </TouchableOpacity>
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
