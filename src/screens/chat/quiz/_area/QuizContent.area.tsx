import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { QuizQuestionTextAction } from '../_action/QuizQuestionText.action';
import { QuizOptionListAction } from '../_action/QuizOptionList.action';

export function QuizContentArea() {
  return (
    <ScrollView
      style={styles.quizScrollView}
      contentContainerStyle={styles.quizContentContainer}
      showsVerticalScrollIndicator={false}
    >
      <QuizQuestionTextAction />
      <QuizOptionListAction />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  quizScrollView: {
    maxHeight: 400,
  },
  quizContentContainer: {
    paddingBottom: 8,
  },
});
