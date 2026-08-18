'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ReplyItem as ReplyItemType } from '../_model/comment.model';
import { ThumbLikeSvg } from '../_svg';

interface ReplyItemProps {
  reply: ReplyItemType;
  onToggleLike: (params: { commentId: string; isLiked?: boolean }) => void;
  onEdit: (params: { commentId: string; text: string }) => void;
  onDelete: (commentId: string) => void;
}

export function ReplyItem({
  reply,
  onToggleLike,
  onEdit,
  onDelete,
}: ReplyItemProps) {
  return (
    <View style={styles.replyItemRow}>
      <View style={styles.commentHeaderRow}>
        <Text style={styles.userNameText}>{reply.user}</Text>
        {reply.votedChoice === 'O' && (
          <View style={styles.voteBadgeO}>
            <Text style={styles.voteBadgeTextO}>O</Text>
          </View>
        )}
        {reply.votedChoice === 'X' && (
          <View style={styles.voteBadgeX}>
            <Text style={styles.voteBadgeTextX}>X</Text>
          </View>
        )}
      </View>

      <Text style={styles.commentBodyText}>{reply.text}</Text>

      <View style={styles.commentActionRow}>
        <View style={styles.actionLeftGroup}>
          {reply.isMyComment && (
            <>
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() =>
                  onEdit({
                    commentId: reply.id,
                    text: reply.text,
                  })
                }
                activeOpacity={0.7}
              >
                <Text style={styles.replyBtnText}>수정</Text>
              </TouchableOpacity>
              <Text style={styles.actionDotDivider}>·</Text>
              <TouchableOpacity
                style={styles.replyBtn}
                onPress={() => onDelete(reply.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.replyBtnText, styles.deleteBtnText]}>
                  삭제
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.thumbLikeBtn}
          onPress={() =>
            onToggleLike({
              commentId: reply.id,
              isLiked: reply.isLiked,
            })
          }
          activeOpacity={0.7}
        >
          <ThumbLikeSvg color={reply.isLiked ? '#FF5E85' : '#BCBCBC'} />
          <Text
            style={[
              styles.thumbCountText,
              reply.isLiked && styles.thumbCountLiked,
            ]}
          >
            {reply.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  replyItemRow: {
    width: '100%',
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
  actionLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionDotDivider: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  replyBtn: {
    paddingVertical: 2,
  },
  replyBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  deleteBtnText: {
    color: '#EF4444',
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
});
