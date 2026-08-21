import React from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CategorySelectAction } from './_action/CategorySelect.action';
import { QuestionTitleInputAction } from './_action/QuestionTitleInput.action';
import { DetailSituationInputAction } from './_action/DetailSituationInput.action';
import { ImageAttachmentPickerAction } from './_action/ImageAttachmentPicker.action';
import { VoteOptionSettingArea } from './_area/VoteOptionSetting.area';
import { useCreateForm } from './_state/useCreateForm';
import { useToastStore } from '@/_state/useToastStore';

export default function CreateScreen() {
  const insets = useSafeAreaInsets();
  const isEditMode = useCreateForm(state => state.isEditMode);
  const reset = useCreateForm(state => state.reset);

  const navBottom = insets.bottom > 0 ? insets.bottom : 16;
  const bottomNavHeight = 63;
  const scrollBottomPadding = navBottom + bottomNavHeight + 24;

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
        {isEditMode && (
          <View style={styles.editBannerContainer}>
            <View style={styles.editBannerLeft}>
              <View style={styles.editBadge}>
                <Text style={styles.editBadgeText}>수정 모드</Text>
              </View>
              <Text style={styles.editBannerText}>사연을 수정하는 중입니다</Text>
            </View>
            <TouchableOpacity
              style={styles.cancelEditBtn}
              onPress={() => {
                reset();
                useToastStore.showToast('새 글 작성 모드로 전환되었습니다.');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelEditBtnText}>새 글 쓰기</Text>
            </TouchableOpacity>
          </View>
        )}

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
  editBannerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF0F3',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: '#FFE0E5',
    marginBottom: -6,
  },
  editBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editBadge: {
    backgroundColor: '#FF5D7B',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  editBannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF5D7B',
    letterSpacing: -0.3,
  },
  cancelEditBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FFD3DC',
  },
  cancelEditBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8F8F8F',
    letterSpacing: -0.2,
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
});
