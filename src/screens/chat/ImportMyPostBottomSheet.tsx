import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '@/api/supabase';

export interface PostItemData {
  id: string;
  title: string;
  storySummary?: string;
  fullStory?: string;
  voteO?: string;
  voteX?: string;
  percentO?: number;
  percentX?: number;
  totalVotes?: number;
  category?: string;
  topComments?: Array<{ nickname?: string; text: string }>;
}

interface ImportMyPostBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelectPost: (post: PostItemData) => void;
}

// Sample fallback posts if DB is empty
const SAMPLE_MY_POSTS: PostItemData[] = [
  {
    id: 'post-1',
    title: '최애 유튜버',
    fullStory: '익명의 화해님이 하나 골라달래요. 여러분 최애 유튜버 있으신가요?',
    voteO: '있다',
    voteX: '없다',
    percentO: 67,
    percentX: 33,
    totalVotes: 12,
    category: '솔로',
    topComments: [
      { nickname: '익명1', text: '침착맨 유튜브가 역시 짱이지!!' },
      { nickname: '익명2', text: '요즘 숏박스 재밌음' },
    ],
  },
  {
    id: 'post-2',
    title: '하트시그널',
    fullStory: '익명의 화해님이 하나 골라달래요. 하트시그널 정주행 하시나요?',
    voteO: '본다',
    voteX: '안본다',
    percentO: 50,
    percentX: 50,
    totalVotes: 8,
    category: '연애',
    topComments: [
      { nickname: '익명3', text: '시즌4 너무 재밌어요 ㅋㅋㅋ' },
    ],
  },
];

export function ImportMyPostBottomSheet({
  visible,
  onClose,
  onSelectPost,
}: ImportMyPostBottomSheetProps) {
  const [userPosts, setUserPosts] = useState<PostItemData[]>(SAMPLE_MY_POSTS);

  useEffect(() => {
    if (visible) {
      // Fetch posts from Supabase DB
      const fetchPosts = async () => {
        try {
          const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const formatted: PostItemData[] = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              fullStory: item.content,
              voteO: item.vote_o || '괜찮은데?',
              voteX: item.vote_x || '난 싫어',
              percentO: 60,
              percentX: 40,
              totalVotes: item.votes_o + item.votes_x || 10,
              category: item.category || '고민',
              topComments: [
                { nickname: '익명1', text: '다들 비슷한 고민 하더라구요!' },
                { nickname: '익명2', text: '솔직히 대화해보는 게 제일 좋아 보여요.' },
              ],
            }));
            setUserPosts(formatted);
          }
        } catch (e) {
          console.warn('Failed to fetch user posts for chat import:', e);
        }
      };
      fetchPosts();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheetCard}>
              {/* Sheet Header */}
              <View style={styles.sheetHeader}>
                <View style={styles.handleBar} />
                <Text style={styles.sheetTitle}>내 고민 사연 가져오기</Text>
                <Text style={styles.sheetSub}>
                  작성하신 사연과 유저들의 투표/댓글 반응을 AI가 종합 분석해 드립니다.
                </Text>
              </View>

              {/* Posts Scroll Area */}
              <ScrollView
                style={styles.postsScroll}
                contentContainerStyle={styles.postsContainer}
                showsVerticalScrollIndicator={false}
              >
                {userPosts.map(post => (
                  <TouchableOpacity
                    key={post.id}
                    style={styles.postCardItem}
                    onPress={() => {
                      onSelectPost(post);
                      onClose();
                    }}
                    activeOpacity={0.85}
                  >
                    <View style={styles.cardMetaRow}>
                      <View style={styles.categoryChip}>
                        <Text style={styles.categoryChipText}>{post.category || '고민'}</Text>
                      </View>
                      <Text style={styles.totalVotesText}>
                        투표 {post.totalVotes || 12}명 참여
                      </Text>
                    </View>

                    <Text style={styles.postCardTitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                    <Text style={styles.postCardStory} numberOfLines={2}>
                      {post.fullStory || post.storySummary}
                    </Text>

                    {/* Vote Ratio Summary Badge */}
                    <View style={styles.voteRatioRow}>
                      <View style={styles.badgePillO}>
                        <Text style={styles.badgeTextO}>
                          O {post.voteO}: {post.percentO ?? 60}%
                        </Text>
                      </View>
                      <View style={styles.badgePillX}>
                        <Text style={styles.badgeTextX}>
                          X {post.voteX}: {post.percentX ?? 40}%
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    color: '#8F8F8F',
    textAlign: 'center',
  },
  postsScroll: {
    maxHeight: 400,
  },
  postsContainer: {
    paddingBottom: 16,
    gap: 12,
  },
  postCardItem: {
    backgroundColor: '#FAFAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryChip: {
    backgroundColor: '#FFF2F4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FF5D7B',
  },
  totalVotesText: {
    fontSize: 12,
    color: '#8F8F8F',
    fontWeight: '500',
  },
  postCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  postCardStory: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  voteRatioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgePillO: {
    backgroundColor: '#FFF2F4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  badgeTextO: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5D7B',
  },
  badgePillX: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badgeTextX: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
});
