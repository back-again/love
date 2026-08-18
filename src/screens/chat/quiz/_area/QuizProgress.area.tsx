import React from 'react';
import { StyleSheet, View } from 'react-native';
import { QuizProgressBarAction } from '../_action/QuizProgressBar.action';

export function QuizProgressArea() {
  return (
    <View style={styles.progressBarTrack}>
      <QuizProgressBarAction />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    marginBottom: 20,
    overflow: 'hidden',
  },
});
