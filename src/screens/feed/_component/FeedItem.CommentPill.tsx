import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LikeSvg } from '../_svg';

interface CommentItem {
  id: string;
  user: string;
  text: string;
  likes: number;
}

interface FeedItemCommentPillProps {
  comments?: CommentItem[];
  postTitle: string;
  onPress: (title: string) => void;
}

export function FeedItemCommentPill({
  comments,
  postTitle,
  onPress,
}: FeedItemCommentPillProps) {
  const [commentIndex, setCommentIndex] = useState(0);

  const translateYAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const currentComment =
    comments && comments.length > 0
      ? comments[commentIndex] || comments[0]
      : { id: 'default', user: '익명', text: '의견을 남겨주세요!', likes: 0 };

  // 3-second rolling comment timer
  useEffect(() => {
    if (!comments || comments.length <= 1) return;

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
        setCommentIndex(prev => (prev + 1) % comments.length);
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
  }, [translateYAnim, opacityAnim, comments]);

  return (
    <TouchableOpacity
      style={styles.featuredCommentPill}
      onPress={() => onPress(postTitle)}
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
          <LikeSvg />
          <Text style={styles.likeCount}>{currentComment.likes}</Text>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
