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
import { inspectPostQualityWithAi } from '../_lib/aiModeration.lib';
import { RetrySvg } from '../_svg/RetrySvg';

function generateAiVoteOptions(title: string, detail: string): { oText: string; xText: string } {
  const text = `${title} ${detail}`.toLowerCase();

  if (text.includes('이별') || text.includes('헤어') || text.includes('끝')) {
    return { oText: '헤어지는 게 맞아', xText: '한 번 더 대화해봐' };
  }
  if (text.includes('연락') || text.includes('카톡') || text.includes('전화') || text.includes('답장')) {
    return { oText: '서운할 만해', xText: '이해해 줘야 해' };
  }
  if (text.includes('더치') || text.includes('돈') || text.includes('계산') || text.includes('비용')) {
    return { oText: '정나미 떨어져', xText: '솔직해서 괜찮아' };
  }
  if (text.includes('고백') || text.includes('짝사랑') || text.includes('마음')) {
    return { oText: '지금 고백해!', xText: '조금 더 지켜봐' };
  }
  if (text.includes('바람') || text.includes('여사친') || text.includes('남사친') || text.includes('클럽')) {
    return { oText: '선 넘은 거지', xText: '믿어줘야 해' };
  }
  if (text.includes('선물') || text.includes('기념일') || text.includes('생일')) {
    return { oText: '마음이 부족해', xText: '센스가 아쉬워' };
  }
  if (text.includes('결혼') || text.includes('시댁') || text.includes('부모')) {
    return { oText: '신중히 고민해', xText: '대화로 맞춰가' };
  }

  return { oText: '괜찮은 것 같아', xText: '난 별로야' };
}

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

  const progressAnim = useRef(new Animated.Value(0)).current;

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
        const generated = generateAiVoteOptions(questionTitle, detailSituation);
        setVoteO(generated.oText);
        setVoteX(generated.xText);
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
                <RetrySvg />
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
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeTextX: {
    fontSize: 16,
    fontWeight: '800',
    color: '#727272',
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
  optionInputActive: {
    borderColor: '#FFB5C5',
    borderWidth: 1,
  },
});
