import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TermsBottomSheet from '@/components/TermsBottomSheet';
import { FormArea } from './_area/Form.area';
import { OnboardingSubmitAction } from './_action/OnboardingSubmit.action';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [termsModalType, setTermsModalType] = useState<
    'terms' | 'privacy' | null
  >(null);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FormArea
          onOpenTerms={() => setTermsModalType('terms')}
          onOpenPrivacy={() => setTermsModalType('privacy')}
        />
        <OnboardingSubmitAction />
      </ScrollView>

      <TermsBottomSheet
        visible={termsModalType !== null}
        contentType={termsModalType || 'terms'}
        onClose={() => setTermsModalType(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
});
