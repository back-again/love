import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuestionTitleArea } from './_area/QuestionTitle.area';
import { CategorySelectArea } from './_area/CategorySelect.area';
import { DetailSituationArea } from './_area/DetailSituation.area';
import { ImageAttachmentArea } from './_area/ImageAttachment.area';
import { VoteOptionSettingArea } from './_area/VoteOptionSetting.area';
import { CreateSubmitAction } from './_action/CreateSubmit.action';
import { LoadProvider } from './_provider/Load.provider';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LoadProvider>
      <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
        <ScrollView
          style={styles.createScrollView}
          contentContainerStyle={[
            styles.createContentContainer,
            { paddingTop: insets.top + 60 + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <CategorySelectArea />
          <QuestionTitleArea />
          <DetailSituationArea />
          <ImageAttachmentArea />
          <VoteOptionSettingArea />

          <CreateSubmitAction />
        </ScrollView>
      </LinearGradient>
    </LoadProvider>
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
