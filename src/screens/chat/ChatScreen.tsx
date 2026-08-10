import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { supabase } from '@/api/supabase';

interface Message {
  id: string;
  sender: 'user' | 'counselor';
  text: string;
  timestamp: string;
  isPostSelectorPrompt?: boolean;
}

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

// Recommended Topics for Comprehensive Counseling inside chat
const COMPREHENSIVE_TOPICS = [
  '이 사람과 미래를 그려도 괜찮은 사람일까?',
  '그 사람과 나의 성향 차이 종합 분석하기',
  '반복되는 갈등 원인과 해결 패턴 찾기',
  '유저들이 말하는 이 관계의 솔직한 시그널',
  '이 연애를 계속 이어가도 될까? (관계 건강도 진단)',
];

export default function ChatScreen({
  onGoToCreate,
  onActiveChatStateChange,
}: {
  onGoToCreate?: () => void;
  onActiveChatStateChange?: (active: boolean) => void;
}) {
  const [selectedPost, setSelectedPost] = useState<PostItemData | 'general' | null>(null);
  const [userPosts, setUserPosts] = useState<PostItemData[]>(SAMPLE_MY_POSTS);

  // Selected post IDs for inline chat relationship diagnosis
  const [selectedPostIdsForDiagnosis, setSelectedPostIdsForDiagnosis] = useState<string[]>([]);
  const [hasDiagnosedPosts, setHasDiagnosedPosts] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Fetch written posts from Supabase DB
  useEffect(() => {
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
            totalVotes: (item.votes_o || 0) + (item.votes_x || 0) || 12,
            category: item.category || '고민',
            topComments: [
              { nickname: '익명1', text: '다들 비슷한 고민 하더라구요!' },
              { nickname: '익명2', text: '솔직하게 표현하는 게 최고예요.' },
            ],
          }));
          setUserPosts(formatted);
          setSelectedPostIdsForDiagnosis(formatted.map(p => p.id));
        } else {
          setSelectedPostIdsForDiagnosis(SAMPLE_MY_POSTS.map(p => p.id));
        }
      } catch (e) {
        console.warn('Failed to fetch user posts for chat list:', e);
      }
    };
    fetchPosts();
  }, []);

  const togglePostSelectionForDiagnosis = (postId: string) => {
    setSelectedPostIdsForDiagnosis(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  // Enter a specific Chat Room (Immediate Entry)
  const handleEnterChatRoom = (target: PostItemData | 'general') => {
    setSelectedPost(target);
    if (onActiveChatStateChange) onActiveChatStateChange(true);

    if (target === 'general') {
      const greetingText =
        `안녕하세요 두두님! 연애 상담원 두림이입니다.\n\n` +
        `두두님이 작성하신 고민 사연들과 연애 인사이트를 토대로 자유롭게 대화를 나누실 수 있습니다. 추천 주제를 선택하거나 궁금한 점을 이야기해주세요.`;

      setMessages([
        {
          id: `c_${Date.now()}`,
          sender: 'counselor',
          text: greetingText,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } else {
      const percentO = target.percentO ?? 67;
      const percentX = target.percentX ?? 33;
      const topComment = target.topComments?.[0]?.text ? `"${target.topComments[0].text}"` : '솔직한 생각들이';

      const initialText =
        `두두님이 작성하신 사연 '${target.title}' 심층 대화를 시작합니다.\n\n` +
        `[사연 주제]\n` +
        `"${target.fullStory || target.title}"\n\n` +
        `[유저 반응 분석]\n` +
        `커뮤니티 유저분들은 ${percentO >= percentX ? `'${target.voteO || '찬성'}'` : `'${target.voteX || '반대'}'`} 쪽 의견에 많이 공감해주셨고, ${topComment} 라는 조언도 모였습니다.\n\n` +
        `[맞춤 솔루션]\n` +
        `이 고민 상황에 대해 두두님의 마음과 유저들의 반응을 함께 파헤쳐볼게요. 어떤 부분이 가장 걱정되시나요?`;

      setMessages([
        {
          id: `c_${Date.now()}`,
          sender: 'counselor',
          text: initialText,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleLeaveChatRoom = () => {
    setSelectedPost(null);
    setHasDiagnosedPosts(false);
    if (onActiveChatStateChange) onActiveChatStateChange(false);
  };

  // Submit selected posts inside chat stream for relationship diagnosis
  const handleConfirmPostSelectionInChat = () => {
    setHasDiagnosedPosts(true);
    const chosenPosts = userPosts.filter(p => selectedPostIdsForDiagnosis.includes(p.id));
    const titlesText = chosenPosts.map(p => `'${p.title}'`).join(', ');

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: `선택 사연: ${titlesText} 사연으로 종합 진단해주세요.`,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const diagnosisResultText =
        `선택하신 ${chosenPosts.length}개의 사연을 바탕으로 이 사람과의 관계 건강도를 분석했습니다.\n\n` +
        `[관련 사연 종합 분석]\n` +
        `• 선택 사연: ${titlesText}\n` +
        `• 유저 공감도: 다수 유저들은 신중한 대화와 가치관 일치 여부를 중요하게 보았습니다.\n\n` +
        `[관계 건강도 진단 결과]\n` +
        `상대방과의 고민 패턴을 보면, 감정적 응어리가 반복되지 않도록 대화의 규칙을 세우시는 것이 매우 중요합니다. 미래를 함께 그려가기 위해 더 논의해보고 싶은 부분이 있으신가요?`;

      const counselorMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'counselor',
        text: diagnosisResultText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, counselorMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSend = (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsTyping(true);

    // If user clicks a topic related to partner diagnosis, trigger inline post selection prompt!
    if (
      (textToSend.includes('미래') || textToSend.includes('건강도') || textToSend.includes('성향')) &&
      !hasDiagnosedPosts &&
      userPosts.length > 0
    ) {
      setTimeout(() => {
        const promptMsg: Message = {
          id: `c_prompt_${Date.now()}`,
          sender: 'counselor',
          text: `이 질문에 대한 정확한 진단을 위해, 두두님이 작성하신 고민 사연 중 해당 상대방과 관련된 사연들을 선택해 주세요.`,
          timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
          isPostSelectorPrompt: true,
        };
        setMessages(prev => [...prev, promptMsg]);
        setIsTyping(false);
      }, 800);
      return;
    }

    setTimeout(() => {
      let responseText = '두두님이 말씀하신 내용에 진심으로 공감이 돼요. 상대방의 입장을 한 번 헤아려보시되, 두두님이 느끼는 솔직한 감정을 전해보는 걸 추천해요.';

      if (textToSend.includes('연락')) {
        responseText = '연락 문제는 연애에서 서운함이 가장 자주 쌓이는 부분이에요. 무조건 억누르기보다는 "바쁠 땐 미리 알려주기"처럼 서로 지킬 수 있는 가벼운 약속을 만들어보세요.';
      } else if (textToSend.includes('헤어') || textToSend.includes('이별')) {
        responseText = '이별이나 헤어짐을 고민할 때는 두두님 마음속의 본질을 봐야 해요. 대화로 풀릴 수 있는 문제인지, 아니면 상처만 반복되는 관계인지 신중하게 돌아보시는 것이 중요합니다.';
      }

      const counselorMsg: Message = {
        id: `c_${Date.now()}`,
        sender: 'counselor',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, counselorMsg]);
      setIsTyping(false);
    }, 900);
  };

  // Render 1: HUB LIST SCREEN (No selected chat room yet)
  if (!selectedPost) {
    return (
      <View style={styles.hubContainer}>
        <ScrollView
          style={styles.hubScrollView}
          contentContainerStyle={styles.hubContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.hubHeaderWrap}>
            <Text style={styles.hubTitle}>연애 고민 상담해두림</Text>
            <Text style={styles.hubSub}>
              내 연애 데이터를 모두 아는 두림이와 속마음을 나눠보세요.
            </Text>
          </View>

          {/* Doorimi KakaoTalk Profile Card */}
          <TouchableOpacity
            style={styles.generalRoomCard}
            onPress={() => handleEnterChatRoom('general')}
            activeOpacity={0.85}
          >
            <Image
              source={require('../../assets/counselor_momo.png')}
              style={styles.counselorAvatarImg}
              resizeMode="contain"
            />

            <View style={styles.roomTextWrap}>
              <View style={styles.roomTitleRow}>
                <Text style={styles.roomTitleText}>두림이</Text>
              </View>
              <Text style={styles.roomStatusText} numberOfLines={2}>
                시간 상관없이 언제든 연락해!
              </Text>
            </View>

            <View style={styles.startChatBtnPill}>
              <Text style={styles.startChatBtnPillText}>채팅 시작</Text>
            </View>
          </TouchableOpacity>

          {/* Section Divider Title */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>고민별 심층 대화</Text>
            <Text style={styles.sectionSubTitle}>
              대화를 통해 내 연애성향을 발견하고 맞춤 솔루션을 얻을 수 있어요.
            </Text>
          </View>

          {/* Room Items List: User's Written Posts */}
          {userPosts.length > 0 ? (
            <View style={styles.postsListWrap}>
              {userPosts.map(post => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postRoomCard}
                  onPress={() => handleEnterChatRoom(post)}
                  activeOpacity={0.85}
                >
                  <View style={styles.postRoomHeaderRow}>
                    <Text style={styles.postRoomTitle} numberOfLines={1}>
                      {post.title}
                    </Text>
                  </View>

                  <Text style={styles.postRoomSummary} numberOfLines={2}>
                    {post.fullStory || post.storySummary}
                  </Text>

                  <View style={styles.postRoomFooterRow}>
                    <View />
                    <View style={styles.enterActionWrap}>
                      <Text style={styles.enterActionText}>심층 대화하기</Text>
                      <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                        <Path d="M9 18l6-6-6-6" stroke="#FF5D7B" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </Svg>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            /* Empty State Card */
            <View style={styles.emptyStateCard}>
              <View style={styles.emptyIconCircle}>
                <Image
                  source={require('../../assets/counselor_momo.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>

              <Text style={styles.emptyTitle}>아직 작성하신 고민 사연이 없어요</Text>
              <Text style={styles.emptySub}>
                사연을 등록하면 유저 반응을 반영한 맞춤 상담을 받을 수 있습니다.
              </Text>

              <TouchableOpacity
                style={styles.createPostBtn}
                onPress={() => {
                  if (onGoToCreate) onGoToCreate();
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.createPostBtnText}>고민 사연 작성하고 맞춤 상담받기</Text>
              </TouchableOpacity>

              <View style={styles.valuePropBox}>
                <Text style={styles.valuePropTitle}>고민을 작성하면 왜 더 좋을까요?</Text>
                <Text style={styles.valuePropText}>
                  • 유저들의 실제 투표 수치와 댓글 반응을 함께 참고해요.{'\n'}
                  • 사연을 바탕으로 훨씬 명확하고 솔직한 솔루션을 얻을 수 있습니다.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render 2: ACTIVE CHAT ROOM SCREEN (With Recommended Topics & Dynamic Inline Post Selector)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Header Bar inside Chat Room */}
      <View style={styles.chatHeaderBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleLeaveChatRoom}
          activeOpacity={0.7}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke="#0F172A" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitleText} numberOfLines={1}>
            {selectedPost === 'general' ? '두림이와 종합 연애상담' : `심층 대화: ${selectedPost.title}`}
          </Text>
        </View>

        <View style={{ width: 34 }} />
      </View>

      {/* Message History */}
      <ScrollView
        style={styles.chatScrollView}
        contentContainerStyle={styles.chatContentContainer}
        showsVerticalScrollIndicator={false}
      >

        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <View key={msg.id} style={styles.messageBlockWrap}>
              <View
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAi,
                ]}
              >
                {!isUser && (
                  <Image
                    source={require('../../assets/counselor_momo.png')}
                    style={styles.aiAvatarImg}
                    resizeMode="contain"
                  />
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.messageBubbleUser : styles.messageBubbleAi,
                  ]}
                >
                  <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.timestampText, isUser && styles.timestampUser]}>
                    {msg.timestamp}
                  </Text>
                </View>
              </View>

              {/* Dynamic Inline Post Selector Card Prompted by Counselor when needed */}
              {msg.isPostSelectorPrompt && !hasDiagnosedPosts && (
                <View style={styles.inlinePostSelectorCard}>
                  <Text style={styles.inlineSelectorHeader}>관련 고민 사연 선택</Text>
                  <View style={styles.radioListWrap}>
                    {userPosts.map(post => {
                      const isChecked = selectedPostIdsForDiagnosis.includes(post.id);
                      return (
                        <TouchableOpacity
                          key={post.id}
                          style={[styles.radioCardItem, isChecked && styles.radioCardItemChecked]}
                          onPress={() => togglePostSelectionForDiagnosis(post.id)}
                          activeOpacity={0.8}
                        >
                          <View style={[styles.radioButton, isChecked && styles.radioButtonChecked]}>
                            {isChecked && <View style={styles.radioButtonInner} />}
                          </View>
                          <View style={styles.radioTextWrap}>
                            <Text style={styles.radioPostTitle} numberOfLines={1}>
                              {post.title}
                            </Text>
                            <Text style={styles.radioPostSummary} numberOfLines={1}>
                              {post.fullStory || post.storySummary}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    style={styles.confirmSelectionBtn}
                    onPress={handleConfirmPostSelectionInChat}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.confirmSelectionBtnText}>이 사연들로 종합 진단받기</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {isTyping && (
          <View style={[styles.messageRow, styles.messageRowAi]}>
            <Image
              source={require('../../assets/counselor_momo.png')}
              style={styles.aiAvatarImg}
              resizeMode="contain"
            />
            <View style={[styles.messageBubble, styles.messageBubbleAi]}>
              <Text style={styles.typingText}>답변을 생각하는 중입니다...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Fixed Area (Topics Chips 14px above Input Bar) */}
      <View style={styles.bottomFixedArea}>
        {selectedPost === 'general' && (
          <View style={styles.chatTopicsBannerFloating}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chatTopicsScrollContent}
            >
              {COMPREHENSIVE_TOPICS.map((topic, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.chatTopicChip}
                  onPress={() => handleSend(topic)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.chatTopicChipText}>{topic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainerInline}>
          <TextInput
            style={styles.input}
            placeholder="상담하실 내용을 자유롭게 입력하세요..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
          />

          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke={inputText.trim() ? '#FFFFFF' : '#CBD5E1'}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  hubContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  hubScrollView: {
    flex: 1,
  },
  hubContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  hubHeaderWrap: {
    marginBottom: 20,
  },
  hubTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  hubHighlightPhrase: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF5D7B',
    marginBottom: 6,
  },
  hubSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    marginTop: 4,
  },
  generalRoomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    marginBottom: 24,
  },
  counselorAvatarImg: {
    width: 70,
    height: 70,
    marginRight: 14,
  },
  roomTextWrap: {
    flex: 1,
    marginRight: 10,
  },
  roomTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  roomTitleText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  roomStatusText: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
  },
  startChatBtnPill: {
    backgroundColor: '#FF5D7B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  startChatBtnPillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionHeaderRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionSubTitle: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    marginTop: 4,
  },
  postsListWrap: {
    gap: 12,
  },
  postRoomCard: {
    backgroundColor: '#FCFCFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  postRoomHeaderRow: {
    marginBottom: 6,
  },
  postRoomTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  postRoomSummary: {
    fontSize: 13.5,
    color: '#8F8F8F',
    lineHeight: 19,
    marginBottom: 14,
  },
  postRoomFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enterActionWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  enterActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5D7B',
  },
  bottomFixedArea: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  chatTopicsBannerFloating: {
    marginBottom: 14,
    paddingVertical: 2,
  },
  chatTopicsScrollContent: {
    paddingHorizontal: 20,
  },
  chatTopicChip: {
    backgroundColor: '#FFF2F4',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  chatTopicChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF5D7B',
  },
  messageBlockWrap: {
    width: '100%',
  },
  inlinePostSelectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FFD1DC',
    marginLeft: 40,
    marginTop: 6,
    marginBottom: 16,
  },
  inlineSelectorHeader: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  radioListWrap: {
    gap: 8,
    marginBottom: 12,
  },
  radioCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  radioCardItemChecked: {
    backgroundColor: '#FFF5F7',
    borderColor: '#FFD1DC',
  },
  radioButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#C0C0C0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  radioButtonChecked: {
    borderColor: '#FF5D7B',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5D7B',
  },
  radioTextWrap: {
    flex: 1,
  },
  radioPostTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  radioPostSummary: {
    fontSize: 12,
    color: '#8F8F8F',
  },
  confirmSelectionBtn: {
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSelectionBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyStateCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
  },
  emptyIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF2F4',
    borderWidth: 1.5,
    borderColor: '#FFD1DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#8F8F8F',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  createPostBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  createPostBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  valuePropBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  valuePropTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  valuePropText: {
    fontSize: 12,
    color: '#8F8F8F',
    lineHeight: 18,
  },
  chatHeaderBar: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  chatScrollView: {
    flex: 1,
  },
  chatContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 150,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
  },
  aiAvatarImg: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubbleUser: {
    backgroundColor: '#FF5D7B',
    borderBottomRightRadius: 4,
  },
  messageBubbleAi: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  messageText: {
    fontSize: 14.5,
    color: '#0F172A',
    lineHeight: 21,
  },
  messageTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 10.5,
    color: '#C0C0C0',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampUser: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  typingText: {
    fontSize: 13.5,
    color: '#8F8F8F',
    fontStyle: 'italic',
  },
  inputContainerInline: {
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#0F172A',
    paddingVertical: 4,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#F5F5F5',
  },
});
