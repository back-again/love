'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Share,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useShallow } from 'zustand/react/shallow';
import { BottomSheetModal } from '@/components/modal/BottomSheetModal';
import { useCommentStore } from './_state/useCommentStore';
import { CommentItem, ReplyItem, VoteInfo } from './_model/comment.model';

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    user: '익명1',
    votedChoice: 'O',
    text: 'PX 달팽이크림이랑 간식 챙겨준 거면 남친 나름대로 정성껏 준비한 거 같은데 너무 서운해하지 마요 ㅠㅠ',
    likes: 126,
    replies: [
      {
        id: 'r1-1',
        user: '익명5',
        votedChoice: 'O',
        text: '맞아요 달팽이크림 은근 비싸고 챙겨주기 쉽지 않은데 선물 상자 구성 예뻤음!',
        likes: 15,
      },
    ],
  },
  {
    id: 'c2',
    user: '익명2',
    votedChoice: 'X',
    text: '솔직히 생일선물로 PX 상품은 성의 없어 보이긴 함... 내 남친이었으면 솔직히 서운하다고 말했을 듯',
    likes: 98,
    replies: [],
  },
  {
    id: 'c3',
    user: '익명3',
    votedChoice: 'X',
    text: '남친 군인이나 곰신 아니면 PX 선물은 좀 ㅋㅋㅋ 평소에 서운했던 거 쌓인 건 없는지 잘 대화해보세요',
    likes: 64,
    replies: [],
  },
  {
    id: 'c4',
    user: '익명4',
    votedChoice: 'O',
    text: '서로 기대치가 달라서 그런 듯! 다음 생일엔 갖고 싶은 선물 미리 은근슬쩍 힌트 줘봐요~',
    likes: 31,
    replies: [],
  },
];

export function CommentScreen() {
  const {
    visible,
    postTitle,
    voteInfo,
    comments: storeComments,
    closeComments,
  } = useCommentStore(
    useShallow(state => ({
      visible: state.visible,
      postTitle: state.postTitle,
      voteInfo: state.voteInfo,
      comments: state.comments,
      closeComments: state.closeComments,
    })),
  );

  const initialComments = storeComments ?? DEFAULT_COMMENTS;
  const [commentList, setCommentList] =
    useState<CommentItem[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    if (visible) {
      setCommentList(initialComments);
    }
  }, [visible, initialComments]);

  if (!visible) return null;

  const handleSharePost = async () => {
    const titleText = postTitle || '사연';
    const shareUrl = `https://oxlove.app/post/${encodeURIComponent(titleText)}`;

    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        Alert.alert(
          '사연 주소 복사',
          `클립보드에 사연 주소가 복사되었습니다!\n\n${shareUrl}`,
        );
      } else {
        Alert.alert('사연 주소', shareUrl);
      }
    } else {
      try {
        await Share.share({
          title: titleText,
          message: `[OXLOVE] "${titleText}" 사연 주소:\n${shareUrl}`,
          url: shareUrl,
        });
      } catch (e) {
        Alert.alert('사연 주소 복사', shareUrl);
      }
    }
  };

  const handleReviewRequest = () => {
    if (voteInfo?.hasReview) {
      Alert.alert(
        '작성자 후기',
        '작성자 후기: "남친과 솔직하게 대화해서 풀었습니다! 모두 투표 감사합니다."',
      );
    } else {
      Alert.alert(
        '후기 요청 완료 ✉️',
        `'${postTitle || '사연'}' 작성자에게 후기 작성 알림을 보냈습니다!`,
      );
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    if (replyTarget) {
      const totalReplyCount = commentList.reduce(
        (acc, cur) => acc + (cur.replies?.length || 0),
        0,
      );
      const nextNum = commentList.length + totalReplyCount + 1;
      const userVoted = voteInfo?.selectedVote || 'O';
      const newReply: ReplyItem = {
        id: 'r_' + Date.now(),
        user: `익명${nextNum}`,
        votedChoice: userVoted,
        text: newCommentText.trim(),
        likes: 0,
      };

      setCommentList(prev =>
        prev.map(item => {
          if (item.id === replyTarget.commentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newReply],
            };
          }
          return item;
        }),
      );
      setReplyTarget(null);
    } else {
      const totalReplyCount = commentList.reduce(
        (acc, cur) => acc + (cur.replies?.length || 0),
        0,
      );
      const nextNum = commentList.length + totalReplyCount + 1;
      const userVoted = voteInfo?.selectedVote || 'O';
      const newComment: CommentItem = {
        id: 'c_' + Date.now(),
        user: `익명${nextNum}`,
        votedChoice: userVoted,
        text: newCommentText.trim(),
        likes: 0,
        replies: [],
      };
      setCommentList(prev => [newComment, ...prev]);
    }

    setNewCommentText('');
  };

  const handleToggleCommentLike = (id: string) => {
    setCommentList(prev =>
      prev.map(c => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      }),
    );
  };

  const handleToggleReplyLike = (commentId: string, replyId: string) => {
    setCommentList(prev =>
      prev.map(c => {
        if (c.id === commentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => {
              if (r.id === replyId) {
                const isLiked = !r.isLiked;
                return {
                  ...r,
                  isLiked,
                  likes: isLiked ? r.likes + 1 : r.likes - 1,
                };
              }
              return r;
            }),
          };
        }
        return c;
      }),
    );
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={closeComments}
      snapPoints={['85%']}
    >
      <View style={styles.modalHeaderRow}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={closeComments}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18l-6-6 6-6"
              stroke="#0F172A"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.modalHeaderTitle}>댓글</Text>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={handleSharePost}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
              stroke="#0F172A"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.voteSectionCleanWrapper}>
        <TouchableOpacity
          onPress={handleReviewRequest}
          activeOpacity={0.88}
          style={styles.reviewGradientTouch}
        >
          <LinearGradient
            colors={['#FEEBED', '#FFFFFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reviewGradientContainer}
          >
            <View style={styles.reviewIconBadgeWhite}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Rect
                  x={3}
                  y={5}
                  width={18}
                  height={14}
                  rx={3}
                  stroke="#F9758D"
                  strokeWidth={2.2}
                />
                <Path
                  d="M4.5 7.5l7.5 5 7.5-5"
                  stroke="#F9758D"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={styles.reviewGradientButtonText}>
              {voteInfo?.hasReview
                ? '작성자의 후기 읽어보기'
                : '비슷한 고민을 겪고 있다면, 후기 요청하기'}
            </Text>
            <Text style={styles.reviewGradientArrow}>›</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.commentsSectionTitle}>댓글 {commentList.length}</Text>

      {commentList.map((item, idx) => {
        const isLast = idx === commentList.length - 1;

        return (
          <View
            key={item.id}
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
                  setReplyTarget({
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
                onPress={() => handleToggleCommentLike(item.id)}
                activeOpacity={0.7}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                    stroke={item.isLiked ? '#FF5E85' : '#BCBCBC'}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
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
                  <View key={reply.id} style={styles.replyItemRow}>
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
                      <View />
                      <TouchableOpacity
                        style={styles.thumbLikeBtn}
                        onPress={() =>
                          handleToggleReplyLike(item.id, reply.id)
                        }
                        activeOpacity={0.7}
                      >
                        <Svg
                          width={14}
                          height={14}
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <Path
                            d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                            stroke={reply.isLiked ? '#FF5E85' : '#BCBCBC'}
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
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
                ))}
              </View>
            )}
          </View>
        );
      })}

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
        <TextInput
          style={styles.commentInput}
          placeholder={
            replyTarget
              ? `@${replyTarget.userName} 님에게 답글 남기기...`
              : '댓글을 입력하세요...'
          }
          placeholderTextColor="#8F8F8F"
          value={newCommentText}
          onChangeText={setNewCommentText}
          onSubmitEditing={handleAddComment}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            !newCommentText.trim() && styles.sendBtnDisabled,
          ]}
          onPress={handleAddComment}
          disabled={!newCommentText.trim()}
          activeOpacity={0.8}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 19V5M5 12l7-7 7 7"
              stroke={newCommentText.trim() ? '#FFFFFF' : '#8F8F8F'}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  modalHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginBottom: 4,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerIconButton: {
    padding: 6,
  },
  voteSectionCleanWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  reviewGradientTouch: {
    width: '100%',
    borderRadius: 25,
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#FEB5C9',
  },
  reviewGradientContainer: {
    width: '100%',
    height: 50,
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  reviewIconBadgeWhite: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewGradientButtonText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#F9758D',
    letterSpacing: -0.2,
    flex: 1,
    marginLeft: 10,
  },
  reviewGradientArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F9758D',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginVertical: 12,
  },
  commentsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
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
  replyItemRow: {
    width: '100%',
    gap: 4,
  },
  replyTargetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  replyTargetText: {
    fontSize: 13,
    color: '#727272',
  },
  replyCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  commentInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#F5F5F5',
    borderRadius: 23,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FF3B6B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
});
