'use client';

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Platform,
  Alert,
  Share,
  KeyboardAvoidingView,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { ImageModal } from './modal/ImageModal';

export interface PostDetailModalProps {
  visible: boolean;
  post: {
    id: string;
    title: string;
    fullStory?: string;
    storySummary?: string;
    images?: string[];
    voteO: string;
    voteX: string;
    percentO?: number;
    percentX?: number;
    totalVotes?: number;
    hasReview?: boolean;
    myVote?: 'O' | 'X' | null;
  } | null;
  onClose: () => void;
  onOpenVoteResults: (postTitle: string, voteInfo: any) => void;
}

export interface CommentItem {
  id: string;
  user: string;
  votedChoice?: 'O' | 'X';
  text: string;
  likes: number;
  isLiked?: boolean;
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    user: '익명1',
    votedChoice: 'O',
    text: 'PX 달팽이크림이랑 간식 챙겨준 거면 남친 나름대로 정성껏 준비한 거 같은데 너무 서운해하지 마요 ㅠㅠ',
    likes: 126,
  },
  {
    id: 'c2',
    user: '익명2',
    votedChoice: 'X',
    text: '솔직히 생일선물로 PX 상품은 성의 없어 보이긴 함... 내 남친이었으면 솔직히 서운하다고 말했을 듯',
    likes: 98,
  },
  {
    id: 'c3',
    user: '익명3',
    votedChoice: 'X',
    text: '남친 군인이나 곰신 아니면 PX 선물은 좀 ㅋㅋㅋ 평소에 서운했던 거 쌓인 건 없는지 잘 대화해보세요',
    likes: 64,
  },
  {
    id: 'c4',
    user: '익명4',
    votedChoice: 'O',
    text: '서로 기대치가 달라서 그런 듯! 다음 생일엔 갖고 싶은 선물 미리 은근슬쩍 힌트 줘봐요~',
    likes: 31,
  },
];

export function PostDetailModal({
  visible,
  post,
  onClose,
  onOpenVoteResults,
}: PostDetailModalProps) {
  const [userVote, setUserVote] = useState<'O' | 'X' | null>(null);
  const [commentList, setCommentList] = useState<CommentItem[]>(DEFAULT_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [imageModal, setImageModal] = useState<{ visible: boolean; index: number }>({
    visible: false,
    index: 0,
  });

  useEffect(() => {
    if (post) {
      setUserVote(post.myVote || null);
    }
  }, [post]);

  if (!visible || !post) return null;

  const isSelectedO = userVote === 'O';
  const isSelectedX = userVote === 'X';

  const handleVoteAction = (choice: 'O' | 'X') => {
    setUserVote(choice);
    const baseTotal = post.totalVotes || 643;
    const basepO = post.percentO ?? 60;
    const basepX = post.percentX ?? 40;

    let total = baseTotal + 1;
    let pO = basepO;
    let pX = basepX;

    if (choice === 'O') {
      pO = Math.min(99, basepO + 1);
      pX = 100 - pO;
    } else {
      pX = Math.min(99, basepX + 1);
      pO = 100 - pX;
    }

    // Close detail modal and open existing CommentBottomSheet with live results!
    onClose();
    onOpenVoteResults(post.title, {
      selectedVote: choice,
      voteOText: post.voteO,
      voteXText: post.voteX,
      percentO: pO,
      percentX: pX,
      totalVotes: total,
      hasReview: post.hasReview,
    });
  };

  const handleSharePost = async () => {
    const titleText = post.title;
    const shareUrl = `https://oxlove.app/post/${post.id}`;

    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        Alert.alert('사연 주소 복사', `클립보드에 복사되었습니다!\n\n${shareUrl}`);
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
    if (post.hasReview) {
      Alert.alert('작성자 후기', '작성자 후기: "남친과 솔직하게 대화해서 잘 풀었습니다! 모두 투표 감사합니다."');
    } else {
      Alert.alert('후기 요청 완료 ✉️', `'${post.title}' 작성자에게 후기 요청 알림을 보냈습니다!`);
    }
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: 'c_' + Date.now(),
      user: `익명${commentList.length + 1}`,
      votedChoice: userVote || 'O',
      text: newCommentText.trim(),
      likes: 0,
    };

    setCommentList(prev => [newComment, ...prev]);
    setNewCommentText('');
  };

  const handleToggleLike = (id: string) => {
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
      })
    );
  };

  const fullText = post.fullStory || post.storySummary || '';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Header Bar */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerBtn} onPress={onClose} activeOpacity={0.8}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path d="M15 18l-6-6 6-6" stroke="#727272" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>

          <Text style={styles.headerCategoryText}>연애 · 5분 전</Text>

          <TouchableOpacity style={styles.headerBtn} onPress={handleSharePost} activeOpacity={0.8}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#727272" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Post Title */}
          <Text style={styles.postTitle}>{post.title}</Text>

          {/* Post Full Story Text */}
          {fullText ? (
            <Text style={styles.fullStoryText}>{fullText}</Text>
          ) : null}

          {/* High-Res Photo Gallery */}
          {post.images && post.images.length > 0 && (
            <View style={styles.imageGalleryContainer}>
              {post.images.map((imgUri, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.galleryImageCard}
                  onPress={() => setImageModal({ visible: true, index: idx })}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: imgUri }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Voting Action Section */}
          <View style={styles.voteSectionCard}>
            <Text style={styles.voteSectionTitle}>투표에 참여해보세요!</Text>

            <View style={styles.voteBtnRow}>
              {/* O Button */}
              <TouchableOpacity
                style={[
                  styles.voteBtnO,
                  isSelectedO && styles.voteBtnOSelected,
                ]}
                onPress={() => handleVoteAction('O')}
                activeOpacity={0.85}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Circle
                    cx={12}
                    cy={12}
                    r={9}
                    stroke={isSelectedO ? '#FFFFFF' : '#A855F7'}
                    strokeWidth={3}
                    fill="none"
                  />
                </Svg>
                <Text
                  style={[
                    styles.voteBtnTextO,
                    isSelectedO && styles.voteBtnTextSelected,
                  ]}
                >
                  {post.voteO}
                </Text>
              </TouchableOpacity>

              {/* X Button */}
              <TouchableOpacity
                style={[
                  styles.voteBtnX,
                  isSelectedX && styles.voteBtnXSelected,
                ]}
                onPress={() => handleVoteAction('X')}
                activeOpacity={0.85}
              >
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M18 6L6 18M6 6l12 12"
                    stroke={isSelectedX ? '#FFFFFF' : '#FF4D7B'}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                </Svg>
                <Text
                  style={[
                    styles.voteBtnTextX,
                    isSelectedX && styles.voteBtnTextSelected,
                  ]}
                >
                  {post.voteX}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lock Banner informing user to vote to view bottom sheet results */}
          <View style={styles.lockedBannerCard}>
            <Text style={styles.lockedBannerIcon}>🔒</Text>
            <Text style={styles.lockedBannerTitle}>
              투표에 참여하면 결과와 댓글을 볼 수 있어요!
            </Text>
            <Text style={styles.lockedBannerSub}>
              위의 O 또는 X 버튼을 눌러 당신의 의견을 들려주세요.
            </Text>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>

      <ImageModal
        visible={imageModal.visible}
        images={post.images || []}
        initialIndex={imageModal.index}
        onClose={() => setImageModal({ visible: false, index: 0 })}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
  headerRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCategoryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8F8F8F',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  fullStoryText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1E293B',
    lineHeight: 24,
    marginBottom: 20,
  },
  imageGalleryContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  galleryImageCard: {
    width: '100%',
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  voteSectionCard: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  voteSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    textAlign: 'center',
  },
  voteBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  voteBtnO: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
    borderColor: '#A855F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  voteBtnOSelected: {
    backgroundColor: '#A855F7',
    borderColor: '#A855F7',
  },
  voteBtnTextO: {
    fontSize: 16,
    fontWeight: '800',
    color: '#A855F7',
  },
  voteBtnX: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFE5EC',
    borderWidth: 2,
    borderColor: '#FF4D7B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  voteBtnXSelected: {
    backgroundColor: '#FF4D7B',
    borderColor: '#FF4D7B',
  },
  voteBtnTextX: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF4D7B',
  },
  voteBtnTextSelected: {
    color: '#FFFFFF',
  },
  lockedBannerCard: {
    width: '100%',
    backgroundColor: '#FFF7ED',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  lockedBannerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  lockedBannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#C2410C',
    marginBottom: 4,
    textAlign: 'center',
  },
  lockedBannerSub: {
    fontSize: 13,
    fontWeight: '500',
    color: '#EA580C',
    textAlign: 'center',
  },
  unlockedResultsContainer: {
    width: '100%',
  },
  voteSectionCleanWrapper: {
    width: '100%',
    marginVertical: 10,
  },
  topPercentRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  percentNumberPurple: {
    fontSize: 26,
    fontWeight: '900',
    color: '#A855F7',
  },
  percentNumberPink: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF4D7B',
  },
  unselectedTextPurple: {
    color: '#C084FC',
  },
  unselectedTextPink: {
    color: '#FFA6BC',
  },
  votersCountTextCenter: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8F8F8F',
  },
  singleLinearTrack: {
    width: '100%',
    height: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 7,
    flexDirection: 'row',
    overflow: 'hidden',
    marginVertical: 6,
  },
  linearFillO: {
    height: '100%',
    backgroundColor: '#A855F7',
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  linearFillOUnselected: {
    backgroundColor: '#F3E8FF',
  },
  linearFillX: {
    height: '100%',
    backgroundColor: '#F9758D',
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  linearFillXUnselected: {
    backgroundColor: '#FEEBED',
  },
  bottomWordingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 14,
  },
  percentLabelPurple: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A855F7',
  },
  percentLabelPink: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9758D',
  },
  reviewGradientTouch: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    marginTop: 10,
  },
  reviewGradientContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  reviewGradientArrow: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionDivider: {
    height: 8,
    backgroundColor: '#F5F5F5',
    marginHorizontal: -20,
    marginVertical: 20,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  commentRowContainer: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  voteBadgeO: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voteBadgeTextO: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A855F7',
  },
  voteBadgeX: {
    backgroundColor: '#FEEBED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  voteBadgeTextX: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F9758D',
  },
  commentBodyText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeTouchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCountText: {
    fontSize: 13,
    color: '#8F8F8F',
    fontWeight: '600',
  },
  likeCountTextActive: {
    color: '#F9758D',
  },
  inputBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  commentTextInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#0F172A',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#F9758D',
  },
  sendButtonDisabled: {
    backgroundColor: '#F5F5F5',
  },
});
