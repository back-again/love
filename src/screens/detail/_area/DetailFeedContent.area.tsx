'use client';

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '@/screens/feed/_model/feed.model';
import { formatTimeAgo } from '@/screens/feed/_lib/formatTimeAgo.lib';
import { VoteButton } from '@/screens/feed/_component/FeedItem/VoteButton';
import { ResultBar } from '@/screens/feed/_component/FeedItem/ResultBar';
import { VoteStatsSvg } from '@/screens/feed/_svg';
import { submitVoteLib } from '@/screens/feed/_lib/submitVote.lib';
import { useFeedStore } from '@/screens/feed/_state/useFeedStore';
import { DetailReviewHandler } from '../_handler/DetailReview.handler';

interface DetailFeedContentAreaProps {
  post: Post;
  myVote: 'O' | 'X' | null;
}

export function DetailFeedContentArea({ post, myVote }: DetailFeedContentAreaProps) {
  const queryClient = useQueryClient();
  const openImageModal = useFeedStore(state => state.openImageModal);

  const totalVotes = (post.voteOCount ?? 0) + (post.voteXCount ?? 0);
  const percentO =
    totalVotes > 0
      ? Math.round(((post.voteOCount ?? 0) / totalVotes) * 100)
      : 50;
  const percentX = 100 - percentO;

  const { mutate: vote } = useMutation({
    mutationFn: async (choice: 'O' | 'X') => {
      return submitVoteLib(post.id, choice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postDetail', post.id] });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
    },
  });

  const handleVote = (choice: 'O' | 'X') => {
    if (myVote) return;
    vote(choice);
  };

  const handleImageClick = (index: number) => {
    openImageModal(post.images, index);
  };

  return (
    <View style={styles.container}>
      {/* Top Meta: Category + Time */}
      <View style={styles.topMetaRow}>
        <View style={styles.categoryBadgePill}>
          <Text style={styles.categoryBadgeText}>{post.category}</Text>
        </View>
        <Text style={styles.timeText}>{formatTimeAgo(post.createdAt)}</Text>
      </View>

      {/* Question Title */}
      <Text style={styles.titleText}>{post.title}</Text>

      {/* Detail Content */}
      {Boolean(post.content) && (
        <Text style={styles.contentText}>{post.content}</Text>
      )}

      {/* Image Attachments */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {post.images.map((imgUrl, idx) => (
            <TouchableOpacity
              key={`${imgUrl}-${idx}`}
              onPress={() => handleImageClick(idx)}
              activeOpacity={0.85}
              style={styles.imageWrap}
            >
              <Image
                source={{ uri: imgUrl }}
                style={styles.imageThumbnail}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Vote Section */}
      <View style={styles.voteSection}>
        <View style={styles.voteBarStack}>
          {myVote ? (
            <>
              <ResultBar
                choice="O"
                content={post.voteO}
                percent={percentO}
                isSelected={myVote === 'O'}
              />
              <ResultBar
                choice="X"
                content={post.voteX}
                percent={percentX}
                isSelected={myVote === 'X'}
              />
            </>
          ) : (
            <>
              <VoteButton
                choice="O"
                content={post.voteO}
                onPress={() => handleVote('O')}
              />
              <VoteButton
                choice="X"
                content={post.voteX}
                onPress={() => handleVote('X')}
              />
            </>
          )}
        </View>

        {/* Total Votes Count */}
        <View style={styles.voteStatsRow}>
          <VoteStatsSvg />
          <Text style={styles.voteStatsText}>
            총 {totalVotes.toLocaleString()}명 투표
          </Text>
        </View>
      </View>

      {/* Review Section (Review Card / Write Prompt / Request Review) */}
      <DetailReviewHandler post={post} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryBadgePill: {
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5D7B',
  },
  timeText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  titleText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 27,
    letterSpacing: -0.4,
    marginBottom: 12,
  },
  contentText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 24,
    letterSpacing: -0.3,
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  imageWrap: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  imageThumbnail: {
    width: '100%',
    height: '100%',
  },
  voteSection: {
    marginTop: 4,
  },
  voteBarStack: {
    gap: 8,
    marginBottom: 12,
  },
  voteStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'flex-end',
  },
  voteStatsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
