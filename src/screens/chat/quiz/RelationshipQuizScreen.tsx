'use client';

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useQueryClient } from '@tanstack/react-query';
import { CenterModal } from '@/components/modal';
import { useRelationshipQuizModalStore } from '../_state/useRelationshipQuizModalStore';
import { saveRelationshipProfileLib } from '../_lib/relationshipProfile.lib';
import { QUIZ_QUESTIONS, calculateProfileMatch } from './_lib/quizData.lib';

export function RelationshipQuizScreen() {
  const queryClient = useQueryClient();
  const { visible, closeQuizModal } = useRelationshipQuizModalStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  if (!visible) return null;

  const handleSelectOption = (trait: string) => {
    const updatedAnswers = { ...answers, [currentStep]: trait };
    setAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const resultProfile = calculateProfileMatch(updatedAnswers);
      saveRelationshipProfileLib(resultProfile);
      queryClient.invalidateQueries({ queryKey: ['relationshipProfile'] });
      setCurrentStep(0);
      setAnswers({});
      closeQuizModal();
    }
  };

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <CenterModal
      visible={visible}
      onClose={closeQuizModal}
      maxWidth={420}
      width="92%"
      dismissOnBackdropPress={true}
    >
      <View style={styles.modalCard}>
        {/* Header Bar */}
        <View style={styles.modalHeaderRow}>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.modalTitle}>내 연애 추구미 분석</Text>
            <Text style={styles.stepBadge}>
              {currentStep + 1} / {QUIZ_QUESTIONS.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeBtn}
            onPress={closeQuizModal}
            activeOpacity={0.7}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M18 6L6 18M6 6l12 12"
                stroke="#8F8F8F"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Progress Line */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              },
            ]}
          />
        </View>

        {/* Question & Option Cards */}
        <ScrollView
          style={styles.quizScrollView}
          contentContainerStyle={styles.quizContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.questionText}>{currentQ.question}</Text>

          <View style={styles.optionsWrap}>
            {currentQ.options.map((opt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.optionBtn}
                onPress={() => handleSelectOption(opt.trait)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{opt.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </CenterModal>
  );
}

const styles = StyleSheet.create({
  modalCard: {
    padding: 24,
    maxHeight: 520,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF5D7B',
    backgroundColor: '#FFEBF0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF5D7B',
    borderRadius: 2,
  },
  quizScrollView: {
    maxHeight: 400,
  },
  quizContentContainer: {
    paddingBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 23,
    marginBottom: 20,
  },
  optionsWrap: {
    gap: 12,
  },
  optionBtn: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 20,
  },
});
