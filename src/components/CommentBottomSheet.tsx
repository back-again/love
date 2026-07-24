import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Platform,
  Alert,
  KeyboardAvoidingView,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface ReplyItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
}

export interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
  isLiked?: boolean;
  replies?: ReplyItem[];
}

interface CommentBottomSheetProps {
  visible: boolean;
  postTitle?: string;
  comments?: CommentItem[];
  onClose: () => void;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    user: '익명1',
    text: 'PX 달팽이크림이랑 간식 챙겨준 거면 남친 나름대로 정성껏 준비한 거 같은데 너무 서운해하지 마요 ㅠㅠ',
    likes: 24,
    replies: [
      {
        id: 'r1-1',
        user: '익명5',
        text: '맞아요 달팽이크림 은근 비싸고 챙겨주기 쉽지 않은데 선물 상자 구성 예뻤음!',
        likes: 5,
      },
    ],
  },
  {
    id: 'c2',
    user: '익명2',
    text: '솔직히 생일선물로 PX 상품은 성의 없어 보이긴 함... 내 남친이었으면 솔직히 서운하다고 말했을 듯',
    likes: 42,
    replies: [],
  },
  {
    id: 'c3',
    user: '연애고수3',
    text: '남친 군인이나 곰신 아니면 PX 선물은 좀 ㅋㅋㅋ 평소에 서운했던 거 쌓인 건 없는지 잘 대화해보세요',
    likes: 18,
    replies: [],
  },
  {
    id: 'c4',
    user: '익명4',
    text: '서로 기대치가 달라서 그런 듯! 다음 생일엔 갖고 싶은 선물 미리 은근슬쩍 힌트 줘봐요~',
    likes: 9,
    replies: [],
  },
];

export default function CommentBottomSheet({
  visible,
  comments: initialComments = DEFAULT_COMMENTS,
  onClose,
}: CommentBottomSheetProps) {
  const [commentList, setCommentList] = useState<CommentItem[]>(initialComments);
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; userName: string } | null>(null);

  // 모바일 표준 Y축 이동 애니메이션 (translateY: 0 = 펼침, > 0 = 아래로 내려감)
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(0);
    if (visible) {
      setCommentList(initialComments);
    }
  }, [visible, initialComments]);

  const handleCloseWithAnim = () => {
    Animated.timing(translateY, {
      toValue: 600,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      translateY.setValue(0);
      onClose();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        } else {
          translateY.setValue(gestureState.dy * 0.25);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 80 || gestureState.vy > 0.5) {
          handleCloseWithAnim();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            stiffness: 350,
            damping: 25,
            mass: 0.7,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const backdropOpacity = translateY.interpolate({
    inputRange: [0, 300],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (!visible) return null;

  // 댓글 또는 대댓글 추가
  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    if (replyTarget) {
      // 대댓글 추가
      const newReply: ReplyItem = {
        id: 'r_' + Date.now(),
        user: '나(익명)',
        text: newCommentText.trim(),
        likes: 0,
      };

      setCommentList((prev) =>
        prev.map((item) => {
          if (item.id === replyTarget.commentId) {
            return {
              ...item,
              replies: [...(item.replies || []), newReply],
            };
          }
          return item;
        })
      );
      setReplyTarget(null);
    } else {
      // 일반 댓글 추가
      const newComment: CommentItem = {
        id: 'c_' + Date.now(),
        user: '나(익명)',
        text: newCommentText.trim(),
        likes: 0,
        replies: [],
      };
      setCommentList((prev) => [newComment, ...prev]);
    }

    setNewCommentText('');
  };

  // 댓글 따봉(좋아요) 토글
  const handleToggleCommentLike = (id: string) => {
    setCommentList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  // 대댓글 따봉(좋아요) 토글
  const handleToggleReplyLike = (commentId: string, replyId: string) => {
    setCommentList((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => {
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
      })
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={handleCloseWithAnim}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFillObject} onPress={handleCloseWithAnim} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoidingView}
        >
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY }] },
            ]}
          >
            {/* Dynamic Height Drag Handle Touch Zone */}
            <View style={styles.dragHandleZone} {...panResponder.panHandlers}>
              <View style={styles.handlePill} />
            </View>

            {/* Comments List (카드 없이 세련된 라인형 일렬 정렬 리스트) */}
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
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
                    {/* 댓글 헤더: 닉네임 */}
                    <Text style={styles.userNameText}>{item.user}</Text>

                  {/* 댓글 본문 */}
                  <Text style={styles.commentBodyText}>{item.text}</Text>

                  {/* 댓글 내용 바로 밑: 좌측(답글 달기) + 우측(좋아요 SVG 아이콘 + 수치) */}
                  <View style={styles.commentActionRow}>
                    <TouchableOpacity
                      style={styles.replyBtn}
                      onPress={() => setReplyTarget({ commentId: item.id, userName: item.user })}
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
                          stroke={item.isLiked ? '#FF8E7A' : '#9C9C9C'}
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text style={[styles.thumbCountText, item.isLiked && styles.thumbCountLiked]}>
                        {item.likes}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 대댓글 (Replies Nested List) */}
                  {item.replies && item.replies.length > 0 && (
                    <View style={styles.repliesWrapper}>
                      {item.replies.map((reply) => (
                        <View key={reply.id} style={styles.replyItemRow}>
                          <Text style={styles.userNameText}>{reply.user}</Text>
                          <Text style={styles.commentBodyText}>{reply.text}</Text>
                          <View style={styles.commentActionRow}>
                            <View />
                            <TouchableOpacity
                              style={styles.thumbLikeBtn}
                              onPress={() => handleToggleReplyLike(item.id, reply.id)}
                              activeOpacity={0.7}
                            >
                              <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                                <Path
                                  d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                                  stroke={reply.isLiked ? '#FF8E7A' : '#9C9C9C'}
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </Svg>
                              <Text style={[styles.thumbCountText, reply.isLiked && styles.thumbCountLiked]}>
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
            </ScrollView>

            {/* 답글 대상 인디케이터 바 (대댓글 작성 중일 때 표시) */}
            {replyTarget && (
              <View style={styles.replyTargetBar}>
                <Text style={styles.replyTargetText}>
                  <Text style={{ fontWeight: '700', color: '#FF8E7A' }}>@{replyTarget.userName}</Text> 님에게 답글 작성 중
                </Text>
                <TouchableOpacity onPress={() => setReplyTarget(null)} activeOpacity={0.7}>
                  <Text style={styles.replyCancelText}>취소</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Input Area for writing a new comment or reply */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder={
                  replyTarget
                    ? `@${replyTarget.userName} 님에게 답글 남기기...`
                    : '댓글을 입력하세요...'
                }
                placeholderTextColor="#BCBCBC"
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
                    stroke={newCommentText.trim() ? '#FFFFFF' : '#BCBCBC'}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  keyboardAvoidingView: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  // 모바일 Expo 환경 하단 붕 뜸 100% 원천 해결: position absolute, bottom 0, height 80%
  // 높이를 약간 내려 600px / 72% 수준으로 조절하여 차분하고 세련된 뷰 연출
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    height: 550,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    marginBottom: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  dragHandleZone: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ cursor: 'ns-resize' } as any) : {}),
  },
  handlePill: {
    width: 38,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#EBEBEB',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  // 카드로 감싸지 않는 선형 라인 아이템
  commentRowContainer: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
    gap: 4,
  },
  // 사용자이름과 댓글 본문 한 줄 나란히 일렬 나열
  commentContentInlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 8,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  commentBodyText: {
    fontSize: 14.5,
    color: '#334155',
    lineHeight: 21,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  // 아랫줄: 좌측(답글 달기) + 우측(좋아요 SVG 아이콘 + 수치)
  commentActionRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 2,
    paddingRight: 4,
    marginTop: 2,
  },
  thumbLikeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumbIcon: {
    fontSize: 14,
  },
  thumbCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9C9C9C',
  },
  thumbCountLiked: {
    color: '#FF8E7A',
  },
  replyBtn: {
    paddingVertical: 2,
  },
  replyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9C9C9C',
  },
  // 대댓글 들여쓰기 래퍼
  repliesWrapper: {
    width: '100%',
    paddingLeft: 14,
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#F1F5F9',
    gap: 12,
  },
  replyItemRow: {
    width: '100%',
    gap: 6,
  },
  replyTargetBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  replyTargetText: {
    fontSize: 13,
    color: '#334155',
  },
  replyCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9C9C9C',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8F8F8',
  },
  commentInput: {
    flex: 1,
    height: 46,
    backgroundColor: '#F8F8F8',
    borderRadius: 23,
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#0F172A',
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FF8E7A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
});
