import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { Post } from '../_model/feed.model';

interface FeedItemProps {
  post: Post;
  pageHeight: number;
  onOpenComments: (title: string) => void;
  onOpenViewReview: () => void;
}

export function FeedItem({
  post,
  pageHeight,
  onOpenComments,
  onOpenViewReview,
}: FeedItemProps) {
  const [selectedVote, setSelectedVote] = useState<'O' | 'X' | null>(null);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);
  const [commentIndex, setCommentIndex] = useState(0);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const currentComment =
    post.topComments && post.topComments.length > 0
      ? post.topComments[commentIndex] || post.topComments[0]
      : { id: 'default', user: '익명', text: '의견을 남겨주세요!', likes: 0 };

  // 3-second rolling comment timer
  useEffect(() => {
    if (!post.topComments || post.topComments.length <= 1) return;

    const timer = setInterval(() => {
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: -12,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCommentIndex(prev => (prev + 1) % post.topComments.length);
        translateYAnim.setValue(12);

        Animated.parallel([
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [translateYAnim, opacityAnim, post.topComments]);

  return (
    <View style={[styles.cardPageWrapper, { height: pageHeight }]}>
      <View style={styles.cardContainer}>
        {/* 1. Main Title Question */}
        <Text style={styles.questionTitle}>{post.title}</Text>

        {/* 2. Sub Story Dropdown Card */}
        {post.images.length === 0 ? (
          /* Case 1: No Images -> Permanently expanded */
          <View style={styles.storyNoImagesCard}>
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={35}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={styles.storyDropdownTextExpanded}>
              {post.fullStory}
            </Text>
          </View>
        ) : (
          /* Case 2: Has Images -> Collapsed / Expanded toggle */
          <View style={styles.storyDropdownWrapper}>
            {!isStoryExpanded ? (
              <TouchableOpacity
                style={styles.storyDropdownCardCollapsed}
                onPress={() => setIsStoryExpanded(true)}
                activeOpacity={0.85}
              >
                {Platform.OS !== 'web' && (
                  <BlurView
                    intensity={35}
                    tint="light"
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Text
                  style={styles.storyDropdownTextCollapsed}
                  numberOfLines={2}
                >
                  {post.storySummary}
                </Text>
                <Svg width={14} height={10} viewBox="0 0 24 24">
                  <Polygon points="4,6 20,6 12,18" fill="#0F172A" />
                </Svg>
              </TouchableOpacity>
            ) : (
              <View style={styles.storyDropdownCardExpandedContainer}>
                <TouchableOpacity
                  style={styles.storyDropdownCardExpandedToImagePos}
                  onPress={() => setIsStoryExpanded(false)}
                  activeOpacity={0.95}
                >
                  {Platform.OS !== 'web' && (
                    <BlurView
                      intensity={35}
                      tint="light"
                      style={StyleSheet.absoluteFillObject}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.storyDropdownTextExpanded}>
                      {post.fullStory}
                    </Text>
                  </View>
                  <View style={styles.expandedCaretUpRow}>
                    <Svg width={14} height={10} viewBox="0 0 24 24">
                      <Polygon points="12,6 4,18 20,18" fill="#0F172A" />
                    </Svg>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* 3. Image Section */}
        {post.images.length === 1 && (
          <View style={styles.singleImageWrapper}>
            <Image
              source={{ uri: post.images[0] }}
              style={styles.singleImage}
              resizeMode="cover"
            />
          </View>
        )}

        {post.images.length >= 2 && (
          <View style={styles.multiImageRow}>
            <View style={styles.multiImageHalf}>
              <Image
                source={{ uri: post.images[0] }}
                style={styles.multiImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.multiImageHalf}>
              <Image
                source={{ uri: post.images[1] }}
                style={styles.multiImage}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* 4. Top 3 Rolling Featured Comment Card */}
        <TouchableOpacity
          style={styles.featuredCommentPill}
          onPress={() => onOpenComments(post.title)}
          activeOpacity={0.85}
        >
          {Platform.OS !== 'web' && (
            <BlurView
              intensity={20}
              tint="light"
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <Animated.View
            style={[
              styles.commentAnimatedContainer,
              {
                transform: [{ translateY: translateYAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.commentLeftInfo}>
              <Text style={styles.commentUser}>{currentComment.user}</Text>
              <Text style={styles.commentContent} numberOfLines={1}>
                {currentComment.text}
              </Text>
            </View>
            <TouchableOpacity style={styles.likeButton} activeOpacity={0.7}>
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
                  stroke="#475569"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.likeCount}>{currentComment.likes}</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>

        {/* 5. O / X Vote Cards */}
        <View style={styles.voteRow}>
          <TouchableOpacity
            style={[
              styles.voteCardO,
              selectedVote === 'O' && styles.voteCardOSelected,
            ]}
            onPress={() => setSelectedVote(selectedVote === 'O' ? null : 'O')}
            activeOpacity={0.85}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Circle
                cx={12}
                cy={12}
                r={9}
                stroke="#FF8E7A"
                strokeWidth={3}
                fill="none"
              />
            </Svg>
            <Text
              style={[
                styles.voteTextO,
                selectedVote === 'O' && styles.voteTextOSelected,
              ]}
            >
              {post.voteO}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.voteCardX,
              selectedVote === 'X' && styles.voteCardXSelected,
            ]}
            onPress={() => setSelectedVote(selectedVote === 'X' ? null : 'X')}
            activeOpacity={0.85}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#FF858F"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </Svg>
            <Text
              style={[
                styles.voteTextX,
                selectedVote === 'X' && styles.voteTextXSelected,
              ]}
            >
              {post.voteX}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 6. Reactions & Action Chips Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reactionsRow}
        >
          <View style={styles.reactionChip}>
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={styles.chipEmoji}>🔥</Text>
            <Text style={styles.chipCount}>{post.fireCount}</Text>
          </View>

          <View style={styles.reactionChip}>
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text style={styles.chipEmoji}>🤦‍♀️</Text>
            <Text style={styles.chipCount}>{post.facepalmCount}</Text>
          </View>

          <TouchableOpacity
            style={styles.reactionChip}
            onPress={() => onOpenComments(post.title)}
            activeOpacity={0.8}
          >
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect
                x={3}
                y={4}
                width={18}
                height={13}
                rx={4.5}
                stroke="#475569"
                strokeWidth={2}
              />
              <Path
                d="M7 17l-2.5 3v-3"
                stroke="#475569"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle cx={8} cy={10.5} r={1} fill="#475569" />
              <Circle cx={12} cy={10.5} r={1} fill="#475569" />
              <Circle cx={16} cy={10.5} r={1} fill="#475569" />
            </Svg>
            <Text style={styles.chipCount}>{post.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChip}
            onPress={() => {
              if (post.hasReview) {
                onOpenViewReview();
              } else {
                if (Platform.OS === 'web')
                  alert('작성자에게 후기 요청이 전달되었습니다!');
                else
                  Alert.alert('완료', '작성자에게 후기 요청이 전달되었습니다!');
              }
            }}
            activeOpacity={0.8}
          >
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Rect
                x={3}
                y={5}
                width={18}
                height={14}
                rx={4}
                stroke="#334155"
                strokeWidth={2}
              />
              <Path
                d="M4.5 7.5l7.5 5 7.5-5"
                stroke="#334155"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={styles.actionChipText}>
              {post.hasReview ? '후기 보기' : '후기 요청'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionChipIconOnly}
            activeOpacity={0.8}
          >
            {Platform.OS !== 'web' && (
              <BlurView
                intensity={25}
                tint="light"
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M7 17c0-4.5 3-8 8.5-8H18M15 5l5 4-5 4"
                stroke="#334155"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPageWrapper: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 16,
    marginTop: 0,
  },
  storyNoImagesCard: {
    width: '100%',
    minHeight: 356,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow: 'hidden',
    borderWidth: 0,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderWidth: 0,
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
    minHeight: 356,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    overflow: 'hidden',
    borderWidth: 0,
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
  featuredCommentPill: {
    width: '100%',
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 244, 238, 0.4)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 179, 0.35)',
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
    color: '#475569',
  },
  voteRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 14,
  },
  voteCardO: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#FFC8B3',
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
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextOSelected: {
    color: '#FF8E7A',
    fontWeight: '700',
  },
  voteCardX: {
    flex: 1,
    flexBasis: 0,
    flexGrow: 1,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.3,
    borderColor: '#FFB4BB',
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
    fontWeight: '500',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  voteTextXSelected: {
    color: '#FF858F',
    fontWeight: '700',
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
    width: '100%',
  },
  reactionChip: {
    width: 57,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
    borderWidth: 0,
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
    color: '#475569',
  },
  actionChip: {
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    overflow: 'hidden',
    borderWidth: 0,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0,
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
});
