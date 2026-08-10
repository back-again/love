import React, { useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { QuestionTitleArea } from './_area/QuestionTitle.area';
import { DetailSituationArea } from './_area/DetailSituation.area';
import { ImageAttachmentArea } from './_area/ImageAttachment.area';
import { VoteOptionSettingArea } from './_area/VoteOptionSetting.area';
import { CreateSubmitAction } from './_action/CreateSubmit.action';
import { useCreateForm } from './_state/useCreateForm';

export default function CreateScreen() {
  // 작성 화면에서 이탈 시 (언마운트 시) 작성 중이던 모든 폼 데이터 완전 초기화
  useEffect(() => {
    return () => {
      useCreateForm.getState().reset();
    };
  }, []);

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
        <VoteOptionSettingArea />

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
