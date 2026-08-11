'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useShallow } from 'zustand/react/shallow';
import { SendSvg } from '../_svg';
import { useCommentStore } from '../_state/useCommentStore';
import { createCommentLib } from '../_lib/createComment.lib';

export function CommentInputArea() {
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardOpen(true),
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardOpen(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const { targetPost, replyTarget, setReplyTarget } = useCommentStore(
    useShallow(state => ({
      targetPost: state.targetPost,
      replyTarget: state.replyTarget,
      setReplyTarget: state.setReplyTarget,
    })),
  );

  const postId = targetPost?.id || '';
  const [newCommentText, setNewCommentText] = useState('');

  const { mutate: submitComment, isPending: isSubmitting } = useMutation({
    mutationFn: async ({
      text,
      parentId,
    }: {
      text: string;
      parentId?: string | null;
    }) => {
      if (!postId) return;
      const userVoted = targetPost?.myVote || 'O';
      await createCommentLib({
        postId,
        content: text,
        parentId,
        votedChoice: userVoted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewCommentText('');
      setReplyTarget(null);
    },
  });

  const handleAddComment = () => {
    if (!newCommentText.trim() || isSubmitting) return;

    submitComment({
      text: newCommentText.trim(),
      parentId: replyTarget?.commentId ?? null,
    });
  };

  const dynamicPaddingBottom = isKeyboardOpen
    ? 12
    : Math.max(insets.bottom, 12);

  return (
    <View
      style={[
        styles.inputAreaWrapper,
        { paddingBottom: dynamicPaddingBottom },
      ]}
    >
      {replyTarget && (
        <View style={styles.replyTargetBar}>
          <Text style={styles.replyTargetText}>
            <Text style={{ fontWeight: '700', color: '#FF3B6B' }}>
              @{replyTarget.userName}
            </Text>{' '}
            님에게 답글 작성 중
          </Text>
          <TouchableOpacity
            onPress={() => setReplyTarget(null)}
            activeOpacity={0.7}
          >
            <Text style={styles.replyCancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <BottomSheetTextInput
          style={styles.commentInput}
          placeholder={
            replyTarget
              ? `@${replyTarget.userName} 님에게 답글 남기기...`
              : '댓글을 입력하세요...'
          }
          placeholderTextColor="#94A3B8"
          value={newCommentText}
          onChangeText={setNewCommentText}
          onSubmitEditing={handleAddComment}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            newCommentText.trim() && !isSubmitting
              ? styles.sendBtnActive
              : styles.sendBtnDisabled,
          ]}
          onPress={handleAddComment}
          disabled={!newCommentText.trim() || isSubmitting}
          activeOpacity={0.8}
        >
          <SendSvg color={newCommentText.trim() ? '#FFFFFF' : '#94A3B8'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputAreaWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  replyTargetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
  },
  replyTargetText: {
    fontSize: 13,
    color: '#64748B',
  },
  replyCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  commentInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#F8FAFC',
    borderRadius: 23,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#FF3B6B',
  },
  sendBtnDisabled: {
    backgroundColor: '#F1F5F9',
  },
});
