'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { SendSvg } from '@/screens/feed/comment/_svg';
import { useDetailStore } from '../_state/useDetailStore';
import { createCommentLib } from '@/screens/feed/comment/_lib/createComment.lib';
import { updateCommentLib } from '@/screens/feed/comment/_lib/updateComment.lib';
import { useToastStore } from '@/_state/useToastStore';

export function DetailCommentInputAction() {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const showToast = useToastStore(state => state.showToast);

  const { postId, replyTarget, editTarget, setReplyTarget, setEditTarget } =
    useDetailStore(
      useShallow(state => ({
        postId: state.postId,
        replyTarget: state.replyTarget,
        editTarget: state.editTarget,
        setReplyTarget: state.setReplyTarget,
        setEditTarget: state.setEditTarget,
      })),
    );

  const [text, setText] = useState('');

  useEffect(() => {
    if (editTarget) {
      setText(editTarget.text);
    }
  }, [editTarget]);

  const activePostId = postId || '';

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: async ({
      commentText,
      parentId,
    }: {
      commentText: string;
      parentId?: string;
    }) => {
      if (editTarget) {
        return await updateCommentLib({
          commentId: editTarget.commentId,
          content: commentText,
        });
      }
      return await createCommentLib({
        postId: activePostId,
        content: commentText,
        parentId,
      });
    },
    onSuccess: () => {
      setText('');
      setReplyTarget(null);
      setEditTarget(null);
      queryClient.invalidateQueries({ queryKey: ['comments', activePostId] });
      queryClient.invalidateQueries({ queryKey: ['postDetail', activePostId] });
      queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
      showToast(editTarget ? '댓글이 수정되었습니다.' : '댓글이 등록되었습니다.');
    },
    onError: (err: any) => {
      console.error('Error submitting comment:', err);
      showToast(err?.message || '댓글 처리에 실패했습니다.');
    },
  });

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;

    submitComment({
      commentText: trimmed,
      parentId: replyTarget?.commentId,
    });
  };

  const handleCancelTarget = () => {
    setReplyTarget(null);
    setEditTarget(null);
    setText('');
  };

  const isButtonActive = text.trim().length > 0 && !isSubmitting;
  const bottomPadding = insets.bottom > 0 ? insets.bottom : 12;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.keyboardContainer}
    >
      {/* Target indicator banner */}
      {(replyTarget || editTarget) && (
        <View style={styles.targetIndicatorRow}>
          <Text style={styles.targetIndicatorText} numberOfLines={1}>
            {editTarget
              ? '댓글을 수정하는 중입니다'
              : `${replyTarget?.userName}님에게 답글 작성 중`}
          </Text>
          <TouchableOpacity
            onPress={handleCancelTarget}
            style={styles.targetCancelBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.targetCancelBtnText}>취소</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input row */}
      <View style={[styles.inputBarWrapper, { paddingBottom: bottomPadding }]}>
        <View style={styles.inputInnerContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={
              editTarget
                ? '수정할 댓글 내용을 입력해주세요'
                : replyTarget
                ? `${replyTarget.userName}님에게 답글 남기기...`
                : '따뜻한 한마디를 남겨주세요...'
            }
            placeholderTextColor="#94A3B8"
            value={text}
            onChangeText={setText}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              isButtonActive ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!isButtonActive}
            activeOpacity={0.8}
          >
            <SendSvg />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  targetIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE3E5',
  },
  targetIndicatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5D7B',
    flex: 1,
  },
  targetCancelBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  targetCancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  inputBarWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  inputInnerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  sendButtonActive: {
    backgroundColor: '#FF5D7B',
    opacity: 1,
  },
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
    opacity: 0.6,
  },
});
