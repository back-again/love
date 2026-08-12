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
import { useRelationshipProfileStore } from './_state/useRelationshipProfileStore';
import { RelationshipQuizModal } from './_component/RelationshipQuizModal';
import { getRelationshipProfileLib } from './_lib/relationshipProfile.lib';

interface Message {
  id: string;
  sender: 'user' | 'counselor';
  text: string;
  timestamp: string;
  isPostSelectorPrompt?: boolean;
}

const ARCHETYPE_IMAGES: Record<string, any> = {
  '말랑말랑 리트리버 인형': require('../../assets/archetypes/archetype_01_retriever.png'),
  '폭신폭신 수면베개': require('../../assets/archetypes/archetype_02_pillow.png'),
  '착착 스위스 아미 칼': require('../../assets/archetypes/archetype_03_swiss_knife.png'),
  '단단한 압력밥솥': require('../../assets/archetypes/archetype_04_rice_cooker.png'),
  '톡 쏘는 탄산음료 캔': require('../../assets/archetypes/archetype_05_soda_can.png'),
  '잠금장치 다이어리': require('../../assets/archetypes/archetype_06_diary.png'),
  '바스락 쿠쿠다스 과자': require('../../assets/archetypes/archetype_07_cookie.png'),
  '반짝이는 도자기 선인장': require('../../assets/archetypes/archetype_08_cactus.png'),
  '동글동글 몽돌 돌멩이': require('../../assets/archetypes/archetype_09_stone.png'),
  '쫀득쫀득 딱풀': require('../../assets/archetypes/archetype_10_glue.png'),
};

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
    title: '카톡 텀 3시간 고민',
    fullStory: '남친 카톡 텀이 3시간 이상인데 솔직하게 말해야 할까요?',
    voteO: '말한다',
    voteX: '참는다',
    percentO: 71,
    percentX: 29,
    totalVotes: 14,
    category: '연애고민',
    topComments: [{ nickname: '익명1', text: '서운한 점은 솔직히 말하는 게 답!' }],
  },
];

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
  const profile = useRelationshipProfileStore(state => state.profile);
  const setProfile = useRelationshipProfileStore(state => state.setProfile);
  const resetProfile = useRelationshipProfileStore(state => state.resetProfile);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);

  const [selectedPost, setSelectedPost] = useState<PostItemData | 'general' | null>(null);
  const [userPosts, setUserPosts] = useState<PostItemData[]>(SAMPLE_MY_POSTS);

  const [selectedPostIdsForDiagnosis, setSelectedPostIdsForDiagnosis] = useState<string[]>([]);
  const [hasDiagnosedPosts, setHasDiagnosedPosts] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const initProfileAndPosts = async () => {
      try {
        const savedProfile = await getRelationshipProfileLib();
        if (savedProfile) {
          setProfile(savedProfile);
        }
      } catch (err) {
        console.warn('Failed to load relationship profile from DB:', err);
      }

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

    initProfileAndPosts();
  }, []);

  const togglePostSelectionForDiagnosis = (postId: string) => {
    setSelectedPostIdsForDiagnosis(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleEnterChatRoom = (target: PostItemData | 'general') => {
    setSelectedPost(target);
    if (onActiveChatStateChange) onActiveChatStateChange(true);

    if (target === 'general') {
      const greetingText = profile
        ? `안녕하세요 두두님! 연애 상담원 두림이입니다. 💖\n\n두두님의 연애 추구미인 '${profile.typeTitle}' 성향과 갈등 해결 방식('${profile.conflictHeadline}')을 기억하고 있어요.\n\n두두님의 피해야 할 상대 기준을 바탕으로 단호하고 명확한 솔루션을 들려드릴게요. 오늘 어떤 이야기가 나누고 싶으신가요?`
        : `안녕하세요 두두님! 연애 상담원 두림이입니다. 💖\n\n연애 고민, 감정 토로, 한풀이 대화 등 무엇이든 이야기해주세요. 상단에서 '내 연애 추구미'를 진단받으시면 더욱 정밀한 맞춤 솔루션을 받아보실 수 있습니다.`;

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
        `두두님이 작성하신 사연 '${target.title}' 맞춤 상담을 시작합니다.\n\n` +
        `[사연 주제]\n` +
        `"${target.fullStory || target.title}"\n\n` +
        `[유저 반응 분석]\n` +
        `커뮤니티 유저분들은 ${percentO >= percentX ? `'${target.voteO || '찬성'}'` : `'${target.voteX || '반대'}'`} 쪽 의견에 많이 공감해주셨고, ${topComment} 라는 조언도 모였습니다.\n\n` +
        (profile ? `[추구미 기반 맞춤 솔루션]\n두두님의 '${profile.typeTitle}' 성향을 토대로 볼 때, 이 상황에서는 서운함을 가슴에 담기보다 솔직히 정돈해서 말하는 것이 마음이 가장 편하실 거예요. 어떤 점이 가장 걱정되시나요?` : `[맞춤 솔루션]\n이 고민 상황에 대해 두두님의 마음과 유저들의 반응을 함께 파헤쳐볼게요. 어떤 부분이 가장 걱정되시나요?`);

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
        (profile ? `두두님의 연애 추구미 '${profile.typeTitle}' 기준에서 볼 때, 상대방과의 고민 패턴이 반복되지 않으려면 대화의 기준을 명확히 설정해야 합니다. 더 깊이 논의해보고 싶은 부분이 있으신가요?` : `상대방과의 고민 패턴을 보면, 감정적 응어리가 반복되지 않도록 대화의 규칙을 세우시는 것이 매우 중요합니다. 더 논의해보고 싶은 부분이 있으신가요?`);

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
      const isRuleViolation =
        textToSend.includes('거짓말') ||
        textToSend.includes('속임') ||
        textToSend.includes('잠수') ||
        textToSend.includes('회피') ||
        textToSend.includes('스킨십') ||
        textToSend.includes('강제') ||
        textToSend.includes('조급') ||
        textToSend.includes('개선') ||
        textToSend.includes('반복') ||
        textToSend.includes('넘어가') ||
        textToSend.includes('또') ||
        textToSend.includes('헤어') ||
        textToSend.includes('이별');

      let responseText = '';

      if (isRuleViolation && profile) {
        const avoidReason = profile.avoidPartners?.[0]?.desc || '회피와 개선 의지 부족 행동';
        responseText =
          `두두님, 대화를 나누어보아도 ${avoidReason} 태도가 반복된다면 무조건 이별을 고민하셔야 할 때입니다.\n\n` +
          `두두님의 연애 성향(${profile.typeTitle})을 파악해본 바, 상대방의 변화 없는 행동을 끌어안고 참으시면 두두님의 마음 상처만 깊어집니다.\n\n` +
          `두두님 자신을 소중히 지키기 위해 이 관계는 단호하게 정돈하시고 이별을 선택하시는 것을 권유해 드려요.`;
      } else {
        responseText = profile
          ? `두두님의 연애 추구미인 '${profile.typeTitle}' 성향을 고려하면, ${profile.conflictHeadline}처럼 마음에 묵혀두기보다 솔직하게 대화로 풀어내는 편이 두두님 마음 건강에 가장 좋습니다.`
          : '두두님이 말씀하신 내용에 진심으로 공감이 돼요. 상대방의 입장을 한 번 헤아려보시되, 두두님이 느끼는 솔직한 감정을 전해보는 걸 추천해요.';
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
          {/* Main Section: 나의 연애 성향 Card */}
          <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>나의 연애 성향</Text>
          </View>

          {profile ? (
            <View style={styles.singleProfileCard}>
              {/* Retry Icon Top Right */}
              <TouchableOpacity
                style={styles.cardRetryTopBtn}
                onPress={() => setIsQuizModalVisible(true)}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                    stroke="#8F8F8F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M3 3v5h5"
                    stroke="#8F8F8F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"
                    stroke="#8F8F8F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M21 21v-5h-5"
                    stroke="#8F8F8F"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>

              {/* 1. Large Coral Main Archetype Title */}
              <Text style={styles.archetypeMainTitle}>
                {profile.typeTitle.replace(/[🛡️🌸🌿]/g, '').trim()}
              </Text>

              {/* 2. Sub-title / Catchphrase */}
              <Text style={styles.archetypeSubText}>{profile.typeOneLiner}</Text>

              {/* 3. Center Graphic Illustration */}
              <View style={styles.archetypeGraphicWrap}>
                <Image
                  source={
                    ARCHETYPE_IMAGES[profile.typeTitle] ||
                    require('../../assets/counselor_momo.png')
                  }
                  style={styles.archetypeGraphicImg}
                  resizeMode="contain"
                />
              </View>

              {/* 4. Tendency Segmented Progress Bars */}
              <View style={styles.statsContainer}>
                {(
                  profile.stats || [
                    { label: '표현 솔직도', level: 5 },
                    { label: '애정 집착도', level: 2 },
                    { label: '감정 포용력', level: 4 },
                    { label: '갈등 해결력', level: 5 },
                  ]
                ).map((stat, idx) => (
                  <View key={idx} style={styles.statRow}>
                    <Text style={styles.statLabelText}>{stat.label}</Text>
                    <View style={styles.segmentBarWrap}>
                      {[1, 2, 3, 4, 5].map(seg => {
                        const colors = ['#FFE0E6', '#FFBFCB', '#FF9EB0', '#FF7D96', '#FF5D7B'];
                        const segColor = colors[seg - 1] || '#FF5D7B';
                        return (
                          <View
                            key={seg}
                            style={[
                              styles.segmentPill,
                              seg <= stat.level
                                ? { backgroundColor: segColor }
                                : styles.segmentPillEmpty,
                            ]}
                          />
                        );
                      })}
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.profileDividerLight} />

              {/* 5. Clean Bullet List */}
              <View style={styles.bulletListWrap}>
                <View style={styles.bulletBlock}>
                  <Text style={styles.bulletHeaderTitle}>
                    · <Text style={styles.bulletHighlight}>갈등 해결 방식</Text>
                  </Text>
                  <Text style={styles.bulletDesc}>
                    {profile.conflictHeadline}
                  </Text>
                </View>

                <View style={styles.bulletBlock}>
                  <Text style={styles.bulletHeaderTitle}>
                    · <Text style={styles.bulletHighlight}>잘 맞는 상대</Text>
                  </Text>
                  <Text style={styles.bulletDesc}>
                    {profile.matchPartnerHeadline}
                  </Text>
                </View>

                <View style={styles.bulletBlock}>
                  <Text style={styles.bulletHeaderTitle}>
                    · <Text style={styles.bulletHighlight}>취약점</Text>
                  </Text>
                  <Text style={styles.bulletDesc}>
                    {profile.vulnerabilityHeadline}
                  </Text>
                </View>

                <View style={styles.bulletBlockWarning}>
                  <Text style={styles.bulletHeaderTitleRed}>
                    · <Text style={styles.bulletHighlightRed}>이별 권유 기준</Text>
                  </Text>
                  {profile.avoidPartners.map((item, idx) => (
                    <Text key={idx} style={styles.bulletSubDescRed}>
                      - {item.desc}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.profileCardEmpty}>
              <Text style={styles.emptyProfileTitle}>
                아직 분석된 연애 성향이 없어요
              </Text>
              <Text style={styles.emptyProfileSub}>
                내 연애 성향을 바탕으로, 두림이가 더 나에게 맞는 건강한 연애 가이드를 알려드려요.
              </Text>
              <TouchableOpacity
                style={styles.startQuizBtn}
                onPress={() => setIsQuizModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.startQuizBtnText}>나의 연애 성향 분석하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Doorimi Floating Chatbot Button (Matching Reference Design) */}
        <TouchableOpacity
          style={styles.floatingDoorimiFab}
          onPress={() => handleEnterChatRoom('general')}
          activeOpacity={0.85}
        >
          {/* Top Speech Bubble Badge */}
          <View style={styles.fabSpeechBubbleWrap}>
            <View style={styles.fabSpeechBubble}>
              <Text style={styles.fabSpeechBubbleText}>상담해두림</Text>
            </View>
            <View style={styles.fabSpeechTail} />
          </View>

          {/* Bottom Large Avatar Image (No Frame) */}
          <Image
            source={require('../../assets/counselor_momo.png')}
            style={styles.fabDirectAvatarImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <RelationshipQuizModal
          visible={isQuizModalVisible}
          onClose={() => setIsQuizModalVisible(false)}
        />
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
            placeholderTextColor="#8F8F8F"
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
                stroke={inputText.trim() ? '#FFFFFF' : '#C0C0C0'}
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
    backgroundColor: '#F5F5F5',
  },
  hubContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  hubScrollView: {
    flex: 1,
  },
  hubContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 140,
  },
  floatingDoorimiFab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  fabSpeechBubbleWrap: {
    alignItems: 'center',
    marginBottom: -4,
    zIndex: 2,
  },
  fabSpeechBubble: {
    backgroundColor: '#FF5D7B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  fabSpeechBubbleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  fabSpeechTail: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF5D7B',
    marginTop: -1,
  },
  fabDirectAvatarImg: {
    width: 76,
    height: 76,
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
  profileCardEmpty: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF2F4',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sparkleIcon: {
    fontSize: 22,
  },
  emptyProfileTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyProfileSub: {
    fontSize: 13,
    color: '#727272',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  startQuizBtn: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FF5D7B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5D7B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  startQuizBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  singleProfileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 22,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginTop: 4,
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardRetryTopBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
    zIndex: 5,
  },
  archetypeMainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FF5D7B',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  archetypeSubText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8F8F8F',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  archetypeGraphicWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  archetypeGraphicImg: {
    width: 150,
    height: 150,
  },
  statsContainer: {
    marginTop: 14,
    marginBottom: 12,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabelText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#727272',
    width: 76,
  },
  segmentBarWrap: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  segmentPill: {
    flex: 1,
    height: 14,
    borderRadius: 7,
  },
  segmentPillFilled: {
    backgroundColor: '#FF5D7B',
  },
  segmentPillEmpty: {
    backgroundColor: '#F5F5F5',
  },
  bulletListWrap: {
    marginTop: 12,
    gap: 12,
  },
  bulletBlock: {
    gap: 3,
  },
  bulletHeaderTitle: {
    fontSize: 13.5,
    color: '#727272',
    lineHeight: 19,
  },
  bulletDesc: {
    fontSize: 13,
    color: '#8F8F8F',
    paddingLeft: 10,
    lineHeight: 18,
  },
  bulletHighlight: {
    fontWeight: '800',
    color: '#0F172A',
  },
  bulletSubDesc: {
    fontSize: 12.5,
    color: '#8F8F8F',
    paddingLeft: 12,
    lineHeight: 18,
  },
  bulletBlockWarning: {
    gap: 3,
  },
  bulletHeaderTitleRed: {
    fontSize: 13.5,
    color: '#FF5D7B',
    lineHeight: 19,
  },
  bulletHighlightRed: {
    fontWeight: '800',
    color: '#FF5D7B',
  },
  bulletSubDescRed: {
    fontSize: 12.5,
    color: '#FF5D7B',
    paddingLeft: 12,
    lineHeight: 18,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeBadgeWrap: {
    flex: 1,
    paddingRight: 10,
  },
  profileTypeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  typeOneLinerText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FF5D7B',
    lineHeight: 18,
  },
  retryIconBtn: {
    padding: 6,
    borderRadius: 20,
  },
  profileDividerLight: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  sectionBlock: {
    gap: 4,
  },
  sectionTitleLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#727272',
    marginBottom: 2,
  },
  sectionTitleLabelAmber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 2,
  },
  sectionTitleLabelRed: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#E11D48',
    marginBottom: 6,
  },
  headlineMainText: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  subDetailText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#727272',
    lineHeight: 19,
  },
  avoidFlatWrap: {
    gap: 12,
    marginTop: 2,
  },
  avoidFlatRow: {
    gap: 2,
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
