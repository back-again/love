import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CategorySelectAction } from './_action/CategorySelect.action';
import { QuestionTitleInputAction } from './_action/QuestionTitleInput.action';
import { DetailSituationInputAction } from './_action/DetailSituationInput.action';
import { ImageAttachmentPickerAction } from './_action/ImageAttachmentPicker.action';
import { VoteOptionSettingArea } from './_area/VoteOptionSetting.area';
import { CreateSubmitAction } from './_action/CreateSubmit.action';

export default function CreateScreen() {
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
        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>
            카테고리를 선택해 주세요
            <Text style={styles.requiredAsterisk}> *</Text>
          </Text>
          <CategorySelectAction />
        </View>

        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>
            무엇을 물어볼까요?
            <Text style={styles.requiredAsterisk}> *</Text>
          </Text>
          <QuestionTitleInputAction />
        </View>

        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>
            구체적인 상황을 알려주세요
            <Text style={styles.requiredAsterisk}> *</Text>
          </Text>
          <Text style={styles.createSectionSub}>
            어떤 배경이 있었고, 당시 어떻게 대처했나요?
          </Text>
          <DetailSituationInputAction />
        </View>

        <View style={styles.createSection}>
          <Text style={styles.createSectionTitle}>파일 첨부</Text>
          <Text style={styles.createSectionSub}>
            참고할만한 이미지가 있다면 업로드해주세요
          </Text>
          <ImageAttachmentPickerAction />
        </View>

        <VoteOptionSettingArea />
      </ScrollView>

      <View
        style={[styles.floatingButtonContainer, { bottom: buttonBottomOffset }]}
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
  createSection: {
    marginBottom: 4,
  },
  createSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 10,
  },
  requiredAsterisk: {
    color: '#FF5D7B',
    fontWeight: '800',
  },
  createSectionSub: {
    fontSize: 13,
    color: '#8F8F8F',
    lineHeight: 18,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  floatingButtonContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    zIndex: 100,
  },
});
