import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Platform,
  Switch,
  Animated,
} from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { generateAiVoteOptions } from '../_lib/generateVoteOptions.lib';

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
  const [focusedField, setFocusedField] = useState<'O' | 'X' | null>(null);

  const lastAnalyzedKeyRef = useRef<string>('');
  const progressAnim = useRef(new Animated.Value(0)).current;

  const runAiAnalysis = () => {
    const currentKey = `${questionTitle.trim()}:::${detailSituation.trim()}`;

    // If options are already filled and title/detail haven't changed, don't call AI again!
    if (lastAnalyzedKeyRef.current === currentKey && (voteO || voteX)) {
      return;
    }

    setIsLoadingAi(true);
    progressAnim.setValue(0);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 850,
      useNativeDriver: false,
    }).start(async () => {
      const generated = await generateAiVoteOptions(questionTitle, detailSituation);
      lastAnalyzedKeyRef.current = currentKey;
      setVoteO(generated.oText);
      setVoteX(generated.xText);
      setIsLoadingAi(false);
    });
  };

  const handleToggleVote = (nextEnabled: boolean) => {
    setIsVoteEnabled(nextEnabled);
    if (nextEnabled) {
      runAiAnalysis();
    } else {
      setIsLoadingAi(false);
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
          trackColor={{ false: '#D6D6D6', true: '#FF5D7B' }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#D6D6D6"
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
                focusedField === 'O' && styles.optionInputActiveO,
                Platform.OS === 'web' && focusedField === 'O'
                  ? ({ boxShadow: '0 0 0 3px rgba(139, 117, 249, 0.15)' } as any)
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
                focusedField === 'X' && styles.optionInputActiveX,
                Platform.OS === 'web' && focusedField === 'X'
                  ? ({ boxShadow: '0 0 0 3px rgba(249, 117, 141, 0.15)' } as any)
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
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#FF5D7B',
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
    backgroundColor: '#F5F1FF',
    borderWidth: 1,
    borderColor: '#E8E3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextO: {
    fontSize: 16,
    fontWeight: '800',
    color: '#8B75F9',
  },
  badgeX: {
    width: 38,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF3F4',
    borderWidth: 1,
    borderColor: '#FFE3E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextX: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F9758D',
  },
  optionInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  optionInputActiveO: {
    borderColor: '#8B75F9',
    borderWidth: 1,
  },
  optionInputActiveX: {
    borderColor: '#F9758D',
    borderWidth: 1,
  },
});
