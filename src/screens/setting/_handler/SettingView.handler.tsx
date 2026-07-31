import React from 'react';
import { SettingMenuArea } from '../_area/SettingMenu.area';
import { SettingTermsArea } from '../_area/SettingTerms.area';
import { SettingPrivacyArea } from '../_area/SettingPrivacy.area';
import { SettingAccountArea } from '../_area/SettingAccount.area';
import { useSettingStore } from '../_state/useSettingStore';

export function SettingViewHandler() {
  const activeSubView = useSettingStore(state => state.activeSubView);

  switch (activeSubView) {
    case 'terms':
      return <SettingTermsArea />;
    case 'privacy':
      return <SettingPrivacyArea />;
    case 'settings':
      return <SettingAccountArea />;
    default:
      return <SettingMenuArea />;
  }
}
