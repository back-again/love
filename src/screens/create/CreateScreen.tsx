import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QuestionTitleArea } from './_area/QuestionTitle.area';
import { DetailSituationArea } from './_area/DetailSituation.area';
import { ImageAttachmentArea } from './_area/ImageAttachment.area';
import { CreateSubmitAction } from './_action/CreateSubmit.action';

export default function CreateScreen() {
  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.createScrollView}
        contentContainerStyle={styles.createContentContainer}
        showsVerticalScrollIndicator={false}
      >
        <QuestionTitleArea />
        <DetailSituationArea />
        <ImageAttachmentArea />

        <CreateSubmitAction />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  createScrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  createContentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 120,
  },
});
