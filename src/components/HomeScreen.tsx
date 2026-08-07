

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  Animated,
  Alert,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect, Ellipse, Polygon } from 'react-native-svg';
import MyMenuBottomSheet, { MyMenuType } from './MyMenuBottomSheet';
import CommentBottomSheet, { VoteInfo } from './CommentBottomSheet';
import ReviewBottomSheet from './ReviewBottomSheet';
import { PostDetailModal } from './PostDetailModal';
import { supabase } from '../api/supabase';
import { createPost } from '../screens/create/_lib/createPost.lib';

import { Dimensions } from 'react-native';

interface HomeScreenProps {
  user: any;
  onLogout: () => void;
}

// Sample feed posts list with Top 3 Rolling Comments & Vote Ratio Stats
const SAMPLE_POSTS = [
  {
    id: 'post-1',
    variantName: '사진 1개',
    title: '아니 너네는 남친이\n피엑스에서 선물사주면 어떰?',
    storySummary:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림이랑 선크림을 사가지고 줬더라고 ㅋㅋㅋ 진짜 당황스러웠음...',
    fullStory:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림이랑 선크림을 사가지고 줬더라고 ㅋㅋㅋ 진짜 당황스러워서 선물 받고도 기분이 묘한데 너네라면 어떨 거 같아?',
    images: [
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
    ],
    voteO: '괜찮은데?',
    voteX: '난 싫어',
    percentO: 60,
    percentX: 40,
    totalVotes: 324,
    topComments: [
      { id: 'c1', user: '익명1', text: '그딴 ㅃ을 만나고있네 ㅋ', likes: 153 },
      {
        id: 'c2',
        user: '익명2',
        text: 'PX 달팽이크림 은근 비싸고 좋은데 서운할 순 있음 ㅠ',
        likes: 98,
      },
      {
        id: 'c3',
        user: '익명3',
        text: '생일선물로 PX는 솔직히 좀 성의 없어 보인다...',
        likes: 64,
      },
    ],
    reviewStatus: '후기 보기',
    hasReview: true,
    fireCount: 24,
    facepalmCount: 24,
    commentCount: 24,
  },
  {
    id: 'post-2',
    variantName: '사진 2개 이상',
    title: '아니 너네는 남친이\n피엑스에서 선물사주면 어떰?',
    storySummary:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림 선크림 들고 나타남 ㅋ 카톡 캡처 첨부함...',
    fullStory:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림이랑 선크림을 사가지고 줬더라고 ㅋㅋㅋ 진짜 당황스러워서 선물 받고도 기분이 묘하고 속상함 ㅠㅠ 남친은 "이거 엄청 유명하고 비싼 크림이야!" 하면서 당당하게 주던데 솔직히 생일선물로 PX는 좀 성의 없어 보이는 거 맞아? 너네라면 남친한테 솔직하게 서운하다고 말할 거 같아 아니면 그냥 고맙다고 쓸 거 같아?',
    images: [
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&auto=format&fit=crop&q=80',
    ],
    voteO: '괜찮은데?',
    voteX: '난 싫어',
    percentO: 45,
    percentX: 55,
    totalVotes: 512,
    topComments: [
      {
        id: 'c1',
        user: '익명1',
        text: '카톡 캡처 보니까 남친 말하는 게 더 열받네 ㅋㅋ',
        likes: 142,
      },
      {
        id: 'c2',
        user: '익명2',
        text: '선크림 피부타입은 맞춰서 사온 거임? ㅋㅋㅋ',
        likes: 87,
      },
      {
        id: 'c3',
        user: '익명3',
        text: '다음 남친 생일 때 똑같이 PX 선물 ㄱㄱ',
        likes: 53,
      },
    ],
    reviewStatus: '후기 요청',
    hasReview: false,
    fireCount: 38,
    facepalmCount: 19,
    commentCount: 42,
  },
  {
    id: 'post-3',
    variantName: '사진 안넣음',
    title: '아니 너네는 남친이\n피엑스에서 선물사주면 어떰?',
    storySummary:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림이랑 선크림 사가지고 줬더라고 진짜...',
    fullStory:
      '아니 내가 생일 2주전부터 얘기했는데 글쎄 내 생일에 PX에서 달팽이크림이랑 선크림을 사가지고 줬더라고 ㅋㅋㅋ 진짜 당황스러워서.. 사진 없이 글로만 써보는데 너희들 의견은 어때?',
    images: [],
    voteO: '괜찮은데?',
    voteX: '난 싫어',
    percentO: 28,
    percentX: 72,
    totalVotes: 189,
    topComments: [
      {
        id: 'c1',
        user: '익명1',
        text: '사진 없어도 상황 다 이해됨 헤어지는 게 답임',
        likes: 115,
      },
      {
        id: 'c2',
        user: '익명2',
        text: '미리 갖고 싶은 거 말해줬는데도 이러면 관심 없는 거임',
        likes: 76,
      },
      {
        id: 'c3',
        user: '익명3',
        text: '실수로 까먹고 급하게 PX에서 사온 듯 ㅠㅠ',
        likes: 41,
      },
    ],
    reviewStatus: '후기 요청',
    fireCount: 12,
    facepalmCount: 45,
    commentCount: 31,
  },
  {
    id: 'post-4',
    variantName: '연락 문제 사연',
    title: '주말마다 게임하느라\n카톡 5시간씩 답장 안하는 남친',
    storySummary:
      '평일에는 연락 엄청 잘 되는데 주말만 되면 친구들이랑 피씨방 가서 롤하느라 카톡 읽씹하고 5시간 뒤에 나 집에 왔어 한마디 남기는데...',
    fullStory:
      '평일에는 연락 엄청 잘 되는데 주말만 되면 친구들이랑 피씨방 가서 카톡 읽씹하거나 5시간 뒤에 나 집에 왔어 ㅋㅋㅋ 한마디 남김. 내가 서운하다고 하니까 주말엔 좀 쉬게 해달라는데 팩폭 좀 해줘.',
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    ],
    voteO: '이해해줘',
    voteX: '헤어져라',
    percentO: 15,
    percentX: 85,
    totalVotes: 742,
    topComments: [
      {
        id: 'c1',
        user: '익명1',
        text: '5시간이면 이미 우선순위에서 밀린 거임',
        likes: 210,
      },
      {
        id: 'c2',
        user: '익명2',
        text: '게임할 때 미리 말만 해주면 괜찮지 않나?',
        likes: 84,
      },
      {
        id: 'c3',
        user: '익명3',
        text: '주말 내내 그러는 건 선 넘었지 ㅋㅋㅋ',
        likes: 62,
      },
    ],
    reviewStatus: '후기 보기',
    fireCount: 56,
    facepalmCount: 31,
    commentCount: 89,
  },
  {
    id: 'post-5',
    variantName: '데리러 오는 문제 사연',
    title: '데이트 끝날 때마다\n집까지 안바래다주는 남친 서운해',
    storySummary:
      '우리 집이랑 남친 집 지하철 3정거장 거리인데 데이트 끝나면 항상 중간 지하철역까지만 인사하고 바로 자기 집으로 가버리는데...',
    fullStory:
      '우리 집이랑 남친 집 지하철 3정거장 거진데 데이트 끝나면 항상 중간 지하철역까지만 인사하고 가버림. 가끔 밤 늦을 땐 집 앞까지 같이 가주면 안 되나 싶은데 내가 너무 징징대는 거야?',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    ],
    voteO: '서운할만함',
    voteX: '과한 욕심',
    percentO: 64,
    percentX: 36,
    totalVotes: 430,
    topComments: [
      {
        id: 'c1',
        user: '익명1',
        text: '밤 11시 넘으면 당연히 바래다줘야지..',
        likes: 178,
      },
      {
        id: 'c2',
        user: '익명2',
        text: '매번 집 앞까지 가주는 것도 체력적으로 힘듦',
        likes: 92,
      },
      {
        id: 'c3',
        user: '익명3',
        text: '서로 타협해서 밤 늦을 때만 가달라고 해봐',
        likes: 45,
      },
    ],
    reviewStatus: '후기 요청',
    fireCount: 29,
    facepalmCount: 67,
    commentCount: 54,
  },
];

// MyPage Component to render user profile screen as shown in user screenshot
function MyPageContent({
  onLogout,
  onOpenMenu,
  onOpenViewReview,
}: {
  onLogout?: () => void;
  onOpenMenu: (type: MyMenuType) => void;
  onOpenViewReview?: () => void;
}) {
  const writtenPosts = [
    {
      id: 'my-1',
      title: '생일선물 피엑스에서 사다준 남친 나만 짜쳐?',
      participants: 375,
      voteO: 57,
      voteX: 43,
      percentO: 57,
      percentX: 43,
      curiousCount: 234,
      hasReview: false,
    },
    {
      id: 'my-2',
      title: '헤어진 전애인 인스타 스토리 매일 읽는 심리가 뭘까?',
      participants: 412,
      voteO: 28,
      voteX: 72,
      percentO: 28,
      percentX: 72,
      views: '1,234',
      hasReview: true,
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.myPageScrollView}
        contentContainerStyle={styles.myPageContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. 작성한 글 Section */}
        <View style={styles.mySection}>
          <View style={styles.mySectionTitleRow}>
            <Text style={styles.mySectionTitle}>작성한 글</Text>
            <Text style={styles.mySectionCountBadge}>2</Text>
          </View>
          {writtenPosts.map((post, idx) => {
            const isODominant = post.voteO >= post.voteX;
            const isXDominant = post.voteX > post.voteO;

            return (
              <View key={post.id + idx} style={styles.myPostCard}>
                <Text style={styles.myPostTitle} numberOfLines={2}>
                  {post.title}
                </Text>

                {/* O/X Vote Mini Gauge Progress Bar - 우세한 쪽만 포인트 색상 적용 */}
                <View style={styles.myPostVoteBarWrapper}>
                  <View style={styles.myPostVoteBarContainer}>
                    <View
                      style={[
                        styles.myPostVoteBarO,
                        {
                          flex: post.voteO,
                          backgroundColor: isODominant ? '#FFC8B3' : '#F1F5F9',
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.myPostVoteBarX,
                        {
                          flex: post.voteX,
                          backgroundColor: isXDominant ? '#FFB4BB' : '#F1F5F9',
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.myPostVotePercentRow}>
                    <Text
                      style={[
                        styles.myPostVotePercentO,
                        !isODominant && { color: '#9C9C9C' },
                      ]}
                    >
                      괜찮은데? O {post.percentO}%
                    </Text>
                    <Text
                      style={[
                        styles.myPostVotePercentX,
                        !isXDominant && { color: '#9C9C9C' },
                      ]}
                    >
                      난 싫어 X {post.percentX}%
                    </Text>
                  </View>
                </View>

                <View style={styles.myPostCardBodyRow}>
                  <View style={styles.myPostMetaCol}>
                    <Text style={styles.myPostMetaRow1}>
                      {post.participants}명 참여
                    </Text>
                    {!post.hasReview && (
                      <Text style={styles.myPostMetaRow2}>
                        ✉️{' '}
                        <Text style={{ color: '#FF8E7A', fontWeight: '700' }}>
                          {post.curiousCount}명
                        </Text>
                        이 후기를 기다려요
                      </Text>
                    )}
                  </View>

                  {post.hasReview ? (
                    <TouchableOpacity
                      style={styles.myPostReviewedBtn}
                      onPress={() => {
                        if (onOpenViewReview) onOpenViewReview();
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.myPostReviewedBtnText}>
                        후기 보기
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.myPostReviewBtn}
                      onPress={() => onOpenMenu('write_review')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.myPostReviewBtnText}>
                        후기 남기기
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* 2. 피드백 보내기 & 문의 사항 슬림 타일 버튼 Grid */}
        <View style={styles.myMenuTileRow}>
          <TouchableOpacity
            style={styles.myMenuTileCard}
            onPress={() => onOpenMenu('feedback')}
            activeOpacity={0.75}
          >
            <Text style={styles.myMenuTileTitle}>피드백 보내기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.myMenuTileCard}
            onPress={() => onOpenMenu('inquiry')}
            activeOpacity={0.75}
          >
            <Text style={styles.myMenuTileTitle}>문의 사항</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

// ----------------------------------------------------
// 작성 화면 (Create Screen Component)
// ----------------------------------------------------
function CreatePageContent({ onComplete }: { onComplete: (newPost?: any) => void }) {
  const [questionTitle, setQuestionTitle] = useState('');
  const [detailSituation, setDetailSituation] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    if (images.length >= 3) {
      if (Platform.OS === 'web')
        alert('이미지는 최대 3개까지 첨부할 수 있습니다.');
      else Alert.alert('안내', '이미지는 최대 3개까지 첨부할 수 있습니다.');
      return;
    }
    const sampleImgs = [
      'https://picsum.photos/400/300?random=101',
      'https://picsum.photos/400/300?random=102',
      'https://picsum.photos/400/300?random=103',
    ];
    setImages(prev => [sampleImgs[prev.length % sampleImgs.length], ...prev]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid =
    questionTitle.trim().length > 0 && detailSituation.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;

    const newPost = {
      id: `post-${Date.now()}`,
      title: questionTitle.trim(),
      storySummary: detailSituation.trim(),
      fullStory: detailSituation.trim(),
      images: images,
      voteO: '괜찮은데?',
      voteX: '난 싫어',
      percentO: 50,
      percentX: 50,
      totalVotes: 0,
      topComments: [],
      reviewStatus: '후기 요청',
      hasReview: false,
    };

    if (Platform.OS === 'web')
      alert('오답노트에 사연이 성공적으로 등록되었습니다!');
    else Alert.alert('완료', '오답노트에 사연이 성공적으로 등록되었습니다!');

    onComplete(newPost);
  };

  return (
    <ScrollView
      style={styles.createScrollView}
      contentContainerStyle={styles.createContentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. 무엇을 물어볼까요? */}
      <View style={styles.createSection}>
        <Text style={styles.createSectionTitle}>무엇을 물어볼까요?</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.titleInput}
            placeholder="예시) 여사친이랑 단둘이 코노 가는 남친, 괜찮아?"
            placeholderTextColor="#BCBCBC"
            maxLength={20}
            value={questionTitle}
            onChangeText={setQuestionTitle}
          />
          <Text style={styles.charCounter}>({questionTitle.length}/20)</Text>
        </View>
      </View>

      {/* 2. 구체적인 상황을 알려주세요 */}
      <View style={styles.createSection}>
        <Text style={styles.createSectionTitle}>
          구체적인 상황을 알려주세요
        </Text>
        <Text style={styles.createSectionSub}>
          어떤 배경이 있었고, 당시 어떻게 대처했나요?
        </Text>
        <TextInput
          style={styles.detailInput}
          placeholder="자유롭게 작성해주세요."
          placeholderTextColor="#BCBCBC"
          multiline={true}
          numberOfLines={6}
          textAlignVertical="top"
          value={detailSituation}
          onChangeText={setDetailSituation}
        />
      </View>

      {/* 3. 파일 첨부 */}
      <View style={styles.createSection}>
        <Text style={styles.createSectionTitle}>파일 첨부</Text>
        <Text style={styles.createSectionSub}>
          참고할만한 이미지가 있다면 업로드해주세요
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollRow}
        >
          {/* 3개 미만일 때 가장 왼쪽에 '+' 업로드 버튼 고정 노출 */}
          {images.length < 3 && (
            <TouchableOpacity
              style={styles.uploadSlotBtn}
              onPress={handleAddImage}
              activeOpacity={0.7}
            >
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 5v14M5 12h14"
                  stroke="#9C9C9C"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          )}

          {/* 첨부된 이미지가 '+' 버튼 오른쪽으로 첨부 순서대로 정렬 */}
          {images.map((imgUrl, idx) => (
            <View key={idx} style={styles.imageSlot}>
              <Image source={{ uri: imgUrl }} style={styles.uploadedImg} />
              <TouchableOpacity
                style={styles.removeImgBtn}
                onPress={() => handleRemoveImage(idx)}
              >
                <Text style={styles.removeImgText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 4. 하단 작성 완료 버튼 */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          !isFormValid && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.submitButtonText,
            !isFormValid && styles.submitButtonTextDisabled,
          ]}
        >
          작성 완료
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Single Feed Card Item Component (Each feed has independent vote, story overlay & rolling comment states)
function FeedCardItem({
  post,
  pageHeight,
  onOpenComments,
  onOpenViewReview,
}: {
  post: any;
  pageHeight: number;
  onOpenComments: (title: string, voteInfo?: VoteInfo) => void;
  onOpenViewReview: () => void;
}) {
  const [selectedVote, setSelectedVote] = useState<'O' | 'X' | null>(null);

  const handleOpenCommentsFromPill = () => {
    onOpenComments(post.title, {
      selectedVote: selectedVote,
      voteOText: post.voteO,
      voteXText: post.voteX,
      percentO: post.percentO || 50,
      percentX: post.percentX || 50,
      totalVotes: post.totalVotes || 300,
    });
  };

  const fullText = post.fullStory || post.storySummary || '';

  return (
    <TouchableOpacity
      style={styles.cardPageWrapper}
      onPress={handleOpenCommentsFromPill}
      activeOpacity={0.92}
    >
      <View style={styles.cardContainer}>
        {/* Top Meta Row: Badge Pill + Category & Time */}
        <View style={styles.topMetaRow}>
          <View style={styles.hotBadgePill}>
            <Text style={styles.hotBadgeText}>HOT</Text>
          </View>
          <Text style={styles.categoryTimeText}>연애 · 5분 전</Text>
        </View>

        {/* Title Question */}
        <Text style={styles.questionTitle}>{post.title}</Text>

        {/* Story Text Preview if any */}
        {fullText ? (
          <Text style={styles.storyPreviewText} numberOfLines={2}>
            {fullText}
          </Text>
        ) : null}

        {/* Attached Images Preview if any */}
        {post.images && post.images.length > 0 && (
          <View style={styles.imageListRow}>
            {post.images.slice(0, 3).map((imgUri: string, index: number) => (
              <Image
                key={index}
                source={{ uri: imgUri }}
                style={styles.cardImageThumb}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        {/* Bottom Stats Row: Vote Count & Comment Count */}
        <View style={styles.bottomStatsRow}>
          <View style={styles.statLeftCol}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect x={2} y={12} width={5} height={10} rx={2} fill="#94A3B8" />
              <Rect x={9.5} y={6} width={5} height={16} rx={2} fill="#94A3B8" />
              <Rect x={17} y={2} width={5} height={20} rx={2} fill="#94A3B8" />
            </Svg>
            <Text style={styles.statLeftText}>
              {(post.totalVotes || 643).toLocaleString()}명 투표 중
            </Text>
          </View>

          <View style={styles.statRightCol}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.statRightText}>
              {post.topComments ? post.topComments.length : 128}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const FEED_STORAGE_KEY = '@xoxo_user_feed_posts_v1';

export default function HomeScreen({ user, onLogout }: HomeScreenProps) {
  const [postsList, setPostsList] = useState(SAMPLE_POSTS);
  const [activeTab, setActiveTab] = useState<
    'feed' | 'ranking' | 'create' | 'my'
  >('feed');
  const [activeMenuType, setActiveMenuType] = useState<MyMenuType>(null);
  const [activeDetailPost, setActiveDetailPost] = useState<any | null>(null);
  const [activeCommentPostTitle, setActiveCommentPostTitle] = useState<
    string | null
  >(null);
  const [activeVoteInfo, setActiveVoteInfo] = useState<VoteInfo | undefined>(
    undefined,
  );
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    Dimensions.get('window').height,
  );

  // DB & AsyncStorage 영구 데이터 초기 로드
  useEffect(() => {
    const initPersistentPosts = async () => {
      try {
        const storedJson = await AsyncStorage.getItem(FEED_STORAGE_KEY);
        if (storedJson) {
          const parsed = JSON.parse(storedJson);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPostsList(parsed);
          }
        }
      } catch (err) {
        console.warn('AsyncStorage load error:', err);
      }
    };
    initPersistentPosts();
  }, []);

  // 새 사연 생성 시 로컬 DB(AsyncStorage) 및 Supabase Cloud DB 이중 영구 저장
  const handleAddNewPost = async (newPostData?: any) => {
    if (newPostData) {
      const updatedList = [newPostData, ...postsList];
      setPostsList(updatedList);

      // 1. AsyncStorage 기기 영구 저장 (재부팅/앱 종료 시에도유지)
      try {
        await AsyncStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.warn('AsyncStorage save error:', e);
      }

      // 2. Supabase Cloud DB 영구 서버 연동 저장
      try {
        await createPost({
          title: newPostData.title,
          content: newPostData.fullStory,
          images: newPostData.images,
        });
      } catch (dbError) {
        console.warn('Supabase DB sync notice (local DB saved):', dbError);
      }
    }
    setActiveTab('feed');
  };

  useEffect(() => {
    const onChange = ({ window }: { window: any }) => {
      setViewportHeight(window.height);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  // Compute exact 1 feed page height (Header: 52px, BottomNav space: ~96px)
  // Ensures 1 Feed fits 100% in viewport without revealing ANY part of the next feed below!
  const feedPageHeight = Math.max(540, viewportHeight - 52 - 96);

  return (
    <LinearGradient
      colors={
        activeTab === 'my' || activeTab === 'create'
          ? ['#FFFFFF', '#FFFFFF']
          : ['#FFF5F7', '#FFEBEF']
      }
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View style={styles.headerLeftSpacer} />
          {/* Logo XOXO Image Replacement */}
          <Image
            source={require('../assets/xoxo_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          {/* Notification Bell Icon or Gear Settings Icon for My Page */}
          {activeTab === 'my' ? (
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
              onPress={() => setActiveMenuType('settings_hub')}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                {/* 톱니바퀴 ⚙️ 설정 아이콘 */}
                <Path
                  d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                  stroke="#334155"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke="#334155"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.7}
            >
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
                  stroke="#BCBCBC"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <View style={styles.unreadBadgeDot} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Content Rendering */}
        {activeTab === 'feed' && (
          <View style={{ flex: 1, width: '100%' }}>
            {/* Top Category Chips Horizontal Scroll Bar */}
            <View style={{ width: '100%', paddingVertical: 10, paddingHorizontal: 16 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', gap: 8, alignItems: 'center', paddingRight: 16 }}
              >
                {['전체', '인기🔥', '연애/썸💕', '이별/재회💔', '일상/고민💬'].map((category, idx) => {
                  const isSelected = idx === 0;
                  return (
                    <TouchableOpacity
                      key={category}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                        backgroundColor: isSelected ? '#FF4D7B' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#FF4D7B' : '#E2E8F0',
                        shadowColor: isSelected ? '#FF4D7B' : 'transparent',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: isSelected ? 2 : 0,
                      }}
                      activeOpacity={0.85}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: isSelected ? '700' : '600',
                          color: isSelected ? '#FFFFFF' : '#64748B',
                        }}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 110 }}
              showsVerticalScrollIndicator={false}
              pagingEnabled={false}
            >
              {postsList.map(post => (
                <FeedCardItem
                  key={post.id}
                  post={post}
                  pageHeight={feedPageHeight}
                  onOpenComments={() => {
                    setActiveDetailPost(post);
                  }}
                  onOpenViewReview={() => setIsReviewModalVisible(true)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {activeTab === 'my' && (
          <MyPageContent
            onLogout={onLogout}
            onOpenMenu={type => setActiveMenuType(type)}
            onOpenViewReview={() => setIsReviewModalVisible(true)}
          />
        )}

        {activeTab === 'create' && (
          <CreatePageContent onComplete={handleAddNewPost} />
        )}

        {activeTab === 'ranking' && (
          <View style={styles.placeholderTabContent}>
            <Text style={styles.placeholderTabTitle}>랭킹 기능 준비 중</Text>
            <Text style={styles.placeholderTabSub}>곧 출시될 예정입니다!</Text>
          </View>
        )}

        {/* 7. Floating Glassmorphism Bottom Navigation Bar (-45° Light, Refraction 80, Depth 20, Frost 4) */}
        <View style={styles.bottomNavOuterWrapper}>
          <View style={styles.bottomNavInnerCapsule}>
            <BlurView
              intensity={35}
              tint="light"
              style={styles.glassBlurBackground}
            />
            {/* Specular Light Layer (-45°) */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.75)',
                'rgba(255, 255, 255, 0.35)',
                'rgba(255, 255, 255, 0.15)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.bottomNavContainer}>
              {/* Feed Tab (Active Option - Soft Peach Capsule) */}
              <TouchableOpacity
                style={[
                  styles.navItem,
                  activeTab === 'feed' && styles.navItemActiveCapsule,
                ]}
                onPress={() => setActiveTab('feed')}
                activeOpacity={0.85}
              >
                {/* Image 4: Feed Icon (Top Bar + Main Card + Bottom Bar) */}
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect
                    x={4}
                    y={2}
                    width={16}
                    height={2.5}
                    rx={1.25}
                    fill={activeTab === 'feed' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={2}
                    y={6}
                    width={20}
                    height={13}
                    rx={4.5}
                    fill={activeTab === 'feed' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={4}
                    y={20}
                    width={16}
                    height={2.5}
                    rx={1.25}
                    fill={activeTab === 'feed' ? '#FF4D7B' : '#BCBCBC'}
                  />
                </Svg>
                <Text
                  style={[
                    styles.navText,
                    activeTab === 'feed' && styles.navTextActive,
                  ]}
                >
                  피드
                </Text>
              </TouchableOpacity>

              {/* Ranking Tab */}
              <TouchableOpacity
                style={[
                  styles.navItem,
                  activeTab === 'ranking' && styles.navItemActiveCapsule,
                ]}
                onPress={() => setActiveTab('ranking')}
                activeOpacity={0.85}
              >
                {/* Image 2: Ranking Icon (4 Stacked Rounded Bars) */}
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect
                    x={2}
                    y={2}
                    width={20}
                    height={4.5}
                    rx={2.25}
                    fill={activeTab === 'ranking' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={2}
                    y={8}
                    width={20}
                    height={4.5}
                    rx={2.25}
                    fill={activeTab === 'ranking' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={2}
                    y={14}
                    width={20}
                    height={4.5}
                    rx={2.25}
                    fill={activeTab === 'ranking' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={2}
                    y={20}
                    width={20}
                    height={2.5}
                    rx={1.25}
                    fill={activeTab === 'ranking' ? '#FF4D7B' : '#BCBCBC'}
                  />
                </Svg>
                <Text
                  style={[
                    styles.navText,
                    activeTab === 'ranking' && styles.navTextActive,
                  ]}
                >
                  랭킹
                </Text>
              </TouchableOpacity>

              {/* Create Tab */}
              <TouchableOpacity
                style={[
                  styles.navItem,
                  activeTab === 'create' && styles.navItemActiveCapsule,
                ]}
                onPress={() => setActiveTab('create')}
                activeOpacity={0.85}
              >
                {/* Image 1: Create Memo Icon (Top Nubs + Squircle Card + White Cutout Lines) */}
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Rect
                    x={7}
                    y={1}
                    width={2.2}
                    height={4}
                    rx={1.1}
                    fill={activeTab === 'create' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={14.8}
                    y={1}
                    width={2.2}
                    height={4}
                    rx={1.1}
                    fill={activeTab === 'create' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={2}
                    y={3.5}
                    width={20}
                    height={19.5}
                    rx={5.5}
                    fill={activeTab === 'create' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Rect
                    x={6}
                    y={10.5}
                    width={10}
                    height={2.8}
                    rx={1.4}
                    fill={activeTab === 'create' ? '#FFEBF0' : '#FFFFFF'}
                  />
                  <Rect
                    x={6}
                    y={15.5}
                    width={6.5}
                    height={2.8}
                    rx={1.4}
                    fill={activeTab === 'create' ? '#FFEBF0' : '#FFFFFF'}
                  />
                </Svg>
                <Text
                  style={[
                    styles.navText,
                    activeTab === 'create' && styles.navTextActive,
                  ]}
                >
                  작성
                </Text>
              </TouchableOpacity>

              {/* My Tab */}
              <TouchableOpacity
                style={[
                  styles.navItem,
                  activeTab === 'my' && styles.navItemActiveCapsule,
                ]}
                onPress={() => setActiveTab('my')}
                activeOpacity={0.85}
              >
                {/* Image 3: My Profile Icon (Circle Head + Ellipse Body) */}
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Circle
                    cx={12}
                    cy={6.5}
                    r={5}
                    fill={activeTab === 'my' ? '#FF4D7B' : '#BCBCBC'}
                  />
                  <Ellipse
                    cx={12}
                    cy={18}
                    rx={9.5}
                    ry={5}
                    fill={activeTab === 'my' ? '#FF4D7B' : '#BCBCBC'}
                  />
                </Svg>
                <Text
                  style={[
                    styles.navText,
                    activeTab === 'my' && styles.navTextActive,
                  ]}
                >
                  마이
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* 피드 및 마이페이지 공통 메뉴/설정/피드백/문의 바텀시트 모달 */}
      <MyMenuBottomSheet
        visible={activeMenuType !== null}
        menuType={activeMenuType}
        onClose={() => setActiveMenuType(null)}
        onLogout={onLogout}
      />

      {/* 댓글 및 투표 비율 바텀시트 */}
      <CommentBottomSheet
        visible={activeCommentPostTitle !== null}
        postTitle={activeCommentPostTitle || ''}
        voteInfo={activeVoteInfo}
        onClose={() => {
          setActiveCommentPostTitle(null);
          setActiveVoteInfo(undefined);
        }}
      />

      {/* Top-level Dedicated Review Content Bottom Sheet Modal */}
      <PostDetailModal
        visible={!!activeDetailPost}
        post={activeDetailPost}
        onClose={() => setActiveDetailPost(null)}
        onOpenVoteResults={(title, voteInfo) => {
          setActiveCommentPostTitle(title);
          setActiveVoteInfo(voteInfo);
        }}
      />

      <ReviewBottomSheet
        visible={isReviewModalVisible}
        onClose={() => setIsReviewModalVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  headerLeftSpacer: {
    width: 32,
  },
  logoImage: {
    height: 28,
    width: 88,
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF858F',
  },

  // Main ScrollView & Card
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 110, // Space for bottom floating nav bar
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  snapScrollContent: {
    paddingBottom: 110, // Space for bottom floating nav bar
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
  cardPageWrapper: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  topMetaRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  hotBadgePill: {
    backgroundColor: '#FF4D7B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hotBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  categoryTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'left',
    lineHeight: 25,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  storyPreviewText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 14,
  },
  imageListRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  cardImageThumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  bottomStatsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statLeftText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  statRightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statRightText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  // Story Dropdown Card Styles
  // Case 1: No Images (Permanently expanded down to image position)
  storyNoImagesCard: {
    width: '100%',
    minHeight: 356, // 70px (pill) + 16px (gap) + 270px (image section height)
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 90% Opacity White
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    marginBottom: 16,
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Case 2: Has Images
  storyDropdownWrapper: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
    marginBottom: 16,
    minHeight: 130,
  },
  storyDropdownCardCollapsed: {
    width: '100%',
    minHeight: 130,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 90% Opacity White
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    flexDirection: 'column',
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  storyDropdownTextCollapsed: {
    width: '100%',
    fontSize: 18,
    color: '#0F172A',
    letterSpacing: -0.3,
    fontWeight: '500',
    lineHeight: 25,
    marginBottom: 6,
  },
  caretBottomRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 2,
  },
  storyDropdownCardExpandedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  storyDropdownCardExpandedToImagePos: {
    width: '100%',
    minHeight: 356, // 70px (pill) + 16px (gap) + 270px (image section height)
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 90% Opacity White
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    justifyContent: 'space-between',
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(10px) saturate(180%)',
        WebkitBackdropFilter: 'blur(10px) saturate(180%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  storyDropdownTextExpanded: {
    fontSize: 18,
    color: '#0F172A',
    lineHeight: 25,
    letterSpacing: -0.3,
    marginBottom: 12,
    fontWeight: '500',
  },
  expandedCaretUpRow: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },

  // Single Image Variant
  singleImageWrapper: {
    width: '100%',
    height: 270,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  singleImage: {
    width: '100%',
    height: '100%',
  },

  // Multi Image Variant (2+ Images)
  multiImageRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    height: 270,
    marginBottom: 16,
  },
  multiImageHalf: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  multiImage: {
    width: '100%',
    height: '100%',
  },

  // Vote Row (1.3px Distinct Tinted Borders, Equal Width Buttons, Black Text Wording)
  voteRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 14,
  },
  voteCardO: {
    flex: 1, // 1:1 동일 가로 너비
    flexBasis: 0, // Expo Mobile App 가로길이 미세차이 방지 1:1 강제
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#E3CCFF', // 또렷하고 화사한 라벤더 보라 스트로크
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  voteCardOSelected: {
    backgroundColor: '#F6EEFF',
    borderColor: '#AA6CFF',
    borderWidth: 2,
  },
  voteTextO: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextOSelected: {
    color: '#AA6CFF',
    fontWeight: '700',
  },
  voteCardX: {
    flex: 1, // 1:1 동일 가로 너비
    flexBasis: 0, // Expo Mobile App 가로길이 미세차이 방지 1:1 강제
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#FFC4D2', // 또렷하고 화사한 로즈 핑크 스트로크
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  voteCardXSelected: {
    backgroundColor: '#FFEBF0',
    borderColor: '#FF5E85',
    borderWidth: 2,
  },
  voteTextX: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextXSelected: {
    color: '#FF5E85',
    fontWeight: '700',
  },

  // Featured Comment Card (40% Opacity Soft Peach Tint + Glass Blur)
  featuredCommentPill: {
    width: '100%',
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 244, 238, 0.4)', // 40% Opacity Soft Peach Tint (#FFF4EE)
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 179, 0.35)', // 35% Opacity Peach Border (#FFC8B3)
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(10px) saturate(140%)',
        WebkitBackdropFilter: 'blur(10px) saturate(140%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  commentAnimatedContainer: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentLeftInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 10,
  },
  commentUser: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1E293B',
  },
  commentContent: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  likeCount: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569', // 댓글 본문 텍스트 색상과 100% 동일 통일 (#475569)
  },

  // Action Chips Bar (Width: 57px, Height: 40px, 70% Opacity White + Backdrop Blur + Drop Shadow + No Stroke)
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
    width: '100%',
  },
  reactionChip: {
    width: 57,
    height: 40, // 40px 높이
    borderRadius: 20, // 20px 라운딩
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  chipEmoji: {
    fontSize: 14,
  },
  chipCount: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#475569', // 댓글 본문 텍스트 색상과 100% 동일 통일 (#475569)
  },
  actionChip: {
    height: 40, // 40px 높이
    borderRadius: 20, // 20px 라운딩
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  actionChipText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionChipIconOnly: {
    width: 40, // 40px 정사각형 캡슐
    height: 40, // 40px 높이
    borderRadius: 20, // 20px 라운딩
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0, // NO STROKE
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(12px) saturate(140%)',
        WebkitBackdropFilter: 'blur(12px) saturate(140%)',
      }
      : {}),
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  // Floating Glassmorphism Bottom Navigation Bar (Expo Native App + Web Double Layer for 100% Shadow)
  bottomNavOuterWrapper: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    width: '92%',
    maxWidth: 420,
    height: 63,
    // Exact Figma Drop Shadow Spec: X: 0, Y: -3, Blur: 10, Color: #000000 5%
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'transparent',
  },
  bottomNavInnerCapsule: {
    width: '100%',
    height: '100%',
    borderRadius: 31.5,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor:
      Platform.OS === 'web'
        ? 'rgba(255, 255, 255, 0.55)'
        : 'rgba(255, 255, 255, 0.7)',
    ...(Platform.OS === 'web'
      ? {
        backdropFilter: 'blur(12px) saturate(180%)',
        WebkitBackdropFilter: 'blur(12px) saturate(180%)',
        boxShadow:
          'inset 1.5px 1.5px 3px 0px rgba(255, 255, 255, 0.9), inset -1.5px -1.5px 3px 0px rgba(0, 0, 0, 0.04), 0 -3px 10px 0px rgba(0, 0, 0, 0.05)',
      }
      : {}),
  },
  glassBlurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomNavContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  navItemActiveCapsule: {
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFEBF0',
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#BCBCBC',
    letterSpacing: -0.3,
  },
  navTextActive: {
    color: '#FF4D7B',
    fontWeight: '700',
  },
  // My Page Component Styles
  myPageScrollView: {
    flex: 1,
    width: '100%',
  },
  myPageContentContainer: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  mySection: {
    marginBottom: 30,
  },
  mySectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mySectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  mySectionCountBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF8E7A',
    backgroundColor: '#FFF7F5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  myAccountBox: {
    width: '100%',
    height: 56,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    borderWidth: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  myAccountEmail: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
    letterSpacing: -0.3,
  },
  myPostCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 18,
    marginBottom: 14,
  },
  myPostTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  myPostVoteBarWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  myPostVoteBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 6,
  },
  myPostVoteBarO: {
    backgroundColor: '#FFC8B3', // 피드의 연한 피치 오렌지 O 색상
    height: '100%',
  },
  myPostVoteBarX: {
    backgroundColor: '#FFB4BB', // 피드의 연한 코랄 핑크 X 색상
    height: '100%',
  },
  myPostVotePercentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myPostVotePercentO: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF8E7A',
  },
  myPostVotePercentX: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF858F', // 피드의 X 코랄 핑크 텍스트 색상
  },
  myPostCardBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8F8F8',
  },
  myPostMetaCol: {
    flex: 1,
    marginRight: 12,
  },
  myPostMetaRow1: {
    fontSize: 13.5,
    color: '#9C9C9C',
    marginBottom: 4,
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  myPostMetaRow2: {
    fontSize: 13.5,
    color: '#9C9C9C',
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  myPostReviewBtn: {
    width: 96,
    height: 38,
    backgroundColor: '#FF8E7A',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  myPostReviewedBtn: {
    width: 96,
    height: 38,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myPostReviewedBtnText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '600',
  },
  myMenuTileRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  myMenuTileCard: {
    flex: 1,
    height: 54,
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    borderWidth: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myMenuTileTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9C9C9C', // 회색 글자
    letterSpacing: -0.3,
  },
  placeholderTabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  placeholderTabTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  placeholderTabSub: {
    fontSize: 15,
    color: '#9C9C9C',
  },

  // ----------------------------------------------------
  // 작성 화면 스타일 (Create Screen Styles)
  // ----------------------------------------------------
  createScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  createContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
  createSection: {
    marginBottom: 28,
  },
  createSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  createSectionSub: {
    fontSize: 14,
    color: '#9C9C9C',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  titleInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 16,
    paddingRight: 60,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    letterSpacing: -0.3,
  },
  charCounter: {
    position: 'absolute',
    right: 16,
    top: 18,
    fontSize: 13,
    color: '#9C9C9C',
    fontWeight: '400',
  },
  detailInput: {
    width: '100%',
    height: 160,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    letterSpacing: -0.3,
  },
  imageScrollRow: {
    flexDirection: 'row',
  },
  uploadSlotBtn: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptySlot: {
    width: 104,
    height: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },
  imageSlot: {
    width: 104,
    height: 104,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  uploadedImg: {
    width: '100%',
    height: '100%',
  },
  removeImgBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImgText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF8E7A',
    borderWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#FF8E7A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#FFFFFF',
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  submitButtonTextDisabled: {
    color: '#9C9C9C',
    fontWeight: '700',
  },
});
