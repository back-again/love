'use client';

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { useDetailStore } from '../_state/useDetailStore';
import { useToastStore } from '@/_state/useToastStore';
import { getCommentsLib } from '@/screens/feed/comment/_lib/getComments.lib';
import { toggleCommentLikeLib } from '@/screens/feed/comment/_lib/toggleCommentLike.lib';
import { deleteCommentLib } from '@/screens/feed/comment/_lib/deleteComment.lib';
import { CommentItem as CommentItemType } from '@/screens/feed/comment/_model/comment.model';
import { CommentItem } from '@/screens/feed/comment/_component/CommentItem';

interface DetailCommentListAreaProps {
  postAuthorId?: string;
}

export function DetailCommentListArea({ postAuthorId }: DetailCommentListAreaProps) {
  const queryClient = useQueryClient();
  const showToast = useToastStore(state => state.showToast);

  const { postId, setReplyTarget, setEditTarget } = useDetailStore(
    useShallow(state => ({
      postId: state.postId,
      setReplyTarget: state.setReplyTarget,
      setEditTarget: state.setEditTarget,
    })),
  );

  const activePostId = postId || '';

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', activePostId],
    queryFn: () => getCommentsLib({ postId: activePostId, postAuthorId }),
    enabled: Boolean(activePostId),
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteCommentLib({ commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', activePostId] });
      queryClient.invalidateQueries({ queryKey: ['postDetail', activePostId] });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      showToast('댓글이 삭제되었습니다.');
    },
    onError: () => {
      showToast('댓글 삭제에 실패했습니다.');
    },
  });

  const handleDeleteComment = (commentId: string) => {
    Alert.alert('댓글 삭제', '댓글을 정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => deleteComment(commentId),
      },
    ]);
  };

  const { mutate: toggleLike } = useMutation({
    mutationFn: async ({
      commentId,
      isLiked,
    }: {
      commentId: string;
      isLiked?: boolean;
    }) => {
      await toggleCommentLikeLib({ commentId, isLiked: Boolean(isLiked) });
    },
    onMutate: async ({ commentId, isLiked }) => {
      await queryClient.cancelQueries({
        queryKey: ['comments', activePostId],
      });
      const previousComments = queryClient.getQueryData<CommentItemType[]>([
        'comments',
        activePostId,
      ]);

      if (previousComments) {
        queryClient.setQueryData<CommentItemType[]>(
          ['comments', activePostId],
          old => {
            if (!old) return [];
            return old.map(c => {
              if (c.id === commentId) {
                return {
                  ...c,
                  isLiked: !isLiked,
                  likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
                };
              }
              if (c.replies) {
                return {
                  ...c,
                  replies: c.replies.map(r => {
                    if (r.id === commentId) {
                      return {
                        ...r,
                        isLiked: !isLiked,
                        likes: isLiked ? Math.max(0, r.likes - 1) : r.likes + 1,
                      };
                    }
                    return r;
                  }),
                };
              }
              return c;
            });
          },
        );
      }
      return { previousComments };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', activePostId],
          context.previousComments,
        );
      }
      showToast('좋아요 처리에 실패했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', activePostId] });
    },
  });

  const totalCommentCount = comments.reduce(
    (acc, cur) => acc + 1 + (cur.replies ? cur.replies.length : 0),
    0,
  );

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>댓글</Text>
        <Text style={styles.commentCountText}>{totalCommentCount}</Text>
      </View>

      {/* Loading state */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FF5D7B" />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>첫 번째 댓글을 남겨보세요!</Text>
        </View>
      ) : (
        <View style={styles.commentsList}>
          {comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              item={comment}
              isLast={index === comments.length - 1}
              onReply={target => setReplyTarget(target)}
              onEdit={target => setEditTarget(target)}
              onDelete={handleDeleteComment}
              onToggleLike={toggleLike}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  commentCountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF5D7B',
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  commentsList: {
    width: '100%',
  },
});
