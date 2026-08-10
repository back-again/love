import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Switch,
  Animated,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { generateAiVoteOptions } from '@/screens/feed/_lib/getFeedPosts.lib';
import { inspectPostQualityWithAi } from '../_lib/aiModeration.lib';
import Svg, { Path } from 'react-native-svg';

export function VoteOptionSettingArea() {
  const {
    questionTitle,
    detailSituation,
    voteO,
    voteX,
    isVoteEnabled,
    setVoteO,
    setVoteX,
    setIsVoteEnabled,
  } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      detailSituation: state.detailSituation,
      voteO: state.voteO,
      voteX: state.voteX,
      isVoteEnabled: state.isVoteEnabled,
      setVoteO: state.setVoteO,
      setVoteX: state.setVoteX,
      setIsVoteEnabled: state.setIsVoteEnabled,
    }))
  );

  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'invalid'>('idle');
  const [focusedField, setFocusedField] = useState<'O' | 'X' | null>(null);

  // Animated Progress Gauge Value (0 to 1)
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Auto-analyze title and situation content with AI loading gauge
  const runAiAnalysis = () => {
    setIsLoadingAi(true);
    setAiStatus('idle');
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 850,
      useNativeDriver: false,
    }).start(() => {
      setIsLoadingAi(false);

      const inspection = inspectPostQualityWithAi(questionTitle, detailSituation);

      if (!inspection.isValid) {
        setAiStatus('invalid');
      } else {
        setAiStatus('idle');
        const options = generateAiVoteOptions(questionTitle, detailSituation);
        setVoteO(options.voteO);
        setVoteX(options.voteX);
      }
    });
  };

  const handleToggleVote = (nextEnabled: boolean) => {
    setIsVoteEnabled(nextEnabled);
    if (nextEnabled) {
      runAiAnalysis();
    } else {
      setIsLoadingAi(false);
      setAiStatus('idle');
    }
  };

  const progressPercent = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.createSection}>
      {/* Header Row: Title & Switch Toggle */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.createSectionTitle}>OX로 빠른 의견 받기</Text>
          <Text style={styles.createSectionSub}>
            AI가 사연을 분석해 맞춤 선택지를 제안합니다.
          </Text>
        </View>

        {/* Clean Switch Toggle */}
        <Switch
          value={isVoteEnabled}
          onValueChange={handleToggleVote}
          trackColor={{ false: '#E2E8F0', true: '#FF5D7B' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E2E8F0"
        />
      </View>

      {/* When Vote Enabled: Clean Inline Input Fields */}
      {isVoteEnabled && (
        <View style={styles.voteFieldsContainer}>
          {/* AI Loading Progress Line */}
          {isLoadingAi && (
            <View style={styles.loadingProgressWrap}>
              <View style={styles.loadingTextRow}>
                <Text style={styles.loadingTitleText}>AI가 사연을 분석하고 있어요...</Text>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressBarFill, { width: progressPercent }]} />
              </View>
            </View>
          )}

          {/* Option O Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.badgeO}>
              <Text style={styles.badgeTextO}>O</Text>
            </View>
            <TextInput
              style={[
                styles.optionInput,
                focusedField === 'O' && styles.optionInputActive,
                Platform.OS === 'web' && focusedField === 'O'
                  ? ({ boxShadow: '0 0 0 3px rgba(255, 181, 197, 0.25)' } as any)
                  : {},
              ]}
              placeholder="O 선택지 직접 입력 (예: 괜찮은 것 같아)"
              placeholderTextColor="#8F8F8F"
              value={voteO}
              onChangeText={setVoteO}
              onFocus={() => setFocusedField('O')}
              onBlur={() => setFocusedField(null)}
              maxLength={20}
            />
          </View>

          {/* Option X Input Row */}
          <View style={styles.inputRow}>
            <View style={styles.badgeX}>
              <Text style={styles.badgeTextX}>X</Text>
            </View>
            <TextInput
              style={[
                styles.optionInput,
                focusedField === 'X' && styles.optionInputActive,
                Platform.OS === 'web' && focusedField === 'X'
                  ? ({ boxShadow: '0 0 0 3px rgba(255, 181, 197, 0.25)' } as any)
                  : {},
              ]}
              placeholder="X 선택지 직접 입력 (예: 난 별로야)"
              placeholderTextColor="#8F8F8F"
              value={voteX}
              onChangeText={setVoteX}
              onFocus={() => setFocusedField('X')}
              onBlur={() => setFocusedField(null)}
              maxLength={20}
            />
          </View>

          {/* Insufficient Content Warning & Retry Icon Button BELOW Option Inputs */}
          {!isLoadingAi && aiStatus === 'invalid' && (
            <View style={styles.warningRowBelow}>
              <Text style={styles.warningTitleText}>분석할 내용이 부족합니다.</Text>
              <TouchableOpacity
                style={styles.retryIconBtn}
                onPress={runAiAnalysis}
                activeOpacity={0.7}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.57 2.57L21 8M21 3v5h-5"
                    stroke="#FF5D7B"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  createSection: {
    marginBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleWrap: {
    flex: 1,
    paddingRight: 16,
  },
  createSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  createSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    letterSpacing: -0.3,
  },
  voteFieldsContainer: {
    width: '100%',
    marginTop: 4,
  },
  loadingProgressWrap: {
    marginBottom: 12,
  },
  loadingTextRow: {
    marginBottom: 6,
  },
  loadingTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5D7B',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FF5D7B',
  },
  warningRowBelow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    paddingHorizontal: 2,
  },
  warningTitleText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#E11D48',
  },
  retryIconBtn: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRow: {
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
  optionInputActive: {
    borderColor: '#FFB5C5',
    borderWidth: 1,
  },
});
