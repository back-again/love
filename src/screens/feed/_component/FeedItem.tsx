'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { MoreOptionsSvg, VoteStatsSvg, CommentCountSvg } from '../_svg';
import { Post } from '../_model/feed.model';
import { useVoteMutation } from '../_state/useVoteMutation';
import { useToastStore } from '@/_state/useToastStore';
import { formatTimeAgo } from '../_lib/formatTimeAgo.lib';

import { VoteButton } from './FeedItem/VoteButton';
import { ResultBar } from './FeedItem/ResultBar';

interface FeedItemProps {
  post: Post;
  myVote?: 'O' | 'X' | null;
  isHot?: boolean;
  onOpenImageModal?: (images: string[], index: number) => void;
  onOpenPostOptions?: (post: Post) => void;
  onOpenComments?: (post: Post) => void;
}

export function FeedItem({
  post,
  myVote = null,
  isHot,
  onOpenImageModal,
  onOpenPostOptions,
  onOpenComments,
}: FeedItemProps) {
  const { mutate: vote } = useVoteMutation();

  const totalVotes = (post.voteOCount ?? 0) + (post.voteXCount ?? 0);
  const percentO =
    totalVotes > 0
      ? Math.round(((post.voteOCount ?? 0) / totalVotes) * 100)
      : 50;
  const percentX = 100 - percentO;

  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardVote = (choice: 'O' | 'X') => {
    if (myVote) return;

    vote({ postId: post.id, choice });
  };

  const handleImageClick = (index: number) => {
    onOpenImageModal?.(post.images, index);
  };

  const handleOpenComments = () => {
    if (!myVote) {
      useToastStore.showToast(
        '💡 소신 있는 투표를 위해, 투표 후 댓글이 열려요!',
      );
      return;
    }

    onOpenComments?.(post);
  };

  return (
    <View style={styles.cardPageWrapper}>
      <View style={styles.cardContainer}>
        <View style={styles.topMetaRow}>
          <View style={styles.badgeChipsContainer}>
            {isHot && (
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
              onOpenPostOptions?.(post);
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
          <Text style={styles.questionTitle}>{(post.title || '').trim()}</Text>
          {post.content ? (
            <Text
              style={styles.storyPreviewText}
              numberOfLines={isExpanded ? undefined : 3}
              ellipsizeMode="tail"
            >
              {post.content.trim()}
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

        {!myVote ? (
          <View style={styles.votedResultsContainer}>
            <FeedItem.VoteButton
              choice="O"
              content={post.voteO}
              onPress={() => handleCardVote('O')}
            />
            <FeedItem.VoteButton
              choice="X"
              content={post.voteX}
              onPress={() => handleCardVote('X')}
            />
          </View>
        ) : (
          <View style={styles.votedResultsContainer}>
            <FeedItem.ResultBar
              choice="O"
              content={post.voteO}
              percent={percentO}
              isSelected={myVote === 'O'}
            />
            <FeedItem.ResultBar
              choice="X"
              content={post.voteX}
              percent={percentX}
              isSelected={myVote === 'X'}
            />
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
              handleOpenComments();
            }}
            activeOpacity={0.7}
          >
            <CommentCountSvg />
            <Text style={styles.statRightText}>{post.commentCount}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

FeedItem.VoteButton = VoteButton;
FeedItem.ResultBar = ResultBar;

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
    fontWeight: '700',
    color: '#FF5D7B',
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
  storyClickArea: {
    width: '100%',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'left',
    lineHeight: 25,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  storyPreviewText: {
    fontSize: 14,
    color: '#727272',
    lineHeight: 20,
    marginBottom: 10,
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
  votedResultsContainer: {
    width: '100%',
    gap: 10,
    marginBottom: 14,
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
    color: '#727272',
  },
});
