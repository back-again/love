import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Post } from '../_model/feed.model';
import {
  useVoteState,
  useStoryState,
  useLikeState,
  useRearState,
  useReviewState,
  useImageState,
} from '../_state/useFeedState';
import { FeedItemVoteCard } from './FeedItem.VoteCard';
import { FeedItemReactionChip } from './FeedItem.ReactionChip';
import { FeedItemCommentPill } from './FeedItem.CommentPill';
import {
  CaretDownSvg,
  CaretUpSvg,
  CommentSvg,
  ReviewSvg,
  ShareSvg,
} from '../_svg';

interface FeedItemProps {
  post: Post;
  pageHeight: number;
  onOpenImageModal?: (index: number) => void;
  onOpenComments: (title: string) => void;
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
  // 1. 투표 State
  const {
    selectedVote,
    voteOCount,
    voteXCount,
    hasVoted,
    totalVoteCount,
    handleVote,
  } = useVoteState(post);

  // 2. 스토리 확장 State
  const { isStoryExpanded, setIsStoryExpanded } = useStoryState();

  // 3. 좋아요 State & Action
  const { hasFired, fireCount, handleFireReaction } = useLikeState(post);

  // 4. 뒷골 State & Action
  const { hasFacepalmed, facepalmCount, handleFacepalmReaction } =
    useRearState(post);

  // 5. 후기 State & Action
  const { hasRequestedReview, handleReviewAction } = useReviewState(
    post,
    onOpenViewReview,
  );

  // 6. 이미지 State & Action
  const { imageErrorMap, handleImageError } = useImageState();

  return (
    <View style={[styles.cardPageWrapper, { height: pageHeight }]}>
      <View style={styles.cardContainer}>
        <Text style={styles.questionTitle}>{post.title}</Text>

        {post.images.length === 0 ? (
          <View style={styles.storyNoImagesCard}>
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={35}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={styles.storyDropdownTextExpanded}>
              {post.fullStory}
            </Text>
          </View>
        ) : (
          <View style={styles.storyDropdownWrapper}>
            {!isStoryExpanded ? (
              <TouchableOpacity
                style={styles.storyDropdownCardCollapsed}
                onPress={() => setIsStoryExpanded(true)}
                activeOpacity={0.85}
              >
                {Platform.OS !== 'web' && (
                  <BlurView
                    intensity={35}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Text
                  style={styles.storyDropdownTextCollapsed}
                  numberOfLines={2}
                >
                  {post.storySummary}
                </Text>
                <CaretDownSvg />
              </TouchableOpacity>
            ) : (
              <View style={styles.storyDropdownCardExpandedContainer}>
                <TouchableOpacity
                  style={styles.storyDropdownCardExpandedToImagePos}
                  onPress={() => setIsStoryExpanded(false)}
                  activeOpacity={0.95}
                >
                  {Platform.OS !== 'web' && (
                    <BlurView
                      intensity={35}
                      tint="light"
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storyDropdownTextExpanded}>
                      {post.fullStory}
                    </Text>
                  </View>
                  <View style={styles.expandedCaretUpRow}>
                    <CaretUpSvg />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* 3. Image Section */}
        {post.images.length > 0 && (
          <View
            style={
              post.images.length === 1
                ? styles.singleImageWrapper
                : styles.multiImageRow
            }
          >
            {post.images.slice(0, 3).map((imgUri, index) => {
              const isThirdAndMore = index === 2 && post.images.length > 3;
              const cardStyle =
                post.images.length === 1
                  ? styles.singleImageWrapper
                  : post.images.length === 2
                    ? styles.multiImageHalf
                    : styles.multiImageThird;

              const hasError = imageErrorMap[index];
              const sourceUri =
                hasError || !imgUri ? DEFAULT_FALLBACK_IMAGE : imgUri;

              return (
                <TouchableOpacity
                  key={index}
                  style={cardStyle}
                  onPress={() => onOpenImageModal?.(index)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: sourceUri }}
                    style={styles.multiImage}
                    resizeMode="cover"
                    onError={() => handleImageError(index)}
                  />
                  {isThirdAndMore && (
                    <View style={styles.imageOverlay}>
                      <Text style={styles.imageOverlayText}>
                        +{post.images.length - 3}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* 4. Top 3 Rolling Featured Comment Card */}
        <FeedItemCommentPill
          comments={post.topComments}
          postTitle={post.title}
          onPress={onOpenComments}
        />

        {/* 5. O / X Vote Cards */}
        <View style={styles.voteRow}>
          <FeedItemVoteCard
            type="O"
            text={post.voteO}
            isSelected={selectedVote === 'O'}
            onPress={() => handleVote('O')}
            count={voteOCount}
            totalCount={totalVoteCount}
            hasVoted={hasVoted}
          />
          <FeedItemVoteCard
            type="X"
            text={post.voteX}
            isSelected={selectedVote === 'X'}
            onPress={() => handleVote('X')}
            count={voteXCount}
            totalCount={totalVoteCount}
            hasVoted={hasVoted}
          />
        </View>

        {/* 6. Reactions & Action Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reactionsRow}
        >
          <FeedItemReactionChip
            emoji="🔥"
            count={fireCount}
            isActive={hasFired}
            onPress={handleFireReaction}
          />

          <FeedItemReactionChip
            emoji="🤦‍♀️"
            count={facepalmCount}
            isActive={hasFacepalmed}
            onPress={handleFacepalmReaction}
          />

          <FeedItemReactionChip
            icon={<CommentSvg />}
            count={post.commentCount}
            onPress={() => onOpenComments(post.title)}
          />

          <TouchableOpacity
            style={[
              styles.actionChip,
              (post.hasReview || hasRequestedReview) && styles.activeActionChip,
            ]}
            onPress={handleReviewAction}
            activeOpacity={0.8}
          >
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <ReviewSvg />
            <Text
              style={[
                styles.actionChipText,
                (post.hasReview || hasRequestedReview) &&
                  styles.activeActionChipText,
              ]}
            >
              {post.hasReview ? '후기 보기' : '후기 요청'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChipIconOnly}
            activeOpacity={0.8}
          >
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <ShareSvg />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPageWrapper: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 16,
    marginTop: 0,
  },
  storyNoImagesCard: {
    width: '100%',
    minHeight: 356,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    borderWidth: 0,
    marginBottom: 16,
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
  storyDropdownWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
    marginBottom: 16,
    height: 70,
  },
  storyDropdownCardCollapsed: {
    width: '100%',
    height: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
    fontSize: 18,
    color: '#0F172A',
    marginRight: 10,
    letterSpacing: -0.3,
    fontWeight: '500',
    lineHeight: 25,
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
