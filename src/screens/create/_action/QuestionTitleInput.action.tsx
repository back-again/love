'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCreateForm } from '../_state/useCreateForm';
import { AnimatedTextInputField } from '../_component/AnimatedTextInputField';

export function QuestionTitleInputAction() {
  const { questionTitle, setQuestionTitle } = useCreateForm(
    useShallow((state) => ({
      questionTitle: state.questionTitle,
      setQuestionTitle: state.setQuestionTitle,
    }))
  );

  return (
    <AnimatedTextInputField
      height={56}
      placeholder="예시) 여사친이랑 단둘이 코노 가는 남친, 괜찮아?"
      placeholderTextColor="#8F8F8F"
      maxLength={20}
      value={questionTitle}
      onChangeText={setQuestionTitle}
      charCounter={{ current: questionTitle.length, max: 20 }}
    />
  );
}
