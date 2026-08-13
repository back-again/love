'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useOnboardingForm } from '../_state/useOnboardingForm';
import { getDatingDateErrorMessage } from '../_model/onboardingValidation';

export function DatingStartDateInputAction() {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { birthYear, datingStartedAt, setDatingStartedAt } = useOnboardingForm(
    useShallow((state) => ({
      birthYear: state.birthYear,
      datingStartedAt: state.datingStartedAt,
      setDatingStartedAt: state.setDatingStartedAt,
    }))
  );

  const handleTextChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '');
    let formatted = clean;
    if (clean.length > 4 && clean.length <= 6) {
      formatted = `${clean.slice(0, 4)}-${clean.slice(4)}`;
    } else if (clean.length > 6) {
      formatted = `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
    }
    setDatingStartedAt(formatted);
  };

  const datingDateErrorMessage = getDatingDateErrorMessage(datingStartedAt, birthYear);

  return (
    <>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.textInput,
            isInputFocused && styles.textInputFocused,
            datingStartedAt.length > 0 && datingDateErrorMessage !== null && styles.textInputError,
          ]}
          placeholder="YYYY-MM-DD (예: 2025-08-13)"
          placeholderTextColor="#BCBCBC"
          keyboardType="numeric"
          maxLength={10}
          value={datingStartedAt}
          onChangeText={handleTextChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </View>
      {datingStartedAt.length > 0 && datingDateErrorMessage ? (
        <View style={styles.validationNotice}>
          <Text style={styles.validationText}>{datingDateErrorMessage}</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
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
    borderColor: '#FFD1DC',
    borderWidth: 1,
  },
  textInputError: {
    borderColor: '#FF5D7B',
    borderWidth: 1,
  },
  validationNotice: {
    marginTop: 8,
    gap: 4,
  },
  validationText: {
    fontSize: 16,
    color: '#FF5D7B',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
});
