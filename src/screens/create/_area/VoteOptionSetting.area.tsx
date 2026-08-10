import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { generateAiVoteOptions } from '@/screens/feed/_lib/getFeedPosts.lib';
import Svg, { Path } from 'react-native-svg';

export function VoteOptionSettingArea() {
  const {
    questionTitle,
    detailSituation,
    voteO,
    voteX,
    setVoteO,
    setVoteX,
  } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      voteO: state.voteO,
      voteX: state.voteX,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
    }))
  );

  // Auto-prefill AI options if title or content changes and options are empty
  useEffect(() => {
    if ((questionTitle.length > 2 || detailSituation.length > 5) && (!voteO || !voteX)) {
      const options = generateAiVoteOptions(questionTitle, detailSituation);
      if (!voteO) setVoteO(options.voteO);
      if (!voteX) setVoteX(options.voteX);
    }
  }, [questionTitle, detailSituation]);

  const handleGenerateAi = () => {
    const options = generateAiVoteOptions(questionTitle, detailSituation);
    setVoteO(options.voteO);
    setVoteX(options.voteX);
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>🗳️ O/X 투표 선택지 설정</Text>
        <TouchableOpacity
          style={styles.aiRecommendBtn}
          onPress={handleGenerateAi}
          activeOpacity={0.8}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z"
              fill="#FF5D7B"
            />
          </Svg>
          <Text style={styles.aiRecommendText}>AI 추천 선택지</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionSub}>
        글 내용을 분석하여 AI가 찬반 선택지를 제안합니다. 직접 수정할 수도 있어요!
      </Text>

      {/* Option O Input */}
      <View style={styles.inputGroup}>
        <View style={styles.badgeO}>
          <Text style={styles.badgeTextO}>O</Text>
        </View>
        <TextInput
          style={styles.optionInput}
          placeholder="예: 괜찮은 것 같아"
          placeholderTextColor="#9C9C9C"
          value={voteO}
          onChangeText={setVoteO}
          maxLength={20}
        />
      </View>

      {/* Option X Input */}
      <View style={styles.inputGroup}>
        <View style={styles.badgeX}>
          <Text style={styles.badgeTextX}>X</Text>
        </View>
        <TextInput
          style={styles.optionInput}
          placeholder="예: 난 별로야"
          placeholderTextColor="#9C9C9C"
          value={voteX}
          onChangeText={setVoteX}
          maxLength={20}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  aiRecommendBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8F8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  aiRecommendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF5D7B',
  },
  sectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeO: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF2F4',
    borderWidth: 1,
    borderColor: '#FFD1DC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextO: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FF5D7B',
  },
  badgeX: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextX: {
    fontSize: 16,
    fontWeight: '800',
    color: '#64748B',
  },
  optionInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
});
