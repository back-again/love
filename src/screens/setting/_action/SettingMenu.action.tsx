'use client';

import React from 'react';
import { SettingMenuItem } from '../_component/SettingMenuItem';
import { useSettingStore } from '../_state/useSettingStore';

export function SettingMenuAction() {
  const setActiveSubView = useSettingStore((state) => state.setActiveSubView);

  return (
    <>
      <SettingMenuItem
        label="이용 약관"
        onPress={() => setActiveSubView('terms')}
      />
      <SettingMenuItem
        label="개인정보처리방침"
        onPress={() => setActiveSubView('privacy')}
      />
      <SettingMenuItem
        label="계정 설정"
        onPress={() => setActiveSubView('settings')}
        isLast
      />
    </>
  );
}
