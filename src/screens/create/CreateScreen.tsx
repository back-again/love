import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { QuestionTitleArea } from './_area/QuestionTitle.area';
import { CategorySelectArea } from './_area/CategorySelect.area';
import { DetailSituationArea } from './_area/DetailSituation.area';
import { ImageAttachmentArea } from './_area/ImageAttachment.area';
import { VoteOptionSettingArea } from './_area/VoteOptionSetting.area';
import { CreateSubmitAction } from './_action/CreateSubmit.action';
import { useCreateLoad } from './_state/useCreateLoad';

export default function CreateScreen() {
  useCreateLoad();
  const insets = useSafeAreaInsets();

  const navBottom = insets.bottom > 0 ? insets.bottom : 16;
  const bottomNavHeight = 63;
  const buttonBottomOffset = navBottom + bottomNavHeight + 12;
  const scrollBottomPadding = buttonBottomOffset + 56 + 24;

  return (
    <LinearGradient colors={['#FFFFFF', '#FFFFFF']} style={styles.container}>
      <ScrollView
        style={styles.createScrollView}
        contentContainerStyle={[
          styles.createContentContainer,
          { paddingTop: 16, paddingBottom: scrollBottomPadding },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <CategorySelectArea />
        <QuestionTitleArea />
        <DetailSituationArea />
        <ImageAttachmentArea />
        <VoteOptionSettingArea />
      </ScrollView>

      <View
        style={[
          styles.floatingButtonContainer,
          { bottom: buttonBottomOffset },
        ]}
        pointerEvents="box-none"
      >
        <CreateSubmitAction />
      </View>
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
    gap: 24,
  },
  floatingButtonContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 100,
  },
});
