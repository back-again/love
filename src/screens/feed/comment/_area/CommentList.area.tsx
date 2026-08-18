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
import { useCommentStore } from '../_state/useCommentStore';
import { useToastStore } from '@/_state/useToastStore';
import { getCommentsLib } from '../_lib/getComments.lib';
import { toggleCommentLikeLib } from '../_lib/toggleCommentLike.lib';
import { deleteCommentLib } from '../_lib/deleteComment.lib';
import { CommentItem as CommentItemType } from '../_model/comment.model';
import { CommentItem } from '../_component/CommentItem';

export function CommentListArea() {
  const queryClient = useQueryClient();
  const showToast = useToastStore(state => state.showToast);

  const { visible, targetPost, setReplyTarget, setEditTarget } = useCommentStore(
    useShallow(state => ({
      visible: state.visible,
      targetPost: state.targetPost,
      setReplyTarget: state.setReplyTarget,
      setEditTarget: state.setEditTarget,
    })),
  );

  const postId = targetPost?.id || '';

  const { data: fetchedComments = [], isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsLib({ postId }),
    enabled: Boolean(visible && postId),
  });

  const { mutate: deleteComment } = useMutation({
    mutationFn: async (commentId: string) => {
      await deleteCommentLib({ commentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
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
      await queryClient.cancelQueries({ queryKey: ['comments', postId] });

      const previousComments = queryClient.getQueryData<CommentItemType[]>([
        'comments',
        postId,
      ]);

      if (previousComments) {
        queryClient.setQueryData<CommentItemType[]>(
          ['comments', postId],
          old =>
            old?.map(item => {
              if (item.id === commentId) {
                const nextIsLiked = !isLiked;
                const nextLikes = nextIsLiked
                  ? item.likes + 1
                  : Math.max(0, item.likes - 1);
                return {
                  ...item,
                  isLiked: nextIsLiked,
                  likes: nextLikes,
                };
              }
              if (item.replies && item.replies.length > 0) {
                const updatedReplies = item.replies.map(reply => {
                  if (reply.id === commentId) {
                    const nextIsLiked = !isLiked;
                    const nextLikes = nextIsLiked
                      ? reply.likes + 1
                      : Math.max(0, reply.likes - 1);
                    return {
                      ...reply,
                      isLiked: nextIsLiked,
                      likes: nextLikes,
                    };
                  }
                  return reply;
                });
                return {
                  ...item,
                  replies: updatedReplies,
                };
              }
              return item;
            }) || [],
        );
      }

      return { previousComments };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', postId],
          context.previousComments,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  return (
    <View style={styles.listContainer}>
      <Text style={styles.commentsSectionTitle}>
        댓글 {fetchedComments.length}
      </Text>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color="#FF8E7A" />
        </View>
      ) : fetchedComments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitleText}>아직 작성된 댓글이 없어요</Text>
          <Text style={styles.emptySubText}>
            첫번째로 솔직한 생각을 남겨보세요!
          </Text>
        </View>
      ) : (
        fetchedComments.map((item, idx) => (
          <CommentItem
            key={item.id}
            item={item}
            isLast={idx === fetchedComments.length - 1}
            onReply={setReplyTarget}
            onToggleLike={toggleLike}
            onEdit={setEditTarget}
            onDelete={handleDeleteComment}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    paddingBottom: 16,
  },
  loadingBox: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    width: '100%',
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyTitleText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptySubText: {
    fontSize: 13,
    color: '#8F8F8F',
  },
  commentsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
});
