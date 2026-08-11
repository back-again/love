'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CommentItem as CommentItemType } from '../_model/comment.model';
import { ThumbLikeSvg } from '../_svg';
import { ReplyItem } from './ReplyItem';

interface CommentItemProps {
  item: CommentItemType;
  isLast?: boolean;
  onReply: (target: { commentId: string; userName: string }) => void;
  onToggleLike: (params: { commentId: string; isLiked?: boolean }) => void;
}

export function CommentItem({
  item,
  isLast,
  onReply,
  onToggleLike,
}: CommentItemProps) {
  return (
    <View
      style={[
        styles.commentRowContainer,
        isLast && { borderBottomWidth: 0 },
      ]}
    >
      <View style={styles.commentHeaderRow}>
        <Text style={styles.userNameText}>{item.user}</Text>
        {item.votedChoice === 'O' && (
          <View style={styles.voteBadgeO}>
            <Text style={styles.voteBadgeTextO}>O</Text>
          </View>
        )}
        {item.votedChoice === 'X' && (
          <View style={styles.voteBadgeX}>
            <Text style={styles.voteBadgeTextX}>X</Text>
          </View>
        )}
      </View>

      <Text style={styles.commentBodyText}>{item.text}</Text>

      <View style={styles.commentActionRow}>
        <TouchableOpacity
          style={styles.replyBtn}
          onPress={() =>
            onReply({
              commentId: item.id,
              userName: item.user,
            })
          }
          activeOpacity={0.7}
        >
          <Text style={styles.replyBtnText}>답글 달기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.thumbLikeBtn}
          onPress={() =>
            onToggleLike({ commentId: item.id, isLiked: item.isLiked })
          }
          activeOpacity={0.7}
        >
          <ThumbLikeSvg color={item.isLiked ? '#FF5E85' : '#BCBCBC'} />
          <Text
            style={[
              styles.thumbCountText,
              item.isLiked && styles.thumbCountLiked,
            ]}
          >
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>

      {item.replies && item.replies.length > 0 && (
        <View style={styles.repliesWrapper}>
          {item.replies.map(reply => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onToggleLike={onToggleLike}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  commentRowContainer: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    gap: 4,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  voteBadgeO: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E3CCFF',
  },
  voteBadgeTextO: {
    fontSize: 11,
    fontWeight: '900',
    color: '#AA6CFF',
  },
  voteBadgeX: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFE5EC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFC8D6',
  },
  voteBadgeTextX: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FF5E85',
  },
  commentBodyText: {
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 21,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  commentActionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 4,
    marginTop: 2,
  },
  replyBtn: {
    paddingVertical: 2,
  },
  replyBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  thumbLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumbCountText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  thumbCountLiked: {
    color: '#F9758D',
  },
  repliesWrapper: {
    width: '100%',
    paddingLeft: 14,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E8E8E8',
    gap: 10,
  },
});
