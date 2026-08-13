import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TermsBottomSheet from '@/components/TermsBottomSheet';
import { FormArea } from './_area/Form.area';
import { OnboardingSubmitAction } from './_action/OnboardingSubmit.action';

import { User } from '@/types/database.types';

interface OnboardingScreenProps {
  user?: User;
  onComplete?: (userData: User) => void;
}

export default function OnboardingScreen({
  user,
  onComplete,
}: OnboardingScreenProps) {
  const insets = useSafeAreaInsets();
  const [termsModalType, setTermsModalType] = useState<
    'terms' | 'privacy' | null
  >(null);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: insets.bottom },
      ]}
    >
      <View style={[styles.topGlassHeaderWrapper, { paddingTop: insets.top }]}>
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.45)',
            'rgba(255, 255, 255, 0.15)',
            'rgba(255, 255, 255, 0.05)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>가입</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60 + 28 },
        ]}
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
  topGlassHeaderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.45)',
    backgroundColor: Platform.OS === 'web' ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.45)',
    ...(Platform.OS === 'web'
      ? {
          backdropFilter: 'blur(30px) saturate(210%)',
          WebkitBackdropFilter: 'blur(30px) saturate(210%)',
        }
      : {}),
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 6,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    transform: [{ scaleX: 1.05 }],
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxWidth: 450,
    width: '100%',
    alignSelf: 'center',
  },
});
