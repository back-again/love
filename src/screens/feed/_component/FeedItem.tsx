import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Rect, Path } from 'react-native-svg';
import { Post } from '../_model/feed.model';
import {
  useVoteState,
  useStoryState,
  useImageState,
} from '../_state/useFeedState';
import { FeedItemVoteCard } from './FeedItem.VoteCard';
import { CaretDownSvg, CaretUpSvg } from '../_svg';

import { VoteInfo } from '@/components/CommentBottomSheet';

interface FeedItemProps {
  post: Post;
  pageHeight: number;
  onOpenImageModal?: (index: number) => void;
  onOpenComments: (title: string, voteInfo?: VoteInfo) => void;
  onOpenViewReview: () => void;
}

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80';

export function FeedItem({
  post,
  pageHeight,
  onOpenImageModal,
  onOpenComments,
  onOpenViewReview,
}: FeedItemProps) {
  const [hasMoreStory, setHasMoreStory] = useState(false);

  const handleTextLayout = useCallback((e: any) => {
    if (e?.nativeEvent?.lines) {
      if (e.nativeEvent.lines.length > 4) {
        setHasMoreStory(prev => (prev ? prev : true));
      }
    }
  }, []);

  const {
    selectedVote,
    voteOCount,
    voteXCount,
    hasVoted,
    totalVoteCount,
    handleVote,
  } = useVoteState(post);

  const { isStoryExpanded, setIsStoryExpanded } = useStoryState();
  const { imageErrorMap, handleImageError } = useImageState();

  const fullText = post.fullStory || post.storySummary || '';

  const handleOpenBottomSheet = () => {
    onOpenComments(post.title, {
      selectedVote: selectedVote,
      voteOText: post.voteO,
      voteXText: post.voteX,
      percentO: post.percentO || 50,
      percentX: post.percentX || 50,
      totalVotes: totalVoteCount || 300,
      hasReview: post.hasReview,
    });
  };

  return (
    <TouchableOpacity
      style={styles.cardPageWrapper}
      onPress={handleOpenBottomSheet}
      activeOpacity={0.92}
    >
      <View style={styles.cardContainer}>
        {/* Top Meta Row: Badge Pill + Category & Time */}
        <View style={styles.topMetaRow}>
          <View style={styles.hotBadgePill}>
            <Text style={styles.hotBadgeText}>HOT</Text>
          </View>
          <Text style={styles.categoryTimeText}>연애 · 5분 전</Text>
        </View>

        {/* Title Question */}
        <Text style={styles.questionTitle}>{post.title}</Text>

        {/* Story Text Preview if any */}
        {fullText ? (
          <Text style={styles.storyPreviewText} numberOfLines={2}>
            {fullText}
          </Text>
        ) : null}

        {/* Attached Images Preview if any */}
        {post.images.length > 0 && (
          <View style={styles.imageListRow}>
            {post.images.slice(0, 3).map((imgUri, index) => (
              <Image
                key={index}
                source={{ uri: imgUri || DEFAULT_FALLBACK_IMAGE }}
                style={styles.cardImageThumb}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        {/* Bottom Stats Row: Vote Count & Comment Count */}
        <View style={styles.bottomStatsRow}>
          <View style={styles.statLeftCol}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={2} y={12} width={5} height={10} rx={2} fill="#94A3B8" />
              <Rect x={9.5} y={6} width={5} height={16} rx={2} fill="#94A3B8" />
              <Rect x={17} y={2} width={5} height={20} rx={2} fill="#94A3B8" />
            </Svg>
            <Text style={styles.statLeftText}>
              {(totalVoteCount || 643).toLocaleString()}명 투표 중
            </Text>
          </View>

          <View style={styles.statRightCol}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.statRightText}>{post.commentCount || 128}</Text>
          </View>
        </View>
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
    gap: 8,
    marginBottom: 10,
  },
  hotBadgePill: {
    backgroundColor: '#FF4D7B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  categoryTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
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
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 14,
  },
  imageListRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  cardImageThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  bottomStatsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLeftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
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
  storyNoImagesCard: {
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    overflow: 'hidden',
    borderWidth: 0,
    marginBottom: 14,
  },
  storyDropdownWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
    marginBottom: 14,
  },
  storyDropdownCardCollapsed: {
    width: '100%',
    minHeight: 130,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'column',
    overflow: 'hidden',
    borderWidth: 0,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  storyDropdownTextCollapsed: {
    width: '100%',
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.3,
    fontWeight: '500',
    lineHeight: 25,
    marginBottom: 6,
  },
  caretBottomRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  storyDropdownCardExpandedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  storyDropdownCardExpandedToImagePos: {
    width: '100%',
    minHeight: 356,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    overflow: 'hidden',
    borderWidth: 0,
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(10px) saturate(180%)',
          WebkitBackdropFilter: 'blur(10px) saturate(180%)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  storyDropdownTextExpanded: {
    fontSize: 18,
    color: '#0F172A',
    lineHeight: 25,
    letterSpacing: -0.3,
    marginBottom: 12,
    fontWeight: '500',
  },
  expandedCaretUpRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  singleImageWrapper: {
    width: '100%',
    height: 270,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  multiImageRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    height: 270,
    marginBottom: 16,
  },
  multiImageHalf: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  multiImageThird: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlayText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  multiImage: {
    width: '100%',
    height: '100%',
  },
  voteRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 14,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
    width: '100%',
  },
  actionChip: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activeActionChip: {
    backgroundColor: 'rgba(255, 238, 235, 0.95)',
    borderColor: '#FF5A5F',
  },
  actionChipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FF5A5F',
  },
  activeActionChipText: {
    color: '#FF5A5F',
    fontWeight: '800',
  },
  actionChipIconOnly: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0,
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(12px) saturate(140%)',
          WebkitBackdropFilter: 'blur(12px) saturate(140%)',
        }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
});
