import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WrittenPostsArea } from './_area/WrittenPosts.area';
import FeedbackScreen from '@/screens/feedback/FeedbackScreen';
import InquiryScreen from '@/screens/inquiry/InquiryScreen';

export default function MyScreen() {
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [isInquiryVisible, setIsInquiryVisible] = useState(false);

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.myPageScrollView}
        contentContainerStyle={styles.myPageContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <WrittenPostsArea />

        {/* 2. 피드백 보내기 & 문의 사항 슬림 타일 버튼 Grid */}
        <View style={styles.myMenuTileRow}>
          <TouchableOpacity
            style={styles.myMenuTileCard}
            onPress={() => setIsFeedbackVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.myMenuTileTitle}>피드백 보내기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.myMenuTileCard}
            onPress={() => setIsInquiryVisible(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.myMenuTileTitle}>문의 사항</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <FeedbackScreen
        visible={isFeedbackVisible}
        onClose={() => setIsFeedbackVisible(false)}
      />

      <InquiryScreen
        visible={isInquiryVisible}
        onClose={() => setIsInquiryVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    color: '#9C9C9C',
    letterSpacing: -0.3,
  },
});
