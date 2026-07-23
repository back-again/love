import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import TermsBottomSheet from './TermsBottomSheet';

interface OnboardingScreenProps {
  user: any;
  onComplete: (data: any) => void;
}

export default function OnboardingScreen({ user, onComplete }: OnboardingScreenProps) {
  const [gender, setGender] = useState<'male' | 'female'>('female'); // Default '여' selected as in mockup
  const [birthYear, setBirthYear] = useState('');
  const [notificationAllowed, setNotificationAllowed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy' | null>(null);

  // Dynamic birth year validation
  const getBirthYearErrorMessage = () => {
    if (!birthYear || birthYear.length < 4) {
      return null; // 입력 전이거나 4자리 미만 시 에러 문구 전혀 표시 안 함
    }
    const yearNum = parseInt(birthYear, 10);
    if (isNaN(yearNum)) {
      return null;
    }
    const currentYear = new Date().getFullYear();

    // 1920년 미만 또는 현재 연도 초과 시
    if (yearNum < 1920 || yearNum > currentYear) {
      return '출생년도를 다시 확인해주세요.';
    }
    // 만 14세 미만인 경우
    if (currentYear - yearNum < 14) {
      return '14세 이상부터 이용 가능합니다.';
    }
    return null; // 정상 유효 범위 시 에러 안 뜸
  };

  const birthYearErrorMessage = getBirthYearErrorMessage();
  const isBirthYearValid = birthYear.length === 4 && birthYearErrorMessage === null;
  const isFormComplete = isBirthYearValid && termsAgreed;

  const handleStart = () => {
    setHasSubmittedAttempt(true);

    if (!isFormComplete) {
      if (Platform.OS === 'web') {
        alert('필수 입력란을 확인해주세요');
      } else {
        Alert.alert('안내', '필수 입력란을 확인해주세요');
      }
      return;
    }

    onComplete({
      gender,
      birthYear,
      notificationAllowed,
      termsAgreed,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          
          {/* 1. 성별 (Gender) Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>성별</Text>
            <View style={styles.genderRow}>
              {/* 남 (Male) Button */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonSelected
                ]}
                onPress={() => setGender('male')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'male' && styles.genderButtonTextSelected
                ]}>
                  남
                </Text>
              </TouchableOpacity>

              {/* 여 (Female) Button */}
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonSelected
                ]}
                onPress={() => setGender('female')}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'female' && styles.genderButtonTextSelected
                ]}>
                  여
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 2. 출생년도 (Birth Year) Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              출생년도 {hasSubmittedAttempt && !isBirthYearValid && <Text style={styles.asterisk}>*</Text>}
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.textInput,
                  isInputFocused && styles.textInputFocused,
                  birthYearErrorMessage !== null && styles.textInputError,
                ]}
                placeholder="YYYY"
                placeholderTextColor="#BCBCBC"
                keyboardType="numeric"
                maxLength={4}
                value={birthYear}
                onChangeText={setBirthYear}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            </View>
            {birthYearErrorMessage ? (
              <View style={styles.validationNotice}>
                <Text style={styles.validationText}>{birthYearErrorMessage}</Text>
              </View>
            ) : null}
          </View>

          {/* 3. 알림 허용 (Notification Permission) Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.sectionTitleHasSubtitle]}>알림 허용</Text>
            <Text style={styles.sectionSubtitle}>
              고민에 대한 투표나 댓글이 등록될 시 즉시 알려드릴게요.
            </Text>
            <TouchableOpacity
              style={[
                styles.allowButton,
                notificationAllowed && styles.allowButtonSelected
              ]}
              onPress={() => setNotificationAllowed(!notificationAllowed)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.allowButtonText,
                notificationAllowed && styles.allowButtonTextSelected
              ]}>
                허용
              </Text>
            </TouchableOpacity>
          </View>

          {/* 4. 동의 항목 (Terms Agreement) Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              동의 항목 {hasSubmittedAttempt && !termsAgreed && <Text style={styles.asterisk}>*</Text>}
            </Text>
            <View style={styles.termsRow}>
              {/* Custom Checkbox */}
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  termsAgreed && styles.checkboxChecked
                ]}
                onPress={() => setTermsAgreed(!termsAgreed)}
                activeOpacity={0.8}
              >
                {termsAgreed && (
                  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke="#FFFFFF"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </TouchableOpacity>

              {/* Terms Text Content */}
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsTitle}>[필수] 만 14세 이상 서비스 동의</Text>
                <Text style={styles.termsDescription}>
                  본인은 만 14세 이상이며,{' '}
                  <Text
                    style={styles.underline}
                    onPress={() => setTermsModalType('terms')}
                  >
                    이용약관
                  </Text>{' '}
                  및{' '}
                  <Text
                    style={styles.underline}
                    onPress={() => setTermsModalType('privacy')}
                  >
                    개인정보 처리방침
                  </Text>
                  에 동의합니다.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Bottom Action Button: 시작하기 */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.startButton,
              isFormComplete && styles.startButtonActive
            ]}
            onPress={handleStart}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.startButtonText,
              isFormComplete && styles.startButtonTextActive
            ]}>
              시작하기
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Terms of Service & Privacy Policy Bottom Sheet Modal */}
      <TermsBottomSheet
        visible={termsModalType !== null}
        contentType={termsModalType || 'terms'}
        onClose={() => setTermsModalType(null)}
      />
    </SafeAreaView>
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
  formContainer: {
    gap: 30,
  },
  section: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionTitleHasSubtitle: {
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#9C9C9C',
    marginBottom: 12,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  
  // Gender selection styles
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  genderButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EBEBEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: '#FFF7F5', // Subtle peach tint
    borderColor: '#FFC8B3',     // Soft peach/orange border
    borderWidth: 1.5,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  genderButtonTextSelected: {
    color: '#FF8E7A', // Peach/orange text
    fontWeight: '700',
  },

  // Birth Year input styles
  inputWrapper: {
    width: '100%',
  },
  textInput: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0F172A',
  },
  textInputFocused: {
    borderColor: '#FFC8B3',
    borderWidth: 1.5,
  },
  textInputError: {
    borderColor: '#FF858F',
    borderWidth: 1.5,
  },
  validationNotice: {
    marginTop: 8,
    gap: 4,
  },
  validationText: {
    fontSize: 16,
    color: '#FF858F', // Error state stroke & text color
    letterSpacing: -0.3,
    lineHeight: 22,
  },

  // Notification button styles
  allowButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonSelected: {
    backgroundColor: '#FFF7F5',
    borderColor: '#FFC8B3',
    borderWidth: 1.5,
  },
  allowButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  allowButtonTextSelected: {
    color: '#FF8E7A',
    fontWeight: '700',
  },

  // Terms Agreement styles
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#EBEBEB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#FF8E7A',
    borderColor: '#FF8E7A',
  },
  termsTextContainer: {
    flex: 1,
    gap: 4,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  termsDescription: {
    fontSize: 16,
    color: '#9C9C9C',
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  underline: {
    textDecorationLine: 'underline',
    color: '#9C9C9C',
  },

  // Bottom Action Button styles
  bottomContainer: {
    width: '100%',
    marginTop: 40,
  },
  startButton: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#EBEBEB',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: -0.3,
  },
  startButtonActive: {
    backgroundColor: '#FF8E7A', // Darkest main brand color
    borderColor: '#FF8E7A',
    shadowColor: '#FF8E7A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonTextActive: {
    color: '#FFFFFF', // White text when form is complete
  },
  asterisk: {
    color: '#FF858F', // Alert color for missing required fields
    fontWeight: 'bold',
  },
});
