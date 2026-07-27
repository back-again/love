import React, { useState, useEffect, useRef } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect, Ellipse, Polygon } from 'react-native-svg';

export default function CreateScreen() {
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
    // 방금 추가한 사진이 '+' 버튼 바로 우측(맨 앞)에 위치하고 먼저 추가한 사진이 오른쪽으로 밀려남
    setImages(prev => [sampleImgs[prev.length % sampleImgs.length], ...prev]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const isFormValid =
    questionTitle.trim().length > 0 && detailSituation.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) return;
    if (Platform.OS === 'web')
      alert('오답노트에 사연이 성공적으로 등록되었습니다!');
    else Alert.alert('완료', '오답노트에 사연이 성공적으로 등록되었습니다!');

    // onComplete();
  };

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
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
    paddingHorizontal: 24,
    paddingTop: 20, // 상단바와의 마진 20px 지정
    paddingBottom: 16,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },

  // Question Title
  questionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 16,
    marginTop: 0, // 상단바 패딩 10px과 결합하여 정확히 10px 상단 마진 유지
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
    height: 70,
  },
  storyDropdownCardCollapsed: {
    width: '100%',
    height: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 90% Opacity White
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    flex: 1,
    fontSize: 18,
    color: '#0F172A',
    marginRight: 10,
    letterSpacing: -0.3,
    fontWeight: '500',
    lineHeight: 25,
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
    borderWidth: 1.3, // 1.3px 두께
    borderColor: '#FFC8B3', // 또렷하고 선명한 피치 주황 스트로크
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
    backgroundColor: '#FFF7F5',
    borderColor: '#FF8E7A',
    borderWidth: 2,
  },
  voteTextO: {
    fontSize: 14,
    fontWeight: '500', // 볼드 처리 제거 (노멀 500)
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextOSelected: {
    color: '#FF8E7A',
    fontWeight: '700',
  },
  voteCardX: {
    flex: 1, // 1:1 동일 가로 너비
    flexBasis: 0, // Expo Mobile App 가로길이 미세차이 방지 1:1 강제
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3, // 1.3px 두께
    borderColor: '#FFB4BB', // 또렷하고 선명한 코랄 핑크 스트로크
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
    backgroundColor: '#FFF0F1',
    borderColor: '#FF858F',
    borderWidth: 2,
  },
  voteTextX: {
    fontSize: 14,
    fontWeight: '500', // 볼드 처리 제거 (노멀 500)
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextXSelected: {
    color: '#FF858F',
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
    backgroundColor: '#FFF4EE',
  },
  navText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#BCBCBC',
    letterSpacing: -0.3,
  },
  navTextActive: {
    color: '#FF8E7A',
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
