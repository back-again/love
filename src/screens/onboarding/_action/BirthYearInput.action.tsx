'use client';

import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { useOnboardingForm } from '../_state/useOnboardingForm';
import { getBirthYearErrorMessage } from '../_model/onboardingValidation';

export function BirthYearInputAction() {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const { birthYear, setBirthYear } = useOnboardingForm(
    useShallow((state) => ({
      birthYear: state.birthYear,
      setBirthYear: state.setBirthYear,
    }))
  );

  const birthYearErrorMessage = getBirthYearErrorMessage(birthYear);

  return (
    <>
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
    color: '#FF858F',
    letterSpacing: -0.3,
    lineHeight: 22,
  },
});
